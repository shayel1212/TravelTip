export const mapService = {
  initMap,
  addMarker,
  panTo,
  initMapListener,
};
// Var that is used throughout this Module (not global)
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log("InitMap");
  return _connectGoogleApi().then(() => {
    console.log("google available");
    gMap = new google.maps.Map(document.querySelector("#map"), {
      center: { lat, lng },
      zoom: 15,
    });
    //   handleMapClick(clickedLocation);
  });
}

function initMapListener(cb) {
  gMap.addListener("click", (ev) => {
    console.log(ev);
    const clickedLocation = {
      lat: ev.latLng.lat(),
      lng: ev.latLng.lng(),
    };
    cb(clickedLocation);
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: "Hello World!",
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = "AIzaSyCa-yX9Dcvs1QyNTfha4cLWDO5BYLUIWd8"; //TODO: Enter your API Key
  var elGoogleApi = document.createElement("script");
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject("Google script failed to load");
  });
}
