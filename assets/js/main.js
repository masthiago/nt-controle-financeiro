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
 * resultsStorage keeps localStorage data from total sum and result of transactions
 */
let transactionsStorage = JSON.parse(localStorage.getItem("transactions"));
let resultsStorage = JSON.parse(localStorage.getItem("results"));

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
  console.log(formatedValue);
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
 * @returns {undefined}
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
    element.classList.remove("input-error"); // Remove classs
  });
};

/**
 * Remove input values
 * @returns {undefined}
 */
const clearInputs = function () {
  inputOperation.value = null;
  inputProduct.value = null;
  inputValue.value = null;
};

/**
 * Run all clear functions defined above and clear localStorage content.
 * @returns {undefined}
 */
const clearAll = function () {
  clearErrors();
  clearInputs();
  localStorage.clear();
  transactionsStorage = localStorage.getItem("transactions");
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
 * @returns {boolean}
 */
const validateForm = function () {
  // Get input values
  let form = getAllInputValues();
  let errorMsg = "Verifique!";

  // Clear errors. If necessary, they'll come back in the end.
  clearErrors();

  // If all form values are OK, return true.
  if (form.operation && form.product && form.value) {
    return true;
  }

  // TODO: Check how to use Generalization below.

  // The code below will be executed only if the function
  // wasn't finished by "return true" in previously condition.

  // Add errors to product description area
  if (!form.operation) {
    let err = document.querySelector("#operation-error");
    err.nextElementSibling.classList.add("input-error"); 
    err.innerHTML = errorMsg;
  }

  // Add errors to product description area
  if (!form.product) {
    let err = document.querySelector("#product-error");
    err.nextElementSibling.classList.add("input-error");
    err.innerHTML = errorMsg;
  }

  // Add errors to value area
  if (!form.value) {
    let err = document.querySelector("#value-error");
    err.nextElementSibling.classList.add("input-error");
    err.innerHTML = errorMsg;
  }

  return false;
};

/**
 * Calculate total results and final situation of transactions
 * @returns {object}
 */
const calculateResults = function () {
  let sum = Number();
  let result = null;
  let results = { value: sum, result: result };

  // TODO: Review number evolution in this function em simplify
  if (transactionsStorage) {
    transactionsStorage.forEach(function (item) {
      if (item.operation == "+") {
        sum += Number(Number(item.value).toFixed(2));
      } else if (item.operation == "-") {
        sum -= Number(Number(item.value).toFixed(2));
      }
    });
    if (sum === 0) {
      result = "Equilíbrio";
    } else if (sum >= 0) {
      result = "Lucro";
    } else {
      result = "Prejuízo";
    }
    sum = Number(Number(sum).toFixed(2));
    results.value = sum;
    results.result = result;
    resultsStorage = JSON.stringify(results);
  }

  return results;
};

/**
 * Get necessary Table Tags, localStorage values and construct
 * the transactions table and results with this data.
 * @returns {undefined}
 */
const populateTable = function () {
  let table = document.querySelector("tbody"); // Table
  let totalSpan = document.querySelector(".value"); // Total
  let resultSpan = document.querySelector(".result"); // Result

  // If has data in localStorage
  if (transactionsStorage) {
    // Clear all old exposed data
    table.innerHTML = null;
    totalSpan.innerHTML = null;
    resultSpan.innerHTML = null;

    // Each line of transactions
    transactionsStorage.forEach(function (transaction, index) {
      table.innerHTML += `<tr style="color: ${
        transaction.operation == "+" ? "#005700" : "#d10000"
      }"><td>
          ${transaction.operation}
        </td><td>
          ${transaction.product}
        </td><td>
          ${formatValue(transaction.value)}
          <a href="#" id="${index}" class="remove" onclick="removeItem(${index})">&times;</a>
        </td></tr>`;
    });

    // Apply total and final result in HTML
    let finalNumbers = calculateResults();
    totalSpan.innerHTML = formatValue(finalNumbers.value);
    resultSpan.innerHTML = `[${finalNumbers.result}]`;
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
 * @returns {undefined}
 */
const registerOperation = function () {
  // If form has valid data
  if (validateForm()) {
    // Get input data
    let newTransaction = getAllInputValues();

    // If exists transaction entry in localStorage, add this one
    if (transactionsStorage) {
      transactionsStorage.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactionsStorage));
    } else {
      // Else, initialize transaction entry in localStorage
      localStorage.setItem("transactions", JSON.stringify([newTransaction]));
    }

    // Update localStorage in memory variable
    transactionsStorage = JSON.parse(localStorage.getItem("transactions"));

    // Clear errors and input data to receive a new one.
    clearErrors();
    clearInputs();
  }

  // TODO: Check if this is the best place to call in function
  // Reconstruct the table
  populateTable();
  calculateResults();
};

/**
 * Remove one item from transaction array, by position,
 * update localStorage and table on HTML
 * TODO: To make removeItem be called from JS, not inline.
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
    transactionsStorage = transactionsStorage = JSON.parse(
      localStorage.getItem("transactions")
    );
  }

  // Reconstruct the table
  populateTable();
  calculateResults();
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
calculateResults();
