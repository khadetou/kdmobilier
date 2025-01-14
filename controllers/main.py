# -*- coding: utf-8 -*-

import logging
from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale, TableCompute
from odoo.addons.http_routing.models.ir_http import slug
from odoo.tools import float_round
from werkzeug.exceptions import NotFound

_logger = logging.getLogger(__name__)


class WebsiteSaleInfiniteScroll(WebsiteSale):

    @http.route(["/shop/infinite_scroll"], type="json", auth="public", website=True)
    def infinite_scroll(
        self, page=0, ppg=False, search="", category="", attrib="", **post
    ):
        try:
            page = int(page)
            if page < 1:
                page = 1
        except (TypeError, ValueError):
            page = 1
            _logger.warning("Invalid page number received, defaulting to 1")

        try:
            ppg = int(ppg)
        except (TypeError, ValueError):
            ppg = request.env["website"].get_current_website().shop_ppg or 20
            _logger.warning("Invalid PPG received, defaulting to %s", ppg)

        website = request.env["website"].get_current_website()
        Category = request.env["product.public.category"]

        # Handle category exactly like shop controller
        if category:
            category = Category.search([("id", "=", int(category))], limit=1)
            if not category or not category.can_access_from_current_website():
                raise NotFound()
        else:
            category = Category

        # Get attribute values
        attrib_list = request.httprequest.args.getlist("attrib")
        attrib_values = [[int(x) for x in v.split("-")] for v in attrib_list if v]
        attributes_ids = {v[0] for v in attrib_values}
        attrib_set = {v[1] for v in attrib_values}

        domain = website.sale_product_domain()
        if search:
            for srch in search.split(" "):
                domain += [
                    "|",
                    "|",
                    "|",
                    ("name", "ilike", srch),
                    ("description", "ilike", srch),
                    ("description_sale", "ilike", srch),
                    ("product_variant_ids.default_code", "ilike", srch),
                ]

        if category:
            domain += [("public_categ_ids", "child_of", int(category))]

        if attrib_values:
            attrib = None
            ids = []
            for value in attrib_values:
                if not attrib:
                    attrib = value[0]
                    ids.append(value[1])
                elif value[0] == attrib:
                    ids.append(value[1])
                else:
                    domain += [("attribute_line_ids.value_ids", "in", ids)]
                    attrib = value[0]
                    ids = [value[1]]
            if attrib:
                domain += [("attribute_line_ids.value_ids", "in", ids)]

        # Get products
        Product = request.env["product.template"].with_context(bin_size=True)
        search_product = Product.search(domain, order=self._get_search_order(post))
        total_products = len(search_product)

        # Calculate pagination
        offset = (page - 1) * ppg
        products = search_product[offset : offset + ppg]

        if not products:
            return {"products": [], "has_more": False, "remaining": 0}

        # Get fiscal position and pricelist
        fiscal_position = website.fiscal_position_id.sudo()
        pricelist = website.pricelist_id

        # Prepare product data
        products_data = []
        for product in products:
            prices = product._get_sales_prices(pricelist, fiscal_position)[product.id]
            image_url = f"/web/image/product.template/{product.id}/image_1024"

            # Handle prices safely with fallbacks
            price = prices.get("price_reduce", 0.0)
            if not price:
                price = prices.get("price", 0.0)
            if not price:
                price = product.list_price

            list_price = prices.get("base_price", product.list_price)

            product_data = {
                "id": product.id,
                "name": product.name,
                "website_url": f"/shop/product/{slug(product)}",
                "image_url": image_url,
                "price": price,
                "list_price": list_price,
                "has_discounted_price": bool(list_price and list_price > price),
                "currency": {
                    "name": pricelist.currency_id.name,
                    "symbol": pricelist.currency_id.symbol,
                    "position": pricelist.currency_id.position,
                },
                "website_published": product.website_published,
                "ribbon": {
                    "html": (
                        product.website_ribbon_id.html
                        if product.website_ribbon_id
                        else ""
                    ),
                    "text_color": (
                        product.website_ribbon_id.text_color
                        if product.website_ribbon_id
                        else "#FFFFFF"
                    ),
                    "bg_color": (
                        product.website_ribbon_id.bg_color
                        if product.website_ribbon_id
                        else "#FF0000"
                    ),
                    "html_class": (
                        product.website_ribbon_id.html_class
                        if product.website_ribbon_id
                        else ""
                    ),
                },
            }
            products_data.append(product_data)

        remaining = total_products - (offset + ppg)
        return {
            "products": products_data,
            "has_more": remaining > 0,
            "remaining": remaining if remaining > 0 else 0,
        }
