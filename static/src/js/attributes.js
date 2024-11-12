/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.attributes = publicWidget.Widget.extend({
  selector: ".leather-collections",

  events: {
    "mouseenter .css_attribute_color": "_onColorHover",
    "mouseleave .css_attribute_color": "_onColorLeave",
    'change input[type="radio"]': "_onColorSelect",
  },

  /**
   * @override
   */
  async willStart() {
    await this._super(...arguments);
  },

  /**
   * @override
   */
  start() {
    this._super(...arguments);
    this._initializeSelectedColors();
    return this;
  },

  colorMappings: {
    // Art Royal mappings
    "Art Royal 006 - Testa di moro": "Brun foncé",
    "Art Royal 006 – Testa di moro": "Brun foncé",
    "Art Royal 003 - Tortora": "Gris tourterelle",
    "Art Royal 003 – Tortora": "Gris tourterelle",
    "Art Royal 010 - Grigio scuro": "Gris foncé",
    "Art Royal 010 – Grigio scuro": "Gris foncé",
    "Art Royal 012 - Iceblast": "Gris glacier",
    "Art Royal 012 – Iceblast": "Gris glacier",
    "Art Royal 008 - Fango": "Taupe",
    "Art Royal 008 – Fango": "Taupe",
    "Art Royal 030 - Blu notte": "Bleu nuit",
    "Art Royal 030 – Blu notte": "Bleu nuit",

    // Dollaro mappings
    "Dollaro 540 - Blu notte": "Bleu nuit",
    "Dollaro 540 – Blu notte": "Bleu nuit",
    "Dollaro 830 - Grigio perla": "Gris perle",
    "Dollaro 830 – Grigio perla": "Gris perle",
    "Dollaro 005 - Beige": "Beige",
    "Dollaro 005 – Beige": "Beige",

    // Statuto mappings
    "Statuto 051 - Cream": "Crème",
    "Statuto 051 – Cream": "Crème",
    "Statuto 324 - Turtledove": "Gris tourterelle",
    "Statuto 324 – Turtledove": "Gris tourterelle",
    "Statuto 655 - Marmotta": "Marron glacé",
    "Statuto 655 – Marmotta": "Marron glacé",
  },

  /**
   * Initialize selected colors
   * @private
   */
  _initializeSelectedColors() {
    document.querySelectorAll(".leather-collection").forEach((collection) => {
      this._updateSelectedColorForCollection(collection);
    });
  },

  /**
   * Get display name from mappings
   * @private
   */
  _getDisplayName(colorName) {
    return this.colorMappings[colorName] || colorName;
  },

  /**
   * Handle color hover
   * @private
   */
  _onColorHover(ev) {
    const input = ev.currentTarget.querySelector("input");
    if (!input) return;

    const colorName = input.dataset.value_name;
    if (!colorName) return;

    const collection = ev.currentTarget.closest(".leather-collection");
    const colorSpan = collection.querySelector(".color");
    if (colorSpan) {
      const displayName = this._getDisplayName(colorName);
      colorSpan.textContent = displayName;
    }
  },

  /**
   * Handle mouse leave
   * @private
   */
  _onColorLeave(ev) {
    const collection = ev.currentTarget.closest(".leather-collection");
    this._updateSelectedColorForCollection(collection);
  },

  /**
   * Handle color selection
   * @private
   */
  _onColorSelect(ev) {
    // Clear other collections
    document.querySelectorAll(".leather-collection").forEach((collection) => {
      const currentInput = ev.target;
      const collectionInputs = collection.querySelectorAll(
        'input[type="radio"]'
      );

      // If this collection doesn't contain the clicked input, uncheck all its inputs
      if (![...collectionInputs].includes(currentInput)) {
        collectionInputs.forEach((input) => {
          input.checked = false;
        });
        const colorSpan = collection.querySelector(".color");
        if (colorSpan) {
          colorSpan.textContent = "_";
        }
      }
    });

    // Update the selected collection
    const collection = ev.currentTarget.closest(".leather-collection");
    this._updateSelectedColorForCollection(collection);
  },

  /**
   * Update color display for a collection
   * @private
   */
  _updateSelectedColorForCollection(collection) {
    const selected = collection.querySelector('input[type="radio"]:checked');
    const colorSpan = collection.querySelector(".color");

    if (selected && colorSpan) {
      const colorName = selected.dataset.value_name;
      if (!colorName) return;

      const displayName = this._getDisplayName(colorName);
      colorSpan.textContent = displayName;
    } else if (colorSpan) {
      colorSpan.textContent = "_";
    }
  },
});

// //   {
//     name: "KD Mobilier Sacré Coeur",
//     position: { lat: 14.720039814631185, lng: -17.46587331474792 },
//     address: "Sacré Coeur 3 VDN, Dakar, Sénégal",
//   },
