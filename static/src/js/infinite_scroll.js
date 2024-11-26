// /** @odoo-module **/
// import publicWidget from "@web/legacy/js/public/public_widget";
// import { jsonrpc } from "@web/core/network/rpc_service";
// import { debounce } from "@web/core/utils/timing";

// publicWidget.registry.KDMobilierInfiniteScroll = publicWidget.Widget.extend({
//   selector: ".o_wsale_products_page",
//   events: {
//     "click .retry-load": "_onRetryClick",
//   },

//   /**
//    * @override
//    */
//   init() {
//     console.log("🚀 Initializing Infinite Scroll");
//     this._super(...arguments);
//     this.page = 1;
//     this.isLoading = false;
//     this.hasMoreProducts = true;
//     this.productsContainer = null;
//     this.loadingElement = null;
//     this.errorElement = null;
//     this.retryCount = 0;
//     this.maxRetries = 3;
//     this.scrollCount = 0;
//     this.initialLoad = true; // Flag pour le premier chargement

//     // Test if debounce is working
//     try {
//       const testDebounce = debounce(() => {}, 100);
//       console.log("✅ Debounce function test successful");
//     } catch (e) {
//       console.error("❌ Debounce function test failed:", e);
//     }

//     this._boundScrollHandler = debounce(() => this._onScroll(), 200);
//     console.log("✅ Scroll handler bound");

//     console.log("✅ Initialization complete", {
//       page: this.page,
//       isLoading: this.isLoading,
//       hasMoreProducts: this.hasMoreProducts,
//     });
//   },

//   /**
//    * @override
//    */
//   start() {
//     console.log("🏁 Starting Infinite Scroll setup");
//     this._super(...arguments);

//     this.productsContainer = this.el.querySelector("#products_grid .row");
//     console.log("Looking for products container:", "#products_grid .row");

//     if (!this.productsContainer) {
//       console.error("❌ Products container not found!");
//       return;
//     }
//     console.log("✅ Products container found");

//     const initialProducts =
//       this.productsContainer.querySelectorAll(".pbmit-ele-blog").length;
//     console.log(`📦 Initial products count: ${initialProducts}`);

//     this._setupUI();
//     this._bindScrollEvent();

//     // Délai initial pour éviter le chargement immédiat
//     setTimeout(() => {
//       this.initialLoad = false;
//       console.log("🔄 Initial delay completed, scroll detection active");
//     }, 1000);

//     return this._super(...arguments);
//   },

//   /**
//    * @override
//    */
//   destroy() {
//     console.log("🗑️ Destroying Infinite Scroll");
//     this._unbindScrollEvent();
//     if (this.loadingElement) {
//       this.loadingElement.remove();
//       console.log("✅ Loading element removed");
//     }
//     if (this.errorElement) {
//       this.errorElement.remove();
//       console.log("✅ Error element removed");
//     }
//     this._super(...arguments);
//   },

//   //--------------------------------------------------------------------------
//   // Private
//   //--------------------------------------------------------------------------

//   /**
//    * Set up UI elements
//    * @private
//    */
//   _setupUI() {
//     console.log("🎨 Setting up UI elements");
//     this._removePager();
//     this._createLoadingElement();
//     this._createErrorElement();
//     console.log("✅ UI setup complete");
//   },

//   /**
//    * Remove existing pager
//    * @private
//    */
//   _removePager() {
//     const pagerContainer = this.el.querySelector(".products_pager");
//     console.log("Looking for pager:", pagerContainer);
//     if (pagerContainer) {
//       pagerContainer.remove();
//       console.log("✅ Pager removed");
//     } else {
//       console.log("ℹ️ No pager found");
//     }
//   },

//   /**
//    * Create loading spinner element
//    * @private
//    */
//   _createLoadingElement() {
//     console.log("Creating loading element");
//     this.loadingElement = document.createElement("div");
//     this.loadingElement.className = "text-center py-4 products_loading";
//     this.loadingElement.innerHTML = `
//             <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
//                 <span class="visually-hidden">Loading more products...</span>
//             </div>
//         `;
//     this.productsContainer.closest("#products_grid").after(this.loadingElement);
//     this.loadingElement.style.display = "none";
//     console.log("✅ Loading element created");
//   },

//   /**
//    * Create error message element
//    * @private
//    */
//   _createErrorElement() {
//     console.log("Creating error element");
//     this.errorElement = document.createElement("div");
//     this.errorElement.className =
//       "alert alert-danger text-center my-3 products_error";
//     this.errorElement.innerHTML = `
//             <p class="mb-0">Failed to load more products. <button class="btn btn-link p-0 retry-load">Try again</button></p>
//         `;
//     this.loadingElement.after(this.errorElement);
//     this.errorElement.style.display = "none";
//     console.log("✅ Error element created");
//   },

//   /**
//    * Bind scroll event listener
//    * @private
//    */
//   _bindScrollEvent() {
//     console.log("🎯 Binding scroll event");
//     window.addEventListener("scroll", this._boundScrollHandler, {
//       passive: true,
//     });
//     console.log("✅ Scroll event bound");
//   },

//   /**
//    * Unbind scroll event listener
//    * @private
//    */
//   _unbindScrollEvent() {
//     console.log("Unbinding scroll event");
//     window.removeEventListener("scroll", this._boundScrollHandler);
//     console.log("✅ Scroll event unbound");
//   },

//   /**
//    * Check if we should load more products
//    * @private
//    * @returns {boolean}
//    */
//   _checkScroll() {
//     // Ignorer le check pendant le chargement initial
//     if (this.initialLoad) {
//       console.log("⏳ Initial load - ignoring scroll check");
//       return false;
//     }

//     const scrollY = window.scrollY;
//     const viewportHeight = window.innerHeight;
//     const documentHeight = document.documentElement.offsetHeight;
//     const bottomOffset = 200;
//     const remainingScroll = documentHeight - (scrollY + viewportHeight);

//     console.log("📊 Scroll Metrics:", {
//       scrollY,
//       viewportHeight,
//       documentHeight,
//       bottomOffset,
//       remainingScroll,
//       shouldLoadMore: remainingScroll <= bottomOffset,
//     });

//     return !this.initialLoad && remainingScroll <= bottomOffset;
//   },
//   /**
//    * Handle scroll event
//    * @private
//    */
//   _onScroll() {
//     console.log("📜 Scroll handler called", {
//       scrollCount: ++this.scrollCount,
//       isLoading: this.isLoading,
//       hasMoreProducts: this.hasMoreProducts,
//       initialLoad: this.initialLoad,
//     });

//     if (this.isLoading || !this.hasMoreProducts || this.initialLoad) {
//       console.log("🛑 Scroll ignored", {
//         reason: this.isLoading
//           ? "loading"
//           : this.initialLoad
//           ? "initial load"
//           : "no more products",
//       });
//       return;
//     }

//     if (this._checkScroll()) {
//       console.log("🎯 Loading threshold reached");
//       this._loadMoreProducts();
//     }
//   },

//   /**
//    * Load more products via AJAX
//    * @private
//    */
//   async _loadMoreProducts() {
//     if (this.isLoading) {
//       console.log("⏳ Already loading products");
//       return;
//     }

//     console.log("📦 Starting to load more products", {
//       currentPage: this.page,
//       nextPage: this.page + 1,
//     });

//     this._showLoading();
//     this._hideError();
//     this.isLoading = true;

//     try {
//       const params = {
//         page: this.page + 1,
//         category: this._getCategoryId(),
//         search: this._getSearchQuery(),
//         attrib: this._getAttributes(),
//         ppg: 20, // products per page
//       };
//       console.log("🚀 Request params:", params);

//       const response = await jsonrpc("/shop/products/load_more", params);
//       console.log("📩 Response:", response);

//       if (response.error) {
//         throw new Error(response.error);
//       }

//       if (response.products_html && response.products_html.trim()) {
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = response.products_html;

//         // Get all products from the response
//         const newProducts = tempDiv.querySelectorAll("article");
//         console.log(`Found ${newProducts.length} new products`);

//         if (newProducts.length > 0) {
//           for (const product of newProducts) {
//             // Add required classes if they don't exist
//             if (!product.classList.contains("pbmit-ele-blog")) {
//               product.classList.add(
//                 "pbmit-ele-blog",
//                 "pbmit-blog-style-1",
//                 "col-md-6",
//                 "col-lg-3"
//               );
//             }

//             // Create wrapper structure if needed
//             if (!product.querySelector(".post-item")) {
//               // Save original content
//               const originalContent = product.innerHTML;

//               // Create wrapper structure
//               const postItem = document.createElement("div");
//               postItem.className = "post-item";

//               const boxContent = document.createElement("div");
//               boxContent.className = "pbminfotech-box-content";

//               // Insert original content in new structure
//               boxContent.innerHTML = originalContent;
//               postItem.appendChild(boxContent);
//               product.innerHTML = ""; // Clear original content
//               product.appendChild(postItem);
//             }

//             // Add the product to container
//             this.productsContainer.appendChild(product);
//           }

//           this.page++;
//           this.retryCount = 0;
//           this.hasMoreProducts = response.has_more;

//           console.log("✅ Products added", {
//             addedCount: newProducts.length,
//             newPage: this.page,
//             hasMore: this.hasMoreProducts,
//             totalProducts:
//               this.productsContainer.querySelectorAll(".pbmit-ele-blog").length,
//           });
//         } else {
//           console.log("No products found in response");
//           this.hasMoreProducts = false;
//         }
//       } else {
//         console.log("No product HTML in response");
//         this.hasMoreProducts = false;
//       }
//     } catch (error) {
//       console.error("❌ Error:", error);
//       this._showError();

//       if (++this.retryCount >= this.maxRetries) {
//         console.log("🛑 Max retries reached");
//         this.hasMoreProducts = false;
//       }
//     } finally {
//       this.isLoading = false;
//       this._hideLoading();
//       console.log("⏹️ Load operation completed", {
//         page: this.page,
//         hasMore: this.hasMoreProducts,
//         retryCount: this.retryCount,
//         totalProducts:
//           this.productsContainer.querySelectorAll(".pbmit-ele-blog").length,
//       });
//     }
//   },

//   /**
//    * Show loading spinner
//    * @private
//    */
//   _showLoading() {
//     console.log("⏳ Showing loading spinner");
//     this.loadingElement.style.display = "flex";
//     this.loadingElement.style.justifyContent = "center";
//   },

//   /**
//    * Hide loading spinner
//    * @private
//    */
//   _hideLoading() {
//     console.log("Hiding loading spinner");
//     this.loadingElement.style.display = "none";
//   },

//   /**
//    * Show error message
//    * @private
//    */
//   _showError() {
//     console.log("❌ Showing error message");
//     this.errorElement.style.display = "block";
//   },

//   /**
//    * Hide error message
//    * @private
//    */
//   _hideError() {
//     console.log("✅ Hiding error message");
//     this.errorElement.style.display = "none";
//   },

//   /**
//    * Get category ID from URL
//    * @private
//    * @returns {number}
//    */
//   _getCategoryId() {
//     const categoryMatch = window.location.pathname.match(/category\/.*?(\d+)/);
//     const categoryId = categoryMatch ? parseInt(categoryMatch[1]) : 0;
//     console.log("📁 Category ID:", categoryId);
//     return categoryId;
//   },

//   /**
//    * Get search query from URL
//    * @private
//    * @returns {string}
//    */
//   _getSearchQuery() {
//     const search =
//       new URLSearchParams(window.location.search).get("search") || "";
//     console.log("🔍 Search query:", search);
//     return search;
//   },

//   /**
//    * Get attributes from URL
//    * @private
//    * @returns {Array}
//    */
//   _getAttributes() {
//     const attribs = new URLSearchParams(window.location.search).getAll(
//       "attrib"
//     );
//     console.log("🏷️ Attributes:", attribs);
//     return attribs;
//   },

//   /**
//    * Handle retry button click
//    * @private
//    * @param {Event} ev
//    */
//   _onRetryClick(ev) {
//     console.log("🔄 Retry button clicked");
//     ev.preventDefault();
//     this._loadMoreProducts();
//   },
// });

// export default publicWidget.registry.KDMobilierInfiniteScroll;
