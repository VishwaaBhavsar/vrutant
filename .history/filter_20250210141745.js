let map;
let service;
let infowindow;

function initMap() {
  // Default location set to New Delhi, India
  const defaultLocation = { lat: 28.6139, lng: 77.2090 };

  // Initialize map
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14, 
  });

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
}

function findGarages() {
  const locationInput = document.getElementById("location").value;

  if (!locationInput) {
    alert("Please enter a location!");
    return;
  }

  // Use Geocoding API to convert location input to coordinates
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: locationInput + ", India" }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      map.setCenter(location);

      // Search for garages nearby with Indian-specific queries
      const request = {
        location: location,
        radius: 5000, // 5km radius
        query: "car repair garage OR mechanic shop",
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          displayResults(results);
          displayMarkers(results);
        } else {
          alert("No garages found. Try a different location.");
        }
      });
    } else {
      alert("Location not found. Please enter a valid city or area.");
    }
  });
}

function displayResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h2>Nearby Garages</h2>";

  results.forEach((place) => {
    const placeDetails = `
      <div>
        <h3>${place.name}</h3>
        <p><strong>Address:</strong> ${place.formatted_address}</p>
        <p><strong>Rating:</strong> ${place.rating || "N/A"}</p>
        <p><strong>Phone:</strong> ${place.formatted_phone_number || "Not Available"}</p>
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
