import {getRandomNumber, getRandomNumberPoint, getRandomArrayElement} from './utils.js';

const SIMILAR_AD_COUNT = 10;
const DECIMAL_LENGTH = 5;
const MIN_LAT = 35.65000;
const MAX_LAT = 35.70000;
const MIN_LNG = 139.70000;
const MAX_LNG = 139.80000;

const TITLES = ['Шикарная квартира с видом на озеро',
  'Новый красивый дом',
  'Просторная 3-комнатная квартира',
];
const HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const housingTypesTranslate = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};
const CHECK_TIMES = ['12:00', '13:00', '14:00'];
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

const createObject = function() {
  const photoNumber = String(getRandomNumber(1, 10));
  const lat = getRandomNumberPoint(MIN_LAT, MAX_LAT, DECIMAL_LENGTH);
  const lng = getRandomNumberPoint(MIN_LNG, MAX_LNG, DECIMAL_LENGTH);

  return {
    author: {
      avatar: `img/avatars/user${photoNumber.padStart(2, '0')}.png`
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

export const objectsArray = Array.from({length: SIMILAR_AD_COUNT}, createObject);
export {housingTypesTranslate, DECIMAL_LENGTH};