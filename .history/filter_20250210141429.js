let map;
let service;
let infowindow;

function initMap() {
  // Default location (e.g., New York)
  const defaultLocation = { lat: 40.7128, lng: -74.0060 };

  // Initialize map
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 15,
  });

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
}

function findGarages() {
  const locationInput = document.getElementById("location").value;

  // Use Geocoding API to convert location input to coordinates
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: locationInput }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      map.setCenter(location);

      // Search for garages nearby
      const request = {
        location: location,
        radius: "5000", // 5km radius
        query: "car garage",
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          displayResults(results);
          displayMarkers(results);
        }
      });
    } else {
      alert("Location not found. Please try again.");
    }
  });
}

function displayResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  results.forEach((place) => {
    const placeDetails = `
      <div>
        <h3>${place.name}</h3>
        <p>Address: ${place.formatted_address}</p>
        <p>Rating: ${place.rating || "N/A"}</p>
        <hr>
      </div>
    `;
    resultsDiv.innerHTML += placeDetails;
  });
}

function displayMarkers(results) {
  results.forEach((place) => {
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
    });

    // Add click event to show details
    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(`<strong>${place.name}</strong><br>${place.formatted_address}`);
      infowindow.open(map, marker);
    });
  });
}