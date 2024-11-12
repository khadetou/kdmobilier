/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.KDMobilierMap = publicWidget.Widget.extend({
  selector: "#map",

  start() {
    this._super(...arguments);
    this._loadGoogleMaps();
    this._addFullscreenButton();
    return this;
  },

  _loadGoogleMaps() {
    const apiKey = "";
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => this._initializeMap();

    document.head.appendChild(script);
  },

  _addFullscreenButton() {
    const mapContainer = this.el.parentElement;
    const fullscreenButton = document.createElement("a");
    fullscreenButton.href =
      "https://www.google.com/maps/search/KD+Mobilier+Dakar+Senegal";
    fullscreenButton.target = "_blank";
    fullscreenButton.className = "map-fullscreen-button";
    fullscreenButton.textContent = "Agrandir le plan";
    mapContainer.appendChild(fullscreenButton);
  },

  _initializeMap() {
    const stores = [
      {
        name: "KD Mobilier Sacré Coeur",
        position: { lat: 14.720039814631185, lng: -17.46587331474792 },
        address: "Sacré Coeur 3 VDN, Dakar, Sénégal",
      },
      {
        name: "KD Mobilier Saly",
        position: { lat: 14.444893476755823, lng: -17.005459193632046 },
        address: "Route de Saly, Saly, Sénégal",
      },
    ];

    const centerLat = (stores[0].position.lat + stores[1].position.lat) / 2;
    const centerLng = (stores[0].position.lng + stores[1].position.lng) / 2;

    const mapOptions = {
      zoom: 9,
      center: { lat: centerLat, lng: centerLng },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
    };

    const map = new google.maps.Map(this.el, mapOptions);
    const bounds = new google.maps.LatLngBounds();

    stores.forEach((store) => {
      const marker = new google.maps.Marker({
        position: store.position,
        map: map,
        title: store.name,
        animation: google.maps.Animation.DROP,
      });

      // Encoder le nom et l'adresse pour l'URL
      const encodedSearch = encodeURIComponent(
        `${store.name}, ${store.address}`
      );

      const infoWindow = new google.maps.InfoWindow({
        content: `
                    <div class="map-info-window">
                        <h5>${store.name}</h5>
                        <p>${store.address}</p>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodedSearch}" 
                           target="_blank">Voir sur Google Maps</a>
                    </div>
                `,
      });

      marker.addListener("click", () => {
        stores.forEach((s) => s.infoWindow?.close());
        infoWindow.open(map, marker);
      });

      store.infoWindow = infoWindow;
      bounds.extend(store.position);
    });

    map.fitBounds(bounds);

    const padding = { top: 50, right: 50, bottom: 50, left: 50 };
    map.fitBounds(bounds, padding);
  },
});

export default publicWidget.registry.KDMobilierMap;
