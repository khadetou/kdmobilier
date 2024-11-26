from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale, TableCompute
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.http_routing.models.ir_http import slug
from odoo.osv import expression


class KdWebsiteSale(WebsiteSale):

    @http.route(["/shop/products/load_more"], type="json", auth="public", website=True)
    def load_more_products(self, page=1, category=None, search="", attrib=None, **post):
        print("\n=== LOADING MORE PRODUCTS ===")
        print(f"Page requested: {page}")

        try:
            if not page:
                return {"products_html": ""}

            website = request.env["website"].get_current_website()
            ppg = website.shop_ppg or 20

            # Build domain
            domain = website.sale_product_domain()

            # Search domain
            if search:
                for srch in search.split(" "):
                    domain = expression.AND(
                        [
                            domain,
                            [
                                "|",
                                "|",
                                "|",
                                ("name", "ilike", srch),
                                ("description", "ilike", srch),
                                ("description_sale", "ilike", srch),
                                ("product_variant_ids.default_code", "ilike", srch),
                            ],
                        ]
                    )

            # Category domain
            if category:
                domain = expression.AND(
                    [domain, [("public_categ_ids", "child_of", int(category))]]
                )

            # Attribute domain
            attrib_list = []
            if attrib:
                if isinstance(attrib, str):
                    attrib_list = [int(x) for x in attrib.split("-")]
                else:
                    attrib_list = [int(x) for x in attrib]

                attrib = None
                if attrib_list:
                    attrib = attrib_list[0]
                    if attrib:
                        for value in attrib_list[1:]:
                            domain = expression.AND(
                                [
                                    domain,
                                    [("attribute_line_ids.value_ids", "in", value)],
                                ]
                            )

            # Search products
            Product = request.env["product.template"].with_context(bin_size=True)
            product_count = Product.search_count(domain)

            pager = website.pager(
                url="/shop", total=product_count, page=page, step=ppg, scope=7
            )

            # Get default sort order
            order = post.get("order", "website_sequence ASC")
            if not order:
                order = "website_sequence ASC"

            # Search products
            products = Product.search(
                domain, limit=ppg, offset=pager["offset"], order=order
            )

            if not products:
                return {"products_html": "", "has_more": False}

            values = {
                "bins": TableCompute().process(products, ppg),
                "products": products,
            }

            # Render only products
            products_html = (
                request.env["ir.ui.view"]
                ._render_template("website_sale.products_list_view", values)
                .decode("utf-8")
            )

            has_more = len(products) >= ppg
            remaining = product_count - (page * ppg)

            return {
                "products_html": products_html,
                "has_more": has_more,
                "remaining": remaining,
                "products_count": len(products),
            }

        except Exception as e:
            print(f"Error occurred: {str(e)}")
            import traceback

            print(traceback.format_exc())
            return {"error": str(e), "products_html": ""}
