/* eslint-disable no-undef */

const script = require('./function');

let productsList = [
  { id: 1, name: 'Молоко', count: 400, priceForOne: 50, priceTotal: 0 },
  { id: 2, name: 'Хлеб', count: 100, priceForOne: 20, priceTotal: 0 },
  { id: 3, name: 'Лук', count: 200, priceForOne: 5, priceTotal: 0 },
];
let listLength = productsList.length;

function createObservableObject(array, update) {
  return new Proxy(array, {
    set(target, property, value) {
      if (property === 'count') {
        target.count = value;
      } else if (property === 'priceForOne') {
        target.priceForOne = value;
      } else if (property === 'priceTotal') {
        target.priceTotal = value;
        return true;
      }
      update();
      return true;
    },
  });
}
function createObservableArray(array) {
  return new Proxy(array, {
    set() {
      return true;
    },
  });
}

function updateUI() {
  script.calculationTotalPrice(productsList);
  let totalCost = script.totalCostCalculation(productsList);
  const source = document.getElementById('store-template').innerHTML;
  const template = Handlebars.compile(source);
  const html = template({ productsList, totalCost });
  document.getElementById('result-table').innerHTML = html;
  const arrayOfInputCount = document.getElementsByClassName('table-column__input-count');
  const arrayOfInputPrice = document.getElementsByClassName('table-column__input-price');
  document.querySelectorAll('.input').forEach((element) => {
      element.addEventListener('dblclick', (event) => {
        event.target.readOnly = false;
      });
    });
  for (let i = 0; i < arrayOfInputCount.length; i += 1) {
    arrayOfInputCount[i].addEventListener('keydown', (e) => {
      const { key } = e;
      if (key === 'Enter') {
        script.setCount(productsList[i], arrayOfInputCount[i].value);
        return true;
      }
      return false;
    });
  }
  for (let i = 0; i < arrayOfInputPrice.length; i += 1) {
    arrayOfInputPrice[i].addEventListener('keydown', (e) => {
      const { key } = e;
      if (key === 'Enter') {
        script.setPrice(productsList[i], arrayOfInputPrice[i].value);
        return true;
      }
      return false;
    });
  }
}

window.onload = function upload() {
  for (let i = 0; i < listLength; i++) {
    productsList[i] = createObservableObject(productsList[i], updateUI);
  }
  productsList = createObservableArray(productsList, updateUI);
  updateUI();
};
