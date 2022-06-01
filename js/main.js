let getRandomNumber = function (minNumber, maxNumber) {
  if (minNumber >= 0 && maxNumber >= 0) {
    minNumber = Math.ceil(minNumber);
    maxNumber = Math.floor(maxNumber);
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }
  console.log('Число должно быть положительным');
}

console.log(getRandomNumber(0, 100));

let getRandomNumberPoint = function (minNumber, maxNumber, numbersAfterPoint) {
  if (minNumber >= 0 && maxNumber >= 0) {
    return Math.floor((Math.random() * (maxNumber - minNumber) + minNumber) * (10 ** numbersAfterPoint)) /
           (10 ** numbersAfterPoint);
  }
  console.log('Число должно быть положительным');
}

console.log(getRandomNumberPoint(1.1, 1.2, 4));
