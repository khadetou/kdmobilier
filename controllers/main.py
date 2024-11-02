from odoo import http
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale


class KdMobilierWebsiteSale(WebsiteSale):
    @http.route()
    def shop(self, page=0, category=None, search="", ppg=False, **post):
        # Inherit the shop method to ensure category is always available
        response = super().shop(
            page=page, category=category, search=search, ppg=ppg, **post
        )

        if isinstance(response, dict):
            if not response.get("category"):
                response["category"] = request.env["product.public.category"]

        return response
