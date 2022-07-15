const adForm = document.querySelector('.ad-form');
const filterForm = document.querySelector('.map__filters');
const adFormElements = adForm.querySelectorAll('fieldset');
const filterFormElements = filterForm.querySelectorAll(['select', 'fieldset']);

const roomPriceField = adForm.querySelector('#price');
const roomNumberField = adForm.querySelector('#room_number');
const roomCapacityField = adForm.querySelector('#capacity');
const formHousingTypes = adForm.querySelector('#type');

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

const getMinPrice = () => LIVING_PRICES[formHousingTypes.value];
roomPriceField.placeholder = getMinPrice();
roomPriceField.min = getMinPrice();

formHousingTypes.addEventListener('change', () => {
  roomPriceField.placeholder = getMinPrice();
  roomPriceField.min = getMinPrice();
});

//Validate
const validateCapacity = (value) => CAPACITY_ROOMS[roomNumberField.value].includes(value);
pristine.addValidator(roomCapacityField, validateCapacity, 'Гостей должно быть не больше чем комнат');

const validatePrice = (value) => value >= getMinPrice() && value <= 100000;
const getPriceErrorMessage = (value) => (value >= getMinPrice()) ? 'Не более 100000' : `Не менее ${getMinPrice()}`;
pristine.addValidator(roomPriceField, validatePrice, getPriceErrorMessage);

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
};

//submit event
adForm.addEventListener('submit', (evt) => {

  if(!pristine.validate()) {
    evt.preventDefault();
  }
});

export {setDisabledForm, setEnabledForm};
