import {sendData, getData} from './api.js';
import {resetMap, clearMarkers, drawMarkers, MAX_OBJECTS} from './map.js';
import {debounce} from './utils.js';
import {resetPicture} from './photos.js';

const MAX_PRICE = 100000;
const RERENDER_DELAY = 500;

const adForm = document.querySelector('.ad-form');
const filterForm = document.querySelector('.map__filters');
const adFormElements = adForm.querySelectorAll('fieldset');
const filterFormElements = filterForm.querySelectorAll(['select', 'fieldset']);
const timeForm = adForm.querySelector('.ad-form__element--time');
const sliderForm = adForm.querySelector('.ad-form__slider');
const submitButton = adForm.querySelector('.ad-form__submit');
const resetButtonForm = adForm.querySelector('.ad-form__reset');

const roomPriceField = adForm.querySelector('#price');
const roomNumberField = adForm.querySelector('#room_number');
const roomCapacityField = adForm.querySelector('#capacity');
const housingTypesForm = adForm.querySelector('#type');
const defaultSelectedOption = housingTypesForm.querySelector('option[selected]');
const checkInField = adForm.querySelector('#timein');
const checkOutField = adForm.querySelector('#timeout');
const addressForm = adForm.querySelector('#address');
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

const getMinPrice = () => LIVING_PRICES[housingTypesForm.value];
const getDefaultPrice = () => LIVING_PRICES[defaultSelectedOption.value];

roomPriceField.placeholder = getMinPrice();

//Create slider
noUiSlider.create(sliderForm, {
  range: {
    min: 0,
    max: MAX_PRICE,
  },
  start: 0,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});
sliderForm.noUiSlider.updateOptions({
  start: getMinPrice(),
  range: {
    'min': getMinPrice(),
    'max': MAX_PRICE
  }
});
//Event type of housing
housingTypesForm.addEventListener('change', () => {
  roomPriceField.placeholder = getMinPrice();
  roomPriceField.min = getMinPrice();
  sliderForm.noUiSlider.updateOptions({
    start: getMinPrice(),
    range: {
      'min': getMinPrice(),
      'max': MAX_PRICE
    }
  });
  sliderForm.noUiSlider.set(roomPriceField.value);
  pristine.validate(roomPriceField);
});

//Synth slider and price
sliderForm.noUiSlider.on('change', () => {
  roomPriceField.value = sliderForm.noUiSlider.get();
  pristine.validate(roomPriceField);
});
//Synth price and slider
roomPriceField.addEventListener('change', () => {
  sliderForm.noUiSlider.set(roomPriceField.value);
  pristine.validate(roomPriceField);
});

//Validate
const validateCapacity = (value) => CAPACITY_ROOMS[roomNumberField.value].includes(value);
pristine.addValidator(roomCapacityField, validateCapacity, 'Гостей должно быть не больше чем комнат');

const validatePrice = (value) => value >= getMinPrice() && value <= MAX_PRICE;
const getPriceErrorMessage = (value) => (value >= getMinPrice()) ? `Не более ${MAX_PRICE}` : `Не менее ${getMinPrice()}`;
pristine.addValidator(roomPriceField, validatePrice, getPriceErrorMessage);

//checkin-checkout
timeForm.addEventListener('change', (evt) => {
  checkInField.value = evt.target.value;
  checkOutField.value = evt.target.value;
});

// Enable/Disable form
const setDisabledForm = () => {
  adForm.classList.add('ad-form--disabled');
  filterForm.classList.add('ad-form--disabled');
  adFormElements.forEach((element) => {
    element.setAttribute('disabled', 'disabled');
  });

  filterFormElements.forEach((element) => {
    element.setAttribute('disabled', 'disabled');
  });

  sliderForm.setAttribute('disabled', true);

};

const setEnabledForm = () => {
  adForm.classList.remove('ad-form--disabled');
  filterForm.classList.remove('ad-form--disabled');
  adFormElements.forEach((element) => {
    element.removeAttribute('disabled');
  });

  filterFormElements.forEach((element) => {
    element.removeAttribute('disabled');
  });
  sliderForm.removeAttribute('disabled');
  sliderForm.noUiSlider.updateOptions({
    start: getMinPrice(),
    range: {
      'min': getMinPrice(),
      'max': MAX_PRICE
    }
  });

};

//Success/error messages
const getSuccessMessage = () => {
  const message = successMessageTemplate.cloneNode(true);
  document.body.appendChild(message);

  const escEvent = (evt) => {
    if (evt.key === 'Escape') {
      message.remove();
      document.removeEventListener('keydown', escEvent);
    }
  };

  document.addEventListener('keydown', escEvent);


  const clickEvent = () => {
    document.removeEventListener('click', clickEvent);
    message.remove();
  };

  document.addEventListener('click', clickEvent);
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

  const escEvent = (evt) => {
    if (evt.key === 'Escape') {
      message.remove();
      document.removeEventListener('keydown', escEvent);
    }
  };

  document.addEventListener('keydown', escEvent);


  const clickEvent = () => {
    document.removeEventListener('click', clickEvent);
    message.remove();
  };

  document.addEventListener('click', clickEvent);
};

//Enable/disable submit button
const disableSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Ожидайте...';
};

const enableSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
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
  for (let i = 0; i < ads.length; i++) {
    if(checkFilters(ads[i])) {
      filteredAds.push(ads[i]);
    }
  }
  return filteredAds.slice(0, MAX_OBJECTS);
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
  }, RERENDER_DELAY)
  );
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
  roomPriceField.placeholder = getDefaultPrice();
  sliderForm.noUiSlider.updateOptions({
    start: getDefaultPrice(),
    range: {
      'min': getDefaultPrice(),
      'max': MAX_PRICE
    }
  });
};

resetButtonForm.addEventListener('click', (evt) => {
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
  addressForm,
  resetMapFilters,
  letMapFilter,
  mapFilterUpdate
};
