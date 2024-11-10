/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.leatherPreview = publicWidget.Widget.extend({
  selector: ".leather-collections",

  events: {
    "click .leather-type-info": "_onTypeClick",
  },

  /**
   * Leather type descriptions
   * @private
   */
  leatherDescriptions: {
    lisse: {
      title: "Cuir Lisse",
      description:
        "Cuir pleine fleur de haute qualité, doux au toucher et à l'aspect raffiné. Sa surface lisse et élégante met en valeur la beauté naturelle du cuir. Idéal pour un style sophistiqué et intemporel.",
    },
    graine: {
      title: "Cuir Grainé",
      description:
        "Cuir caractérisé par sa texture naturellement grainée. Sa surface texturée offre une excellente résistance aux marques et rayures. Un choix parfait pour allier élégance et durabilité au quotidien.",
    },
    texture: {
      title: "Cuir Texturé",
      description:
        "Cuir au caractère unique avec un relief distinctif. Sa texture prononcée apporte une dimension tactile et visuelle supplémentaire. Particulièrement apprécié pour son originalité et sa personnalité affirmée.",
    },
  },

  /**
   * @override
   */
  start() {
    this._super(...arguments);
    this._initializeModal();
    return this;
  },

  /**
   * Initialize Bootstrap modal
   * @private
   */
  _initializeModal() {
    if (!document.getElementById("leatherTypeModal")) {
      const modalHTML = `
                <div class="modal fade" id="leatherTypeModal" tabindex="-1" aria-labelledby="leatherTypeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="leatherTypeModalLabel">Types de Cuir</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row g-3">
                                    <!-- Art Royal -->
                                    <div class="col-12 col-md-4">
                                        <div class="leather-preview-card h-100">
                                            <h6 class="text-center mb-3">${this.leatherDescriptions.lisse.title}</h6>
                                            <div class="leather-samples d-flex flex-wrap justify-content-center" id="artRoyalSamples">
                                                <div class="main-leather-image mb-3">
                                                    <img src="" alt="Cuir Lisse" class="img-fluid rounded leather-type-img"/>
                                                </div>
                                            </div>
                                            <div class="leather-description">
                                                <p class="text-muted small">${this.leatherDescriptions.lisse.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Dollaro -->
                                    <div class="col-12 col-md-4">
                                        <div class="leather-preview-card h-100">
                                            <h6 class="text-center mb-3">${this.leatherDescriptions.graine.title}</h6>
                                            <div class="leather-samples d-flex flex-wrap justify-content-center" id="dollaroSamples">
                                                <div class="main-leather-image mb-3">
                                                    <img src="" alt="Cuir Grainé" class="img-fluid rounded leather-type-img"/>
                                                </div>
                                            </div>
                                            <div class="leather-description">
                                                <p class="text-muted small">${this.leatherDescriptions.graine.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Statuto -->
                                    <div class="col-12 col-md-4">
                                        <div class="leather-preview-card h-100">
                                            <h6 class="text-center mb-3">${this.leatherDescriptions.texture.title}</h6>
                                            <div class="leather-samples d-flex flex-wrap justify-content-center" id="statutoSamples">
                                                <div class="main-leather-image mb-3">
                                                    <img src="" alt="Cuir Texturé" class="img-fluid rounded leather-type-img"/>
                                                </div>
                                            </div>
                                            <div class="leather-description">
                                                <p class="text-muted small">${this.leatherDescriptions.texture.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    this._initializeLeatherSamples();
  },

  /**
   * Initialize leather samples in modal
   * @private
   */
  _initializeLeatherSamples() {
    const samples = {
      artRoyal: document.querySelector('[data-value_name^="Art Royal"]'),
      dollaro: document.querySelector('[data-value_name^="Dollaro"]'),
      statuto: document.querySelector('[data-value_name^="Statuto"]'),
    };

    if (samples.artRoyal)
      this._populateSampleImage(samples.artRoyal, "artRoyalSamples");
    if (samples.dollaro)
      this._populateSampleImage(samples.dollaro, "dollaroSamples");
    if (samples.statuto)
      this._populateSampleImage(samples.statuto, "statutoSamples");
  },

  /**
   * Populate sample image in modal
   * @private
   */
  _populateSampleImage(sample, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const valueId = sample.getAttribute("data-value_id");
    if (!valueId) return;

    const imgEl = container.querySelector(".leather-type-img");
    if (imgEl) {
      imgEl.src = `/web/image/product.template.attribute.value/${valueId}/image`;
    }
  },

  /**
   * Handle type click
   * @private
   * @param {Event} ev
   */
  _onTypeClick(ev) {
    ev.preventDefault();
    const modalEl = document.getElementById("leatherTypeModal");
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  },
});
