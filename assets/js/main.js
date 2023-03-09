/*
 *
 * Menu animation.
 *
 */

// Captures menu related elements.
const menuBtn = document.querySelector(".menu-icon"); // Menu button.
const menu = document.querySelector(".menu"); // Menu nav tag.
const closeBtn = document.querySelector(".close-menu"); // Close button.

// Displays menu when clicking the hamburger button by adding the 'open' class.
menuBtn.addEventListener("click", function () {
  menu.classList.add("open");
});

// Hides menu when clicking the close button by removing the 'open' class.
closeBtn.addEventListener("click", function () {
  menu.classList.remove("open");
});

/*
 *
 * Transactions.
 *
 */

// Captures Transactions related elements.
const inputOperation = document.querySelector("#operation");
const inputProduct = document.querySelector("#product");
const inputValue = document.querySelector("#value");
const addButton = document.querySelector("#add");
const clearButton = document.querySelector("#clear");
const modalDiv = document.querySelector("#modal");
const cancelClearButton = document.querySelector("button.cancel");
const confirmClearButton = document.querySelector("button.confirm");

let transactions = JSON.parse(localStorage.getItem("transactions"));
let results = JSON.parse(localStorage.getItem("results"));

const stringToNumber = function (stringNum) {
  stringNum = stringNum.replace(/\D/g, "");
  return parseInt(stringNum) / 100;
};

// TODO: Review and simplify
const numberToString = function (floatNumber, simbol = true) {
  // Numbers only
  let operationValue = String(floatNumber).replace(/\D/g, "");

  if (operationValue == "0" || floatNumber < 0) {
    return "R$ 0,00";
  }

  if (operationValue.length === 2) {
    operationValue = `${operationValue}0`;
  } else if (operationValue.length === 1) {
    operationValue = `${operationValue}00`;
  }

  // Splits the operationValue into two parts: before and after the comma.
  let intPart = operationValue.slice(0, -2);
  let decimalPart = operationValue.slice(-2);

  // Add thousands separator.
  intPart = intPart.replace(/(\d)(?=(\d{3})+$)/g, "$1.");

  // Join integer and decimal parts.
  if (simbol) {
    return `R$ ${intPart},${decimalPart}`;
  }

  return `${intPart},${decimalPart}`;
};

const clearErrors = function () {
  let errors = document.querySelectorAll(".error");
  errors.forEach(function (element) {
    element.innerHTML = "";
  });

  let inputErrors = document.querySelectorAll(".input-error");
  inputErrors.forEach(function (element) {
    element.classList.remove("input-error");
  });
};

const clearInputs = function () {
  inputOperation.value = "-";
  inputProduct.value = "";
  inputValue.value = "";
};

const clearAll = function () {
  clearErrors();
  clearInputs();
  localStorage.clear();
  transactions = localStorage.getItem("transactions");
};

const valueMask = function () {
  // If no valid value was passed, make the entire input empty.
  // This prevents the comma from persisting when the input is cleared.
  if (this.value.replace(/\D/g, "") === "") {
    this.value = "";
    return;
  }

  let operationValue = stringToNumber(this.value);

  operationValue = `R$     ${numberToString(operationValue, false)}`;

  // Update input value
  this.value = operationValue;
};

const getOperation = function () {
  return inputOperation.value;
};

const getProduct = function () {
  // All text in upper case and no ascents
  let value = inputProduct.value.toUpperCase();
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getValue = function () {
  return stringToNumber(inputValue.value);
};

const getAllInputValues = function () {
  return {
    operation: getOperation(),
    product: getProduct(),
    value: getValue(),
  };
};

const calculateResults = function () {
  let value = 0;
  let result = null;

  if (transactions) {
    transactions.forEach(function (item) {
      if (item.operation == "+") {
        value += item.value;
      } else {
        value -= item.value;
      }
    });

    if (value === 0) {
      result = "Equilíbrio";
    } else if (value >= 0) {
      result = "Lucro";
    } else {
      result = "Prejuízo";
    }

    results = JSON.stringify({ value: value, result: result });
  }

  return { value: value, result: result };
};

// Check if values on inputs are OK.
const validateForm = function () {
  // Get input values
  let product = getProduct();
  let value = getValue();

  // Clear errors. If necessary they'll come back in the end.
  clearErrors();

  // If form values are OK, return true.
  if (product && value) {
    return true;
  }

  // TODO: Check how to use Generalization below.

  // The code below will be executed only if the function
  // wasn't finished by "return true" in previously condition.

  // Add errors to product description area
  if (!product) {
    let err = document.querySelector("#product-error");
    err.nextElementSibling.classList.add("input-error");

    err.innerHTML = "Verifique se o campo foi preenchido corretamente.";
  }

  // Add errors to value area
  if (!value) {
    let err = document.querySelector("#value-error");
    err.nextElementSibling.classList.add("input-error");

    err.innerHTML = "Verifique se o campo foi preenchido corretamente.";
  }

  return false;
};

const populateTable = function () {
  let table = document.querySelector("tbody");
  let totalSpan = document.querySelector(".value");
  let resultSpan = document.querySelector(".result");

  if (transactions) {
    table.innerHTML = null;

    totalSpan.innerHTML = null;
    resultSpan.innerHTML = null;

    transactions.forEach(function (transaction) {
      table.innerHTML += `<tr><td>
          ${transaction.operation}
        </td><td>
          ${transaction.product} 
        </td><td>
          ${numberToString(transaction.value)}
        </td></tr>`;
    });

    let finalNumbers = calculateResults();

    console.log(finalNumbers, finalNumbers.value, finalNumbers.result);

    totalSpan.innerHTML = numberToString(finalNumbers.value);
    resultSpan.innerHTML = `[${finalNumbers.result}]`;
  } else {
    table.innerHTML =
      "<tr><td></td><td>Nenhuma transação cadastrada</td><td></td></tr>";
    totalSpan.innerHTML = null;
    resultSpan.innerHTML = null;
  }
};

// Actions and calls related to the Add Transaction button click
const registerOperation = function () {
  if (validateForm()) {
    let newTransaction = getAllInputValues();

    if (transactions) {
      transactions.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } else {
      localStorage.setItem("transactions", JSON.stringify([newTransaction]));
    }
    transactions = JSON.parse(localStorage.getItem("transactions"));
    clearErrors();
    clearInputs();
  }
  populateTable();
  calculateResults();
};

populateTable();
calculateResults();

// Cursor always in the end
inputValue.addEventListener("click", function () {
  this.selectionStart = this.selectionEnd = this.value.length;
});

// Typing something in inputValue call valueMask.
inputValue.addEventListener("input", valueMask);

// Clicking addButton call registerOperation.
addButton.addEventListener("click", registerOperation);

clearButton.addEventListener("click", function () {
  menu.classList.remove("open");
  modalDiv.classList.add("active");
});

cancelClearButton.addEventListener("click", function () {
  modalDiv.classList.remove("active");
});

confirmClearButton.addEventListener("click", function () {
  modalDiv.classList.remove("active");
  clearAll();
  populateTable();
});
