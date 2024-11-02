from odoo import models
from odoo.addons.http_routing.models.ir_http import slug
from odoo.addons.website.controllers.main import QueryURL


class Website(models.Model):
    _inherit = "website"

    def get_ecommerce_categories(self):
        """Get the categories to be displayed on the website."""
        categories = self.env["product.public.category"].search(
            [("parent_id", "=", False), ("website_id", "in", (False, self.id))]
        )
        return categories
