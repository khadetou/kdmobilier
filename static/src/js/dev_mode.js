(function () {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    var baseUrl = "http://localhost:3000/theme_kdmobilier/static/";

    var devScript = document.createElement("script");
    devScript.src = baseUrl + "@vite/client";
    devScript.type = "module";
    console.log("Dev Script: ", devScript);
    document.head.appendChild(devScript);

    var mainScript = document.createElement("script");
    mainScript.src = baseUrl + "js/main.js";
    mainScript.type = "module";
    document.head.appendChild(mainScript);

    // var cssLink = document.createElement("link");
    // cssLink.rel = "stylesheet";
    // cssLink.href = baseUrl + "css/input.css";
    // document.head.appendChild(cssLink);
  }
})();
