import {setEnabledForm, addressForm, adForm} from './form.js';
import {objectsArray, DECIMAL_LENGTH} from './data.js';
import {createOffer} from './popup.js';

const MAP_SCALE = 13;
const centerOfTokyo = {
  lat: '35.68500',
  lng: '139.75140',
};

addressForm.value = `${centerOfTokyo.lat}, ${centerOfTokyo.lng}`;

const map = L.map('map-canvas').on('load', setEnabledForm).setView(centerOfTokyo, MAP_SCALE);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

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

mainPinMarker.addTo(map);

const markerGroup = L.layerGroup().addTo(map);

const groupPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [40/2, 40],
});

const createMarker = (object) => {
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

mainPinMarker.on('move', (evt) => {
  const lat = evt.target.getLatLng().lat;
  const lng = evt.target.getLatLng().lng;
  addressForm.value = `${lat.toFixed(DECIMAL_LENGTH)}, ${lng.toFixed(DECIMAL_LENGTH)}`;
});

objectsArray.forEach((object) => {
  createMarker(object);
});

//Reset mainPinMarker
adForm.addEventListener('reset', () => {
  mainPinMarker.setLatLng(centerOfTokyo);
  map.setView(centerOfTokyo, MAP_SCALE);
});
