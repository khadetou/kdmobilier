console.log("Init map");
// Initialize and add the map
function initMap() {
  // The map, centered on Dakar
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 14.6937, lng: -17.4441 }, // Dakar coordinates
  });

  // Store locations
  const locations = [
    {
      position: { lat: 14.7167, lng: -17.4677 },
      title: "KD Mobilier - Almadies",
      content: "Showroom Almadies<br>Route des Almadies<br>Dakar, Sénégal",
    },
    {
      position: { lat: 14.6928, lng: -17.4406 },
      title: "KD Mobilier - Plateau",
      content: "Showroom Plateau<br>Avenue Georges Pompidou<br>Dakar, Sénégal",
    },
  ];

  // Create markers and info windows for each location
  locations.forEach((location) => {
    // Create marker
    const marker = new google.maps.Marker({
      position: location.position,
      map: map,
      title: location.title,
      animation: google.maps.Animation.DROP,
    });

    // Create info window
    const infowindow = new google.maps.InfoWindow({
      content: `<div style="padding: 10px">
                        <h3 style="margin: 0 0 10px 0">${location.title}</h3>
                        ${location.content}
                    </div>`,
    });

    // Add click listener to marker
    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
  });
}

// Load the map when the page is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("It's running!!!");
  // Load Google Maps API script
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAGsL3b_WGQma-ROltJ0CyOKwEG61jpW4s&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});
