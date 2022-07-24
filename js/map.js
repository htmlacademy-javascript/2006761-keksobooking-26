import {addressForm} from './form.js';
import {createOffer} from './popup.js';

const DECIMAL_LENGTH = 5;
const MAX_OBJECTS = 10;
const MAP_SCALE = 13;
const centerOfTokyo = {
  lat: '35.68500',
  lng: '139.75140',
};

const map = L.map('map-canvas');
const mainMarkerGroup = L.layerGroup().addTo(map);
const markerGroup = L.layerGroup().addTo(map);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [52/2, 52],
});

const mainPinMarker = L.marker(
  centerOfTokyo,
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const addMainPinMarker = () => mainPinMarker.addTo(mainMarkerGroup);

const groupPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [40/2, 40],
});

const drawMarker = (object) => {
  const marker = L.marker(
    {
      lat: object.location.lat,
      lng: object.location.lng,
    },
    {
      icon: groupPinIcon,
    },
  );
  marker.addTo(markerGroup).bindPopup(createOffer(object));
};

const drawMarkers = (ads) => {
  ads.forEach((ad) => {
    drawMarker(ad);
  });
};

const setDefaultAddress = () => {
  addressForm.value = `${centerOfTokyo.lat}, ${centerOfTokyo.lng}`;
};

mainPinMarker.on('move', (evt) => {
  const lat = evt.target.getLatLng().lat;
  const lng = evt.target.getLatLng().lng;
  addressForm.value = `${lat.toFixed(DECIMAL_LENGTH)}, ${lng.toFixed(DECIMAL_LENGTH)}`;
});

const loadMap = (cb) => {
  setDefaultAddress();
  map.on('load', () => {
    addMainPinMarker();
    cb();
  }).setView(centerOfTokyo, MAP_SCALE);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);
};


//Reset mainPinMarker
const resetMap = () => {
  mainPinMarker.setLatLng(centerOfTokyo);
  map.setView(centerOfTokyo, MAP_SCALE);
  map.closePopup();
};

const clearMarkers = () => {
  markerGroup.clearLayers();
};

export {drawMarkers, loadMap, resetMap, clearMarkers, MAX_OBJECTS};
