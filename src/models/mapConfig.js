var mapConfig = {
  freetown: {
    zoom: 8,
    center: { lat: 8.665148, lng: -11.788725 },
  },
  TheHaitiTreeProject: {
    zoom: 8,
    center: { lat: 18.5296, lng: -72.4081 },
  },
};

var mapStyles = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

export { mapConfig, mapStyles };
