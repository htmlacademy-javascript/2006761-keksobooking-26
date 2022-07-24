import {
  resetForm,
  enableSubmitButton,
  disableSubmitButton,
  getSuccessMessage,
  getErrorMessage
} from './form.js';

const getData = (onSuccess) => {
  fetch('https://26.javascript.pages.academy/keksobooking/data')
    .then((response) => response.json())
    .then((objects) => {
      onSuccess(objects);
    })
    .catch(() => {
      getErrorMessage('Не удалось получить данные');
    });
};

const sendData = (body) => {
  disableSubmitButton();
  fetch(
    'https://26.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        getSuccessMessage();
        resetForm();
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      getErrorMessage('Не удалось отправить форму');
    }).finally(() => {
      enableSubmitButton();
    });
};

export {getData, sendData};
