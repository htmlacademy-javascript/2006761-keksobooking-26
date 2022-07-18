const MAX_PRICE = 100000;

const adForm = document.querySelector('.ad-form');
const filterForm = document.querySelector('.map__filters');
const adFormElements = adForm.querySelectorAll('fieldset');
const filterFormElements = filterForm.querySelectorAll(['select', 'fieldset']);
const timeForm = adForm.querySelector('.ad-form__element--time');
const sliderForm = adForm.querySelector('.ad-form__slider');

const roomPriceField = adForm.querySelector('#price');
const roomNumberField = adForm.querySelector('#room_number');
const roomCapacityField = adForm.querySelector('#capacity');
const housingTypesForm = adForm.querySelector('#type');
const checkInField = adForm.querySelector('#timein');
const checkOutField = adForm.querySelector('#timeout');
const addressForm = adForm.querySelector('#address');

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
sliderForm.noUiSlider.updateOptions({start: getMinPrice()});
//Event type of housing
housingTypesForm.addEventListener('change', () => {
  roomPriceField.placeholder = getMinPrice();
  sliderForm.noUiSlider.updateOptions({start: getMinPrice()});
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

  sliderForm.noUiSlider.updateOptions({start: getMinPrice()});

};

//submit event
adForm.addEventListener('submit', (evt) => {
  if(!pristine.validate()) {
    evt.preventDefault();
  }
});

export {setDisabledForm, setEnabledForm, addressForm, adForm};
