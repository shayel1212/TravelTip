import { mapService } from "./services/map.service.js";
import { locService } from "./services/loc.service.js";
window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemoveLoc = onRemoveLoc;
window.onPanLoc = onPanLoc;
window.onMyLocation = onMyLocation;
window.onSearchInput = onSearchInput;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log("Map is ready");
      mapService.initMapListener(handleMapClick);
    })
    .catch(() => console.log("Error: cannot init map"));
    onGetUserPos()
    onGetLocs()
    
}

function handleMapClick(clickedLocation) {
  const locationName = prompt("location?");
  if (!locationName) return;
  locService.saveLocation(
    clickedLocation.lng,
    clickedLocation.lat,
    locationName
  );
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log("Adding a marker");
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService
    .getLocs()
    .then((locs) => {
      console.log("Locations:", locs);
      // document.querySelector(".locs").innerText = JSON.stringify(locs, null, 2);
      var strHtml = locs.map(
        (loc) =>
          `
        <tr> 
        <td>${loc.name}</td>
        <td>${loc.address}</td>
        <td>${loc.lat}</td>
        <td>${loc.lng}</td>
        <td>${loc.id}</td>
        <td>${loc.createdAt}</td>
        <td>${loc.updateAt}</td>
        <td><button data-id="${loc.id}" onclick="onRemoveLoc(this)" class="remove">Remove</button>
        <button data-id="${loc.id}" onclick="onPanLoc(this)" class="pan">Pan</button>
        </td>
    </tr>
        `
      );
      return strHtml;
    })
    .then((str) => {
      document.querySelector(".locations").innerHTML = str.join("");
    });
}
function onRemoveLoc(elBtn) {
  locService.removeLoc(elBtn.dataset.id);
  onGetLocs();
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log("User position is:", pos.coords);
      document.querySelector(
        ".user-pos "
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch((err) => {
      console.log("err!!!", err);
    });
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
  console.log("Panning the Map");
  mapService.panTo(lat, lng);
}

function onPanLoc(elBtn) {
  const { lat, lng } = locService.getLocById(elBtn.dataset.id);
  onPanTo(lat, lng);
}
function onMyLocation() {
  locService.getCurrLocation(onPanTo);
}
function onSearchInput(val) {
  locService.getCoordsFromAddress(val, onPanTo);
  onGetLocs()

}
