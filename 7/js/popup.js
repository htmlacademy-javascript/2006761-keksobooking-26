import {objectsArray, housingTypesTranslate} from './data.js';

const adInsert = document.querySelector('#map-canvas');
const cardTemplate = document.querySelector('#card').content.querySelector('.popup');
const checkExistence = (templateElement, value) => (value) ? value : templateElement.remove();

const createOffer = (object) => {
  const {avatar} = object.author;
  const {title, address, price, type, rooms, guests, checkin, checkout, features, description, photos} = object.offer;
  const cloneCard = cardTemplate.cloneNode(true);
  const offerAvatar = cloneCard.querySelector('.popup__avatar');
  const offerTitle = cloneCard.querySelector('.popup__title');
  const offerAddress = cloneCard.querySelector('.popup__text--address');
  const offerPrice = cloneCard.querySelector('.popup__text--price');
  const offerType = cloneCard.querySelector('.popup__type');
  const offerCapacity = cloneCard.querySelector('.popup__text--capacity');
  const offerTime = cloneCard.querySelector('.popup__text--time');
  const offerFeaturesContainer = cloneCard.querySelector('.popup__features');
  const offerDescription = cloneCard.querySelector('.popup__description');
  const offerPhotosContainer = cloneCard.querySelector('.popup__photos');

  offerAvatar.src = checkExistence(offerAvatar, avatar);
  offerTitle.textContent = checkExistence(offerTitle, title);
  offerAddress.textContent = checkExistence(offerAddress, address);
  offerPrice.textContent = checkExistence(offerPrice, `${price} р/ночь`);
  offerType.textContent = checkExistence(offerType, housingTypesTranslate[type]);
  offerCapacity.textContent = `${rooms} комнаты для ${guests} гостей`;
  offerTime.textContent = `Заезд после ${checkin}, выезд до ${checkout}`;

  if (features) {
    const featuresList = offerFeaturesContainer.querySelectorAll('.popup__feature');
    featuresList.forEach((featuresListItem) => {
      const included = features.some(
        (feature) => featuresListItem.classList.contains(`popup__feature--${feature}`));
      if (!included) {
        featuresListItem.remove();
      }
    });
  } else {
    offerFeaturesContainer.remove();
  }

  offerDescription.textContent = checkExistence(offerDescription, description);
  offerPhotosContainer.innerHTML = '';

  if (photos) {
    photos.forEach((photo) => {
      offerPhotosContainer.insertAdjacentHTML('beforeend', `<img src="${photo}" class="popup__photo" width="45" height="40" alt="Фотография жилья">`);
    });
  } else {
    offerPhotosContainer.remove();
  }

  return cloneCard;
};

adInsert.append(createOffer(objectsArray[0]));
