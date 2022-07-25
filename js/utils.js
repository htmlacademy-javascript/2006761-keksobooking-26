const decline = (number, words) => {
  const value = number % 100;
  if (value % 10 === 1) {
    return words[0];
  }
  if (value % 10 > 1 && value % 10 < 5 || words[2] === undefined) {
    return words[1];
  }
  if (value > 10 && value < 20){
    return words[2];
  }
  return words[2];
};

function debounce (callback, timeoutDelay = 500) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

const isPressEsc = (evt) => evt.key === 'Escape';

export {decline, debounce, isPressEsc};
