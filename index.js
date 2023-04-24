const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];

function generateTemplate(id, source, amount, time) {
    return `<li data-id="${id}">
    <p>
        <span>${source}</span>
        <span id="time">${time}</span>
    </p>
    <span>£${Math.abs(amount)}</span>
    <i class="bi bi-trash delete"></i>
</li>`
}

function addTransactionDOM (id, source, amount, time) {
    if (amount > 0) {
        incomeList.innerHTML += generateTemplate(id, source, amount, time)
    } else {
        expenseList.innerHTML += generateTemplate(id, source, amount, time)
    }
}

function addTransaction(source, amount) {
    const time = new Date();
    const transaction = {
        id: Math.floor(Math.random()*100000),
        source,  // source: source,
        amount, // amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}` // getting time and date 
    };
    transactions.push(transaction) //adding new transaction into transactions array
    localStorage.setItem("transactions", JSON.stringify(transactions)) 
    // storing transactions array under key transactions in local storage, each time information is overwritten
    addTransactionDOM(Number(transaction.id), source, amount, transaction.time)
}

form.addEventListener("submit", event => {
    event.preventDefault();
    addTransaction(form.source.value, form.amount.value);
    form.reset();    
})

function getTransactions() {
    // display all transactions from local storage upon opening or refreshing the page
    transactions.forEach(transaction => {
        addTransactionDOM(transaction.id, transaction.source, transaction.amount, transaction.time)
    })
}

getTransactions();

function  deleteTransaction(id) {
    transactions = transactions.filter(transaction => {
        return transaction.id !== id;
    })

    localStorage.setItem("transactions", JSON.stringify(transactions))
};

incomeList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id)); //passing the id stored in li tag
    }
});

expenseList.addEventListener("click", event => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id)); //passing the id stored in li tag
    }
})