/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.CustomWishlist = publicWidget.Widget.extend({
  selector: ".o_add_wishlist",
  events: {
    click: "_onClickWishlist",
  },

  start() {
    return this._super(...arguments);
  },

  /**
   * Handle wishlist button click
   * @param {Event} ev
   */
  async _onClickWishlist(ev) {
    const $button = $(ev.currentTarget);
    const $icon = $button.find(".fa");

    // Let the original wishlist functionality execute
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Toggle heart icon
    if ($icon.hasClass("fa-heart-o")) {
      $icon.removeClass("fa-heart-o").addClass("fa-heart");
    } else {
      $icon.removeClass("fa-heart").addClass("fa-heart-o");
    }

    // Original functionality
    if ($button.hasClass("o_add_wishlist")) {
      await this._addToWishlist($button);
    }
  },

  /**
   * Add product to wishlist
   * @param {jQuery} $button
   */
  async _addToWishlist($button) {
    const productId = $button.data("product-template-id");
    const productProductId = $button.data("product-product-id");

    try {
      await this._rpc({
        route: "/shop/wishlist/add",
        params: {
          product_id: productId,
          product_product_id: productProductId,
        },
      });
    } catch (error) {
      // Handle error if needed
      console.error("Wishlist error:", error);
    }
  },
});

export default publicWidget.registry.CustomWishlist;
