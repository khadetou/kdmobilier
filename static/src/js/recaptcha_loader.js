/**
 * Helper function to load reCAPTCHA script
 */
document.addEventListener("DOMContentLoaded", function () {
  // Check if reCAPTCHA is needed (if there are contact forms on page)
  if (
    document.querySelector(".contact-form") ||
    document.querySelector(".contact-form-designer")
  ) {
    // Get the reCAPTCHA site key from the form
    const siteKey = document.querySelector("[data-recaptcha-sitekey]")?.dataset
      .recaptchaSitekey;

    if (siteKey) {
      // Load reCAPTCHA script
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
      script.async = true;
      script.defer = true;

      script.onload = function () {
        // Render reCAPTCHA on all relevant forms
        const forms = document.querySelectorAll(
          ".contact-form, .contact-form-designer"
        );
        forms.forEach(function (form) {
          if (!form.querySelector(".g-recaptcha")) {
            const recaptchaDiv = document.createElement("div");
            recaptchaDiv.className = "g-recaptcha mb-3";
            form.appendChild(recaptchaDiv);

            grecaptcha.render(recaptchaDiv, {
              sitekey: siteKey,
            });
          }
        });
      };

      document.head.appendChild(script);
    } else {
      console.warn(
        "ReCAPTCHA site key not found. Please make sure your site key is configured correctly."
      );
    }
  }
});
