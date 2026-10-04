const correctPassword = "22114251";
const maxLength = 8;
let input = [];

const slots = [...document.querySelectorAll('.slot')];
const keypadButtons = [...document.querySelectorAll('.keypad-button')];

function renderSlots() {
  slots.forEach((slot, index) => {
    const value = input[index];
    slot.textContent = value || '';
    slot.classList.toggle('filled', Boolean(value));
  });
}

function shakeScreen() {
  const screen = document.getElementById('lockScreen');
  screen.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-12px)' },
      { transform: 'translateX(12px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 260, easing: 'ease-in-out' }
  );
}

function unlock() {
  document.body.classList.add('unlocked');
}

function handleInput(value) {
  if (input.length >= maxLength) {
    return;
  }

  input.push(value);
  renderSlots();

  if (input.length === maxLength) {
    const enteredCode = input.join('');

    if (enteredCode === correctPassword) {
      setTimeout(unlock, 360);
    } else {
      input = [];
      renderSlots();
      shakeScreen();
    }
  }
}

function handleBackspace() {
  input.pop();
  renderSlots();
}

function handleClear() {
  input = [];
  renderSlots();
}

keypadButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) {
      handleInput(value);
      return;
    }

    if (action === 'backspace') {
      handleBackspace();
      return;
    }

    if (action === 'clear') {
      handleClear();
    }
  });
});

renderSlots();
