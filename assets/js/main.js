/**
 *
 * Menu animation.
 *
 */

/**
 * Menu related elements
 */
const menuButton = document.querySelector(".menu-icon"); // Menu button.
const menuDiv = document.querySelector(".menu"); // Menu nav tag.
const closeButton = document.querySelector(".close-menu"); // Close button.

/**
 * Menu related events listeners
 */

/** Displays menu when clicking the hamburger button by adding the 'open' class. */
menuButton.addEventListener("click", function () {
  menuDiv.classList.add("open");
});

/** Hides menu when clicking the close button by removing the 'open' class. */
closeButton.addEventListener("click", function () {
  menuDiv.classList.remove("open");
});

/**
 *
 * Transactions.
 *
 */

/**
 * Transactions related elements.
 */
const inputOperation = document.querySelector("#operation");
const inputProduct = document.querySelector("#product");
const inputValue = document.querySelector("#value");
const addButton = document.querySelector("#add");
const clearButton = document.querySelector("#clear");
const modalDiv = document.querySelector("#modal");
const cancelClearButton = document.querySelector("button.cancel");
const confirmClearButton = document.querySelector("button.confirm");

/**
 * transactionsStorage keeps localStorage an array with all individual transactions
 */
let transactionsStorage = JSON.parse(localStorage.getItem("transactions"));

/**
 * Convert a Number value in BRL formatted number as string.
 * @param {*} num
 * @returns {string}
 */
const formatValue = function (num) {

  if (typeof num == "number") {
    num = num.toFixed(2);
  } else {
    num = String(num);
  }

  // Check if value is a negative representation
  let isNegative = false;
  if (num.startsWith("-")) {
    isNegative = true;
    num = num.substring(1);  // Discard negative symbol
  }

  // Change Number presentation from 9999.99 to 9.999,00
  let formatedValue = num.replace(/\D/g, "");
  formatedValue = (formatedValue / 100).toFixed(2).replace(".", ",");
  formatedValue = formatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Add negative symbol back if necessary
  if (isNegative) {
    formatedValue = "-" + formatedValue;
  }

  // Return formatted value
  return formatedValue;
};

/**
 * Normalize a string (with two decimal precision representation) to a float number
 * @param {string} str
 * @returns {number}
 */
const stringToNumber = function (str) {
  // Numbers only (Integer representation)
  const value = str.replace(/\D/g, "");

  // Convert to number with two decimal precision
  const number = parseInt(value) / 100;
  return number;
};

/**
 * Receive an input type text and apply formatValue() on it own value
 * @param {object} inputObject
 */
const valueMask = function (inputObject) {
  inputObject.value = formatValue(inputObject.value);
};

/**
 * Remove classes and contents from itens related with error alerts.
 */
const clearErrors = function () {
  // Get all elements with error class.
  let errors = document.querySelectorAll(".error");
  errors.forEach(function (element) {
    element.innerHTML = null; // Remove content
  });

  // Get all elements with input-error class
  let inputErrors = document.querySelectorAll(".input-error");
  inputErrors.forEach(function (element) {
    element.classList.remove("input-error"); // Remove classes
  });
};

/**
 * Remove input values
 */
const clearInputs = function () {
  inputOperation.value = null;
  inputProduct.value = null;
  inputValue.value = null;
};

/**
 * Run all clear functions defined above and clear localStorage content.
 */
const clearAll = function () {
  clearErrors();
  clearInputs();
  localStorage.clear();
};

/**
 * Return value in Operation Select Tag (+/-) as string
 * @returns {string}
 */
const getOperation = function () {
  return inputOperation.value;
};

/**
 * Returns value in Product Input Tag, removing ascents and in uppercase
 * @returns {string}
 */
const getProduct = function () {
  // All text in upper case and no ascents
  let value = inputProduct.value.toUpperCase();
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Return value from Value Input Tag normalized as number
 * @returns {number}
 */
const getValue = function () {
  return stringToNumber(inputValue.value);
};

/**
 * Run tree getter functions above and structure they returns as an object
 * @returns {object}
 */
const getAllInputValues = function () {
  return {
    operation: getOperation(),
    product: getProduct(),
    value: getValue(),
  };
};

/**
 * Check if values on inputs are OK.
 * @returns {object}
 */
const validateForm = function () {

  let inputs = document.querySelectorAll(".input-data");  // Get all inputs
  let ok = true;  // Switch to false if any error exists 
  let data = {}  // Valid values
  let errorMsg = {  // Error message by input field
    "operation": "Escolha uma operação válida",
    "product": "Preencha o nome da mercadoria",
    "value": "Informe o valor da operação",
  };

  clearErrors();

  // 
  inputs.forEach(function (input) {
    if (!input.value){
      ok = false;
      input.classList.add("input-error");
      input.parentElement.querySelector(".error").innerHTML = errorMsg[input.name];
    } else if (input.name == "value") {
      data[input.name] = stringToNumber(input.value);
    } else {
      data[input.name] = input.value;
    }
  });

  if (ok) {
    return {"isValid": true, "data": data};
  }

  return  {"isValid": false, "data": data};
};

/**
 * Get necessary Table Tags, localStorage values and construct
 * the transactions table and results with this data.
 */
const populateTable = function () {
  let table = document.querySelector("tbody"); // Table
  let totalSpan = document.querySelector(".value"); // Total
  let resultSpan = document.querySelector(".result"); // Result

  let sum = Number();
  let result = null;

  transactionsStorage = JSON.parse(localStorage.getItem("transactions"));

  // If has data in localStorage
  if (transactionsStorage) {
    // Clear all old exposed data
    table.innerHTML = null;
    totalSpan.innerHTML = null;
    resultSpan.innerHTML = null;

    // Each line of transactions
    transactionsStorage.forEach(function (transaction, index) {
      if (transaction.operation == "+") {
        sum += Number(Number(transaction.value).toFixed(2));
      } else if (transaction.operation == "-") {
        sum -= Number(Number(transaction.value).toFixed(2));
      }
      table.innerHTML += `<tr style="color: ${
        transaction.operation == "+" ? "#005700" : "#d10000"
      }"><td>
          ${transaction.operation}
        </td><td>
          ${transaction.product}
        </td><td>R$ 
          ${formatValue(transaction.value)}
          <a href="#" id="${index}" class="remove" onclick="removeItem(${index})">&times;</a>
        </td></tr>`;
    });

    // Check total to make final result
    sum = Number(sum.toFixed(2)); 

    if (sum < 0) {
      result = "[Prejuízo]";
    } else if (sum > 0) {
      result = "[Lucro]";
    } else {
      result = "";
    }

    // Apply total and final result in HTML
    totalSpan.innerHTML = `R$ ${formatValue(sum)}`;
    resultSpan.innerHTML = result;
  }
  // Else, without data in localStorage
  else {
    // Clear table and inform: No transaction data
    table.innerHTML =
      "<tr><td></td><td>Nenhuma transação cadastrada</td><td></td></tr>";
    totalSpan.innerHTML = null;
    resultSpan.innerHTML = null;
  }
};

/**
 * Run necessary functions and actions after click in Add Button Tag to
 * save transaction in localStorage if input data is valid.
 */
const registerOperation = function () {
  // If form has valid data

  let form = validateForm();

  if (form.isValid) {

    // If exists transaction entry in localStorage, add this one
    if (transactionsStorage) {
      transactionsStorage.push(form.data);
      localStorage.setItem("transactions", JSON.stringify(transactionsStorage));
    } else {
      // Else, initialize transaction entry in localStorage
      localStorage.setItem("transactions", JSON.stringify([form.data]));
    }
    // Clear errors and input data to receive a new one.
    clearErrors();
    clearInputs();
  }

  // Reconstruct the table
  populateTable();
};

/**
 * Remove one item from transaction array, by position,
 * update localStorage and table on HTML
 * @param {number, string} index
 */
const removeItem = function (index) {
  // If transactionsStorage is not empty or null, remove item
  // and update localStorage
  if (transactionsStorage) {
    transactionsStorage.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactionsStorage));
  }

  // If length of transactionsStorage is 0, clear it and update local variable.
  // This is necessary to keep data synced and for an adequate
  // presentation of HTML table.
  if (transactionsStorage.length === 0) {
    localStorage.clear();
  }

  // Reconstruct the table
  populateTable();
};

/**
 * Transaction related events listeners
 */

/** Mask and text cursor in inputValue always in the end */
inputValue.addEventListener("input", function () {
  valueMask(this);
});
inputValue.addEventListener("click", function () {
  this.selectionStart = this.selectionEnd = this.value.length;
});

/** Add new transaction */
addButton.addEventListener("click", registerOperation);

/** Cancel clear all data operation and close modal doing nothing */
clearButton.addEventListener("click", function () {
  menuDiv.classList.remove("open");
  modalDiv.classList.add("active");
});

/** Cancel clear all data and close modal */
cancelClearButton.addEventListener("click", function () {
  modalDiv.classList.remove("active");
});

/** Confirm all data will be cleaned */
confirmClearButton.addEventListener("click", function () {
  modalDiv.classList.remove("active");
  clearAll();
  populateTable();
});

/** Draw HTML table on load  */
populateTable();
