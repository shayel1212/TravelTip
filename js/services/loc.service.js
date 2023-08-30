export const locService = {
  getLocs,
  saveLocation,
  removeLoc,
  getLocById,
  getCurrLocation,
  getCoordsFromAddress,
};

const STORAGE_KEY = "locationDB";

var locs = loadFromLocalStorage(STORAGE_KEY) || [];

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}
console.log(locs);

function saveLocation(lat, lng, name) {
  console.log(lat, lng);
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCa-yX9Dcvs1QyNTfha4cLWDO5BYLUIWd8`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
      return {
        id: data.results[0].place_id,
        address: data.results[0].formatted_address,
        name,
        lng,
        lat,
        createdAt: new Date(),
        updateAt: null,
      };
    })
    .then((data) => {
      locs.push(data);
      saveToLocalStorage(STORAGE_KEY, locs);
    });
}
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadFromLocalStorage(key) {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
}
function removeLoc(id) {
  const locIdx = locs.findIndex((loc) => loc.id === id);
  locs.splice(locIdx, 1);
  saveToLocalStorage(STORAGE_KEY, locs);
}
function getLocById(id) {
  return locs.find((loc) => loc.id === id);
}

function getCurrLocation(cb) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos);
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      console.log(lat, lng);
      cb(lat, lng);
    });
  } else {
    console.log("geolocation is not available");
  }
}

function getCoordsFromAddress(val, cb1) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=AIzaSyCa-yX9Dcvs1QyNTfha4cLWDO5BYLUIWd8`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results)
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;
      cb1(lat, lng);
      saveLocation(lat, lng, val);
    });
}
