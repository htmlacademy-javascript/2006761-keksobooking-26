import {sendData, getData} from './api.js';
import {resetMap, clearMarkers, drawMarkers, MAX_OBJECTS} from './map.js';
import {debounce, isPressEsc} from './utils.js';
import {resetPicture} from './photos.js';

const MAX_PRICE = 100000;
const RERENDER_DELAY = 500;

const adForm = document.querySelector('.ad-form');
const filterFormElement = document.querySelector('.map__filters');
const adFormElements = adForm.querySelectorAll('fieldset');
const filterFormElements = filterFormElement.querySelectorAll(['select', 'fieldset']);
const timeFormElement = adForm.querySelector('.ad-form__element--time');
const sliderFormElement = adForm.querySelector('.ad-form__slider');
const submitButtonElement = adForm.querySelector('.ad-form__submit');
const resetButtonFormElement = adForm.querySelector('.ad-form__reset');

const roomPriceFieldElement = adForm.querySelector('#price');
const roomNumberFieldElement = adForm.querySelector('#room_number');
const roomCapacityFieldElement = adForm.querySelector('#capacity');
const housingTypesFormElement = adForm.querySelector('#type');
const defaultSelectedOptionElement = housingTypesFormElement.querySelector('option[selected]');
const checkInFieldElement = adForm.querySelector('#timein');
const checkOutFieldElement = adForm.querySelector('#timeout');
const addressFormElement = adForm.querySelector('#address');
const mapFiltersElement = document.querySelector('.map__filters');
const housingFeaturesElement = mapFiltersElement.querySelector('#housing-features');

const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

const CAPACITY_ROOMS = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0'],
};

const LIVING_PRICES = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000,
};

const PRICE_RANGE_FILTER = {
  low: {
    minPrice: 0,
    maxPrice: 10000,
  },
  middle: {
    minPrice: 10000,
    maxPrice: 50000,
  },
  high: {
    minPrice: 50000,
    maxPrice: 100000,
  },
  any: {
    minPrice: 0,
    maxPrice: 100000,
  },
};
Pristine.setLocale('ru');

const pristine = new Pristine(adForm, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'ad-form__error-text',
});

Pristine.addMessages('ru', {
  required: 'Поле необходимо заполнить',
  maxlength: `Не более \${${1}} символов`,
  minlength: `Не менее \${${1}} символов`,
});

const getMinPrice = () => LIVING_PRICES[housingTypesFormElement.value];
const getDefaultPrice = () => LIVING_PRICES[defaultSelectedOptionElement.value];

roomPriceFieldElement.placeholder = getMinPrice();

//Create slider
noUiSlider.create(sliderFormElement, {
  range: {
    min: 0,
    max: MAX_PRICE,
  },
  start: 0,
  step: 1,
  connect: 'lower',
  format: {
    to: (value) => value.toFixed(0),
    from: (value) => parseFloat(value)
  },
});

const getSliderSetting = (setPrice) => {
  sliderFormElement.noUiSlider.updateOptions({
    start: setPrice,
    range: {
      'min': setPrice,
      'max': MAX_PRICE
    }
  });
};

getSliderSetting(getMinPrice());

//Event type of housing
housingTypesFormElement.addEventListener('change', () => {
  roomPriceFieldElement.placeholder = getMinPrice();
  roomPriceFieldElement.min = getMinPrice();
  getSliderSetting(getMinPrice());
  sliderFormElement.noUiSlider.set(roomPriceFieldElement.value);
  pristine.validate(roomPriceFieldElement);
});

//Synth slider and price
sliderFormElement.noUiSlider.on('change', () => {
  roomPriceFieldElement.value = sliderFormElement.noUiSlider.get();
  pristine.validate(roomPriceFieldElement);
});
//Synth price and slider
roomPriceFieldElement.addEventListener('change', () => {
  sliderFormElement.noUiSlider.set(roomPriceFieldElement.value);
  pristine.validate(roomPriceFieldElement);
});

//Validate
const validateCapacity = (value) => CAPACITY_ROOMS[roomNumberFieldElement.value].includes(value);
pristine.addValidator(roomCapacityFieldElement, validateCapacity, 'Гостей должно быть не больше чем комнат');

const validatePrice = (value) => value >= getMinPrice() && value <= MAX_PRICE;
const priceErrorMessage = (value) => (value >= getMinPrice()) ? `Не более ${MAX_PRICE}` : `Не менее ${getMinPrice()}`;
pristine.addValidator(roomPriceFieldElement, validatePrice, priceErrorMessage);

//checkin-checkout
timeFormElement.addEventListener('change', (evt) => {
  checkInFieldElement.value = evt.target.value;
  checkOutFieldElement.value = evt.target.value;
});

// Enable/Disable form
const setDisabledForm = () => {
  adForm.classList.add('ad-form--disabled');
  filterFormElement.classList.add('ad-form--disabled');
  adFormElements.forEach((element) => {
    element.setAttribute('disabled', 'disabled');
  });

  filterFormElements.forEach((element) => {
    element.setAttribute('disabled', 'disabled');
  });

  sliderFormElement.setAttribute('disabled', true);
};

const setEnabledForm = () => {
  adForm.classList.remove('ad-form--disabled');
  filterFormElement.classList.remove('ad-form--disabled');
  adFormElements.forEach((element) => {
    element.removeAttribute('disabled');
  });

  filterFormElements.forEach((element) => {
    element.removeAttribute('disabled');
  });
  sliderFormElement.removeAttribute('disabled');
  sliderFormElement.noUiSlider.updateOptions({
    start: getMinPrice(),
    range: {
      'min': getMinPrice(),
      'max': MAX_PRICE
    }
  });
};

const onMessageClick = (evt) => {
  evt.preventDefault();
  closeMessage();
};

const onMessageEscKeydown = (evt) => {
  if (isPressEsc(evt)) {
    closeMessage();
  }
};
function closeMessage () {
  document.body.lastChild.remove();

  document.removeEventListener('keydown', onMessageEscKeydown);
  document.removeEventListener('click', onMessageClick);
}
//Success/error messages
const getSuccessMessage = () => {
  const message = successMessageTemplate.cloneNode(true);
  document.body.appendChild(message);

  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onMessageClick);
};

const getErrorMessage = (err) => {
  const message = errorMessageTemplate.cloneNode(true);
  document.body.appendChild(message);
  const closeButton = document.querySelector('.error__button');
  const errorText = document.querySelector('.error__message');
  errorText.textContent = err;

  closeButton.addEventListener('click', () => {
    message.remove();
  });

  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onMessageClick);
};

//Enable/disable submit button
const disableSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = 'Ожидайте...';
};

const enableSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = 'Опубликовать';
};

//filter
const getFilteredAds = (ads) => {
  const housingTypeElement = mapFiltersElement.querySelector('#housing-type').value;
  const housingPriceElement = mapFiltersElement.querySelector('#housing-price').value;
  const housingRoomsElement = mapFiltersElement.querySelector('#housing-rooms').value;
  const housingGuestsElement = mapFiltersElement.querySelector('#housing-guests').value;

  const filterType = (ad) => housingTypeElement === ad.offer.type || housingTypeElement === 'any';
  const filterPrice = (ad) => (ad.offer.price >= PRICE_RANGE_FILTER[housingPriceElement].minPrice
    && ad.offer.price <= PRICE_RANGE_FILTER[housingPriceElement].maxPrice);
  const filterRooms = (ad) => ad.offer.rooms.toString() === housingRoomsElement || housingRoomsElement === 'any';
  const filterGuests = (ad) => ad.offer.guests.toString() === housingGuestsElement || housingGuestsElement === 'any';
  const filterFeatures = (ad) => {

    const checkedFilters = housingFeaturesElement.querySelectorAll('input:checked');
    const tempFeatures = [];
    checkedFilters.forEach((el) => tempFeatures.push(el.value));
    if (ad.offer.features){
      return tempFeatures.every((feature) => ad.offer.features.includes(feature));
    }
    return false;
  };
  const checkFilters = (element) =>
    filterType(element)
  && filterPrice(element)
  && filterRooms(element)
  && filterGuests(element)
  && filterFeatures(element);

  const filteredAds = [];
  for (const value of ads) {
    if(checkFilters(value)) {
      filteredAds.push(value);
    }

    if(filteredAds.length >= MAX_OBJECTS) {
      break;
    }
  }
  return filteredAds;
};

const letMapFilter = () => {
  getData((ads) => {
    drawMarkers(getFilteredAds(ads));
  });
};

const mapFilterUpdate = () => {
  mapFiltersElement.addEventListener('change', debounce(() => {
    getData((ads) => {
      clearMarkers();
      drawMarkers(getFilteredAds(ads));
    });
  }, RERENDER_DELAY));
};

const resetMapFilters = () => {
  mapFiltersElement.reset();
  getData((ads) => {
    clearMarkers();
    drawMarkers(getFilteredAds(ads));
  });
};

//Submit event
const letSubmitForm = () => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);

    if(pristine.validate()) {
      sendData(formData);
    }
  });
};
const resetForm = () => {
  adForm.reset();
  pristine.reset();
  resetMap();
  resetMapFilters();
  letMapFilter();
  resetPicture();
  roomPriceFieldElement.placeholder = getDefaultPrice();
  getSliderSetting(getDefaultPrice());
};

resetButtonFormElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetForm();
});

export {
  letSubmitForm,
  resetForm,
  enableSubmitButton,
  disableSubmitButton,
  getSuccessMessage,
  getErrorMessage,
  setDisabledForm,
  setEnabledForm,
  addressFormElement,
  resetMapFilters,
  letMapFilter,
  mapFilterUpdate
};
