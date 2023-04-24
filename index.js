const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const error = document.getElementById("error");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += Number(transaction.amount)), 0);

  console.log(typeof updatedIncome);
  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce(
      (total, transaction) => (total += Number(Math.abs(transaction.amount))),
      0
    );

  balance.textContent = updatedIncome - updatedExpense;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
}

function generateTemplate(id, source, amount, time) {
  return `<li data-id="${id}">
    <p>
        <span>${source}</span>
        <span id="time">${time}</span>
    </p>
    <span>£${Math.abs(amount)}</span>
    <i class="bi bi-trash delete"></i>
</li>`;
}

function addTransactionDOM(id, source, amount, time) {
  if (amount > 0) {
    incomeList.innerHTML += generateTemplate(id, source, amount, time);
  } else {
    expenseList.innerHTML += generateTemplate(id, source, amount, time);
  }
}

function addTransaction(source, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 100000),
    source, // source: source,
    amount, // amount: amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`, // getting time and date
  };
  transactions.push(transaction); //adding new transaction into transactions array
  localStorage.setItem("transactions", JSON.stringify(transactions));
  // storing transactions array under key transactions in local storage, each time information is overwritten
  addTransactionDOM(Number(transaction.id), source, amount, transaction.time);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (form.source.value.trim() === "") {
    // return alert("Please enter a value")
    error.classList.remove("hide");
    form.source.classList.add("error");
  }
  if (form.amount.value.trim() === "") {
    error.classList.remove("hide");
    form.amount.classList.add("error");
  }
  if (form.source.value.trim() && form.amount.value) {
      addTransaction(form.source.value.trim(), Number(form.amount.value));
      document.querySelector(".transaction-history").classList.remove("hide");
      updateStatistics();
      form.reset();
  }
});

form.addEventListener("keyup", (event) => {
  if (form.source.value.trim()) {
    form.source.classList.remove("error");
  }
  if (form.amount.value.trim()) {
    form.amount.classList.remove("error");
  }
  if (form.source.value.trim() && form.amount.value.trim()) {
    error.classList.add("hide");
  }
});

function getTransactions() {
  transactions.length === 0
    ? document.querySelector(".transaction-history").classList.add("hide")
    : document.querySelector(".transaction-history").classList.remove("hide");
  // display all transactions from local storage upon opening or refreshing the page
  transactions.forEach((transaction) => {
    addTransactionDOM(
      transaction.id,
      transaction.source,
      transaction.amount,
      transaction.time
    );
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  if (transactions.length === 0) {
    document.querySelector(".transaction-history").classList.add("hide");
  }
}

incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id)); //passing the id stored in li tag
    updateStatistics();
  }
});

expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id)); //passing the id stored in li tag
    updateStatistics();
  }
});

function onPageLoad() {
  getTransactions();
  updateStatistics();
}

onPageLoad();
