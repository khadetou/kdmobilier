/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { jsonrpc } from "@web/core/network/rpc_service";

const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log("[Infinite Scroll]", ...args);
  }
}

function warn(...args) {
  if (DEBUG) {
    console.warn("[Infinite Scroll]", ...args);
  }
}

function error(...args) {
  if (DEBUG) {
    console.error("[Infinite Scroll]", ...args);
  }
}

publicWidget.registry.WebsiteSaleInfiniteScroll = publicWidget.Widget.extend({
  selector: ".oe_website_sale",

  _createLoadingElement() {
    return $(`
      <div class="o_wsale_infinite_scroll_loading d-none">
        <div class="d-flex justify-content-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <div class="ms-3 text-primary">Chargement des produits...</div>
        </div>
      </div>
    `);
  },

  start() {
    log("Widget starting...");
    this.page = 1;
    this.ppg = this.$el.data("ppg") || 20;
    this.isLoading = false;
    this.allLoaded = false;
    this.threshold =
      parseInt(this.$el.data("infinite-scroll-threshold")) || 300;

    // Convert string 'True'/'False' to boolean
    const isEnabled = true;
    const enabled =
      isEnabled === true || isEnabled === "true" || isEnabled === "True";

    const config = {
      page: this.page,
      ppg: this.ppg,
      threshold: this.threshold,
      isEnabled: enabled,
      gridFound: this.$("#products_grid").length > 0,
    };
    log("Configuration:", config);

    if (!enabled) {
      warn("Infinite scroll is not enabled in website settings");
      return this._super.apply(this, arguments);
    }

    if (!config.gridFound) {
      warn("Products grid not found");
      return this._super.apply(this, arguments);
    }

    // Hide pagination if infinite scroll is enabled
    this.$(".products_pager").addClass("d-none");

    // Add loading spinner
    const $productsGrid = this.$("#products_grid");
    if (!this.$(".o_wsale_infinite_scroll_loading").length) {
      const $loading = this._createLoadingElement();
      $productsGrid.after($loading);
    }

    // Store the handler so we can remove it later
    this._onScrollHandler = this._onScroll.bind(this);

    // Bind scroll event to #wrapwrap instead of window
    $("#wrapwrap").on("scroll", this._onScrollHandler);

    log("Widget successfully initialized");
    return this._super.apply(this, arguments);
  },

  destroy() {
    // Clean up scroll event when widget is destroyed
    if (this._onScrollHandler) {
      $("#wrapwrap").off("scroll", this._onScrollHandler);
    }
    return this._super.apply(this, arguments);
  },

  _onScroll() {
    if (this.isLoading || this.allLoaded) {
      log(
        this.isLoading
          ? "Skip scroll - already loading"
          : "Skip scroll - all products loaded"
      );
      return;
    }

    const $wrapwrap = $("#wrapwrap");
    const $footer = $("#footer");
    const scrollPosition = $wrapwrap.scrollTop() + $wrapwrap.height();
    const documentHeight = $wrapwrap[0].scrollHeight;
    const footerHeight = $footer.outerHeight() || 0;

    // Calculate remaining scroll including footer height
    const remainingScroll = documentHeight - scrollPosition;
    // Adjust threshold to include footer height plus some extra space
    const adjustedThreshold = this.threshold + footerHeight;

    log("Checking scroll position:", {
      scrollPosition,
      documentHeight,
      remainingScroll,
      footerHeight,
      threshold: adjustedThreshold,
    });

    if (remainingScroll <= adjustedThreshold) {
      log("Near bottom, loading more products...");
      this._loadMoreProducts();
    }
  },

  _formatPrice(price, currency) {
    const formattedPrice = price.toFixed(2);
    return currency.position === "before"
      ? `${currency.symbol}${formattedPrice}`
      : `${formattedPrice}${currency.symbol}`;
  },

  _createProductElement(product) {
    // Get CSRF token from meta tag
    const csrf_token = $('meta[name="csrf-token"]').attr("content") || "";

    return `
      <article class="pbmit-ele-blog pbmit-blog-style-1 col-md-6 col-lg-3">
        <div class="post-item">
          <div class="pbminfotech-box-content">
            <form action="/shop/cart/update" method="post" class="oe_product_cart h-100 d-flex pbminfotech-box-content" itemscope="itemscope" itemtype="http://schema.org/Product" data-publish="${
              product.website_published ? "on" : "off"
            }">
              <div class="oe_product_image position-relative h-100 flex-grow-0 overflow-hidden pbmit-featured-container">
                <input type="hidden" name="csrf_token" value="${csrf_token}"/>
                <a class="oe_product_image_link d-block h-100 position-relative pbmit-featured-img-wrapper" itemprop="url" contenteditable="false" href="${
                  product.website_url
                }">
                  <span class="oe_product_image_img_wrapper d-flex h-100 justify-content-center align-items-center position-absolute pbmit-featured-wrapper">
                    <img src="${product.image_url}" 
                         itemprop="image" 
                         class="img img-fluid h-100 w-100 position-absolute" 
                         alt="${product.name}" 
                         loading="lazy"/>
                  </span>
                </a>
                <a class="pbmit-link" href="${product.website_url}"></a>
                ${
                  product.ribbon.html
                    ? `<span class="o_ribbon ${product.ribbon.html_class}" style="color: ${product.ribbon.text_color}; background-color: ${product.ribbon.bg_color}">${product.ribbon.html}</span>`
                    : `<span class="o_ribbon o_not_editable" style=""></span>`
                }
              </div>
              <div class="o_wsale_product_information position-relative d-flex flex-column flex-grow-1 flex-shrink-1">
                <div class="o_wsale_product_information_text flex-grow-1">
                  <h6 class="o_wsale_products_item_title mb-2">
                    <a href="${
                      product.website_url
                    }" class="text-primary text-decoration-none" itemprop="name">${
      product.name
    }</a>
                  </h6>
                </div>
                <div class="o_wsale_product_sub d-flex justify-content-between align-items-end gap-2 flex-wrap pb-1">
                  <div class="o_wsale_product_btn">
                    <button type="button" role="button" class="btn btn-outline-primary bg-white o_add_wishlist" title="Add to Wishlist" data-action="o_wishlist" data-product-template-id="${
                      product.id
                    }">
                      <span role="img" aria-label="Add to wishlist" class="fa fa-heart-o"></span>
                    </button>
                  </div>
                  <div class="product_price" itemprop="offers" itemscope="itemscope" itemtype="http://schema.org/Offer">
                    ${
                      product.has_discounted_price
                        ? `<del class="text-muted me-2">
                        <span class="oe_currency_value">${this._formatPrice(
                          product.list_price,
                          product.currency
                        )}</span>
                       </del>
                       <span class="h6 mb-0 text-primary">
                        <span class="oe_currency_value">${this._formatPrice(
                          product.price,
                          product.currency
                        )}</span>
                       </span>`
                        : `<span class="h6 mb-0 text-primary">
                        <span class="oe_currency_value">${this._formatPrice(
                          product.price,
                          product.currency
                        )}</span>
                       </span>`
                    }
                    <span itemprop="price" style="display:none">${
                      product.price
                    }</span>
                    <span itemprop="priceCurrency" style="display:none">${
                      product.currency.name
                    }</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </article>
    `;
  },

  async _loadMoreProducts() {
    try {
      log("Loading more products - Page:", this.page + 1);
      this.isLoading = true;

      // Show loading indicator
      this.$(".o_wsale_infinite_scroll_loading").removeClass("d-none");

      // Get current URL parameters
      const urlParams = new URLSearchParams(window.location.search);

      // Get category from URL path if we're in a category page
      let category = "";
      const categoryMatch = window.location.pathname.match(
        /\/shop\/category\/[^/]+-(\d+)/
      );
      if (categoryMatch) {
        category = categoryMatch[1];
      }

      const params = {
        page: this.page + 1,
        ppg: this.ppg,
        search: urlParams.get("search") || "",
        category: category,
        attrib: urlParams.get("attrib") || "",
      };

      log("Request parameters:", params);

      const result = await jsonrpc("/shop/infinite_scroll", params);
      log("Server response:", result);

      if (result && result.products) {
        if (result.products.length > 0) {
          // Find the products container
          const $productsGrid = this.$("#products_grid .row");
          if (!$productsGrid.length) {
            error("Products grid not found");
            return;
          }

          // Add each product directly to the grid
          result.products.forEach((product) => {
            $productsGrid.append(this._createProductElement(product));
          });

          this.page++;
          log(
            "Products added successfully - New page:",
            this.page,
            "Remaining:",
            result.remaining
          );

          if (!result.has_more) {
            this.allLoaded = true;
            log("No more products available");
          }
        } else {
          this.allLoaded = true;
          log("No more products to load");
        }
      } else {
        warn("Invalid response format:", result);
        this.allLoaded = true;
      }
    } catch (err) {
      error("Failed to load products:", err);
      this.allLoaded = true;
    } finally {
      this.isLoading = false;
      this.$(".o_wsale_infinite_scroll_loading").addClass("d-none");
    }
  },
});

export default publicWidget.registry.WebsiteSaleInfiniteScroll;
