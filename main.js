'ues strict';
////data
const acc1 = {
  owner: 'Ziyad Hamed',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2024-05-07T14:31:17.178Z',
    '2024-05-06T09:42:02.383Z',
    '2024-05-05T06:25:04.254Z',
    '2024-05-04T01:20:24.045Z',
    '2023-04-11T11:30:59.114Z',
    '2023-05-14T15:06:17.118Z',
    '2023-06-24T05:40:36.104Z',
    '2023-12-28T04:32:20.905Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const acc2 = {
  owner: 'Jimi Stiv',
  movements: [250, 420, 800, -200, -150, -350, 2470, 1400],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2023-11-20T14:31:17.178Z',
    '2023-10-21T09:42:02.383Z',
    '2023-09-04T06:25:04.254Z',
    '2023-08-15T01:20:24.045Z',
    '2023-07-12T11:30:59.114Z',
    '2023-06-24T17:06:17.208Z',
    '2023-05-04T05:40:36.104Z',
    '2023-04-18T14:32:20.905Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};
const acc3 = {
  owner: 'Sarah Adam',
  movements: [5000, 140, 350, -100, -2450, -1730, 1240, -30],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2023-05-22T14:31:17.178Z',
    '2023-04-01T09:42:02.383Z',
    '2023-03-14T06:25:04.254Z',
    '2023-02-25T01:20:24.045Z',
    '2023-01-22T11:30:59.114Z',
    '2023-11-04T14:06:17.208Z',
    '2023-06-14T05:40:36.104Z',
    '2023-07-20T09:32:20.905Z',
  ],
  currency: 'SAR',
  locale: 'ar-EG',
};
const acc4 = {
  owner: 'Steven Jack',
  movements: [430, -50, 700, 50, 90],
  interestRate: 1.2,
  pin: 4444,
  movementsDates: [
    '2024-01-22T14:31:17.178Z',
    '2024-01-25T09:42:02.383Z',
    '2024-02-07T06:25:04.254Z',
    '2024-03-18T01:20:24.045Z',
    '2024-04-14T11:30:59.114Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG',
};
const accounts = [acc1, acc2, acc3, acc4];

///elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//// date Func

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yeasterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};
//// currency Func
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//// Movements Func
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  //// sperate deposit - withdrawl ... date for each upon to its locale and currency
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawl';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    //// insert into body each movement
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//// calcalute balance Func
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
//// calcalute Summary Func

const calcDisplaySummary = function (acc) {
  //// Incomes
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(
    Math.abs(incomes),
    acc.locale,
    acc.currency
  );
  //// OutComes
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  `${Math.abs(outcomes).toFixed(2)}$`;
  //// Interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
  `${interest.toFixed(2)}$`;
};
//// Create UserNames from Owners #Func
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

//// Update the UI Func
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
let currentAccount, timer;

//// event handler
//// timer for out Func
const startLogOutTimer = function () {
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//// login Func

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();
  //check for user name and password
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputCloseUsername.value = inputClosePin.value = '';
    inputLoginPin.blur();
    //// reset timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputLoginUsername.value = inputLoginPin.value = '';
});
//// Transfer Botton
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  //// check for valid reciver user
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //// check for valid amount
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //// insert the amount with its date into movements and reset timer then update ui
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
//// event for loan button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});
//// event for close button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //// update ui for log out
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

let sorted = false;
//// event for sort button
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
