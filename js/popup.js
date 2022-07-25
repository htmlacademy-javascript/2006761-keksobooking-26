import {decline} from './utils.js';

const housingTypesTranslate = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const declinationRooms = ['комната', 'комнаты', 'комнат'];
const declinationGuests = ['гостя', 'гостей'];

const cardTemplate = document.querySelector('#card').content.querySelector('.popup');
const checkExistence = (templateElement, value) => (value) ? value : templateElement.remove();

const createOffer = (object) => {
  const {avatar} = object.author;
  const {title, address, price, type, rooms, guests, checkin, checkout, features, description, photos} = object.offer;
  const cloneCard = cardTemplate.cloneNode(true);
  const offerAvatarElement = cloneCard.querySelector('.popup__avatar');
  const offerTitleElement = cloneCard.querySelector('.popup__title');
  const offerAddressElement = cloneCard.querySelector('.popup__text--address');
  const offerPriceElement = cloneCard.querySelector('.popup__text--price');
  const offerTypeElement = cloneCard.querySelector('.popup__type');
  const offerCapacityElement = cloneCard.querySelector('.popup__text--capacity');
  const offerTimeElement = cloneCard.querySelector('.popup__text--time');
  const offerFeaturesElement = cloneCard.querySelector('.popup__features');
  const offerDescriptionElement = cloneCard.querySelector('.popup__description');
  const offerPhotosElement = cloneCard.querySelector('.popup__photos');

  offerAvatarElement.src = checkExistence(offerAvatarElement, avatar);
  offerTitleElement.textContent = checkExistence(offerTitleElement, title);
  offerAddressElement.textContent = checkExistence(offerAddressElement, address);
  offerPriceElement.textContent = checkExistence(offerPriceElement, `${price} р/ночь`);
  offerTypeElement.textContent = checkExistence(offerTypeElement, housingTypesTranslate[type]);
  offerCapacityElement.textContent = `${rooms} ${decline(rooms, declinationRooms)}
   для ${guests} ${decline(guests, declinationGuests)}.`;
  offerTimeElement.textContent = `Заезд после ${checkin}, выезд до ${checkout}`;

  if (features) {
    const featuresList = offerFeaturesElement.querySelectorAll('.popup__feature');
    featuresList.forEach((featuresListItem) => {
      const included = features.some(
        (feature) => featuresListItem.classList.contains(`popup__feature--${feature}`));
      if (!included) {
        featuresListItem.remove();
      }
    });
  } else {
    offerFeaturesElement.remove();
  }

  offerDescriptionElement.textContent = checkExistence(offerDescriptionElement, description);
  offerPhotosElement.innerHTML = '';

  if (photos) {
    photos.forEach((photo) => {
      offerPhotosElement.insertAdjacentHTML('beforeend', `<img src="${photo}" class="popup__photo" width="45" height="40" alt="Фотография жилья">`);
    });
  } else {
    offerPhotosElement.remove();
  }

  return cloneCard;
};

export {createOffer};
