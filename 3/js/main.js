const TITLES = ['Шикарная квартира с видом на озеро',
  'Новый красивый дом',
  'Просторная 3-комнатная квартира',
];
const HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const CHECK_TIMES = ['12:00', '13:00', '13:00'];
const FEATURES_TYPES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const DESCRIPTIONS = [
  'Из окон открывается удивительный панорамный вид ',
  'Уютный зеленый двор с удобными деревянными скамейками',
  'Ремонту менее года, состояние идеальное'
];
const ROOMS_PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'
];


function getRandomNumber(min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

function getRandomNumberPoint(min, max, digits = 4) {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const result = Math.random() * (upper - lower) + lower;
  return +result.toFixed(digits);
}

const createObject = function() {
  const getRandomPhotoNumber = String(getRandomNumber(1, 10));
  const lat = getRandomNumberPoint(35.65000, 35.70000, 5);
  const lng = getRandomNumberPoint(139.70000, 139.80000, 5);
  const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];
  return {
    author: {
      avatar: `img/avatars/user${getRandomPhotoNumber.length < 2 ? '0' : ''}${getRandomPhotoNumber}.png`
    },
    offer: {
      title: getRandomArrayElement(TITLES),
      address: `${lat}, ${lng}`,
      price: getRandomNumber(1, 999),
      type: getRandomArrayElement(HOUSING_TYPES),
      rooms: getRandomNumber(1, 10),
      guests: getRandomNumber(1, 20),
      checkin: getRandomArrayElement(CHECK_TIMES),
      checkout: getRandomArrayElement(CHECK_TIMES),
      features: FEATURES_TYPES.slice(0, getRandomNumber(1, FEATURES_TYPES.length)),
      description: getRandomArrayElement(DESCRIPTIONS),
      photos: ROOMS_PHOTOS.slice(0, getRandomNumber(1, ROOMS_PHOTOS.length))
    },
    location: {
      lat: lat,
      lng: lng
    }
  };
};

const createObjectsArray = Array.from({length: 10}, createObject);
console.log(createObjectsArray);