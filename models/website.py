from odoo import fields, models
import logging

_logger = logging.getLogger(__name__)


class Website(models.Model):
    _inherit = "website"

    prevent_zero_price_sale_text = fields.Char(
        string="Text to show instead of price",
        translate=True,
        default="✨ Produit sur mesure - Visitez notre showroom pour découvrir nos collections exclusives ✨",
    )
