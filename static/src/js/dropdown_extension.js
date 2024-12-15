/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.CustomDropdown = publicWidget.Widget.extend({
  selector: ".nav-item.dropdown",
  events: {
    click: "_onClickDropdown",
    "show.bs.dropdown": "_onDropdownShow",
    "hide.bs.dropdown": "_onDropdownHide",
    "click .dropdown-menu": "_onClickMenu",
    "click .dropdown-menu a": "_onClickLink",
  },

  /**
   * @override
   */
  start() {
    this.$icon = this.$el.find(".pbmit-base-icon-angle-right");
    this._bindResizeHandler();
    return this._super(...arguments);
  },

  /**
   * Bind resize handler for responsive behavior
   * @private
   */
  _bindResizeHandler() {
    // Initial check
    this._checkMobileMode();

    // Bind resize event
    $(window).on("resize.dropdown", () => {
      this._checkMobileMode();
    });
  },

  /**
   * Check if we're in mobile mode and update functionality accordingly
   * @private
   */
  _checkMobileMode() {
    const MOBILE_BREAKPOINT = 1200;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobile) {
      this.$el.addClass("mobile-dropdown");
      this.$el.find(".dropdown-toggle").attr("data-bs-auto-close", "false");
    } else {
      this.$el.removeClass("mobile-dropdown");
      this.$icon.removeClass("rotated");
      this.$el.find(".dropdown-toggle").attr("data-bs-auto-close", "true");
    }
  },

  /**
   * Handle clicks on navigation links
   * @param {Event} ev
   */
  _onClickLink(ev) {
    if (this.$el.hasClass("mobile-dropdown")) {
      ev.preventDefault();
      const $link = $(ev.currentTarget);
      const href = $link.attr("href");

      // Add loading state to the clicked link
      $link.addClass("link-loading");

      // Store the dropdown state in sessionStorage
      if (href) {
        sessionStorage.setItem(
          "lastOpenDropdown",
          this.$el.find("> a").text().trim()
        );

        // Delay navigation slightly to show loading state
        setTimeout(() => {
          window.location.href = href;
        }, 100);
      }
    }
  },

  /**
   * Handle dropdown click events
   * @param {Event} ev
   */
  _onClickDropdown(ev) {
    if (!this.$el.hasClass("mobile-dropdown")) {
      return;
    }

    const $target = $(ev.target);

    if ($target.is("a") || $target.parents("a").length > 0) {
      return;
    }

    if ($target.is("img") || $target.parents("img").length > 0) {
      return;
    }

    if (
      !$target.hasClass("dropdown-toggle") &&
      !$target.parents(".dropdown-toggle").length &&
      !$target.parents(".dropdown-menu").length
    ) {
      const $dropdownToggle = this.$el.find(".dropdown-toggle");

      ev.preventDefault();
      ev.stopPropagation();

      $dropdownToggle.dropdown("toggle");
    }
  },

  /**
   * Prevent dropdown menu clicks from closing the dropdown
   * @param {Event} ev
   */
  _onClickMenu(ev) {
    if (this.$el.hasClass("mobile-dropdown")) {
      const $target = $(ev.target);
      if (!$target.is("a") && !$target.parents("a").length) {
        ev.stopPropagation();
      }
    }
  },

  /**
   * Handle dropdown show event
   * @param {Event} ev
   */
  _onDropdownShow(ev) {
    if (this.$el.hasClass("mobile-dropdown")) {
      this.$icon.addClass("rotated");
    }
  },

  /**
   * Handle dropdown hide event
   * @param {Event} ev
   */
  _onDropdownHide(ev) {
    this.$icon.removeClass("rotated");
  },

  /**
   * @override
   */
  destroy() {
    $(window).off("resize.dropdown");
    this._super(...arguments);
  },
});

// Add CSS for dropdown styling and icon rotation
const style = document.createElement("style");
style.textContent = `
    .nav-item.dropdown.mobile-dropdown {
        cursor: pointer;
    }
    
    .nav-item.dropdown.mobile-dropdown .dropdown-menu a {
        cursor: pointer;
        transition: opacity 0.2s ease;
    }
    
    .nav-item.dropdown.mobile-dropdown .dropdown-menu a.link-loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .pbmit-base-icon-angle-right {
        transition: transform 0.3s ease;
        display: inline-block;
    }
    
    .pbmit-base-icon-angle-right.rotated {
        transform: rotate(90deg);
    }

    @media (min-width: 1200px) {
        .nav-item.dropdown:not(.mobile-dropdown) .pbmit-base-icon-angle-right {
            display: none;
        }
    }
`;
document.head.appendChild(style);

export default publicWidget.registry.CustomDropdown;
