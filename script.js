const correctPassword = "22114251";
const maxLength = 8;
let input = [];

const slots = [...document.querySelectorAll('.slot')];
const keypadButtons = [...document.querySelectorAll('.keypad-button')];
const wrongModal = document.getElementById('wrongModal');
const tryAgainBtn = document.getElementById('tryAgainBtn');

function renderSlots() {
  slots.forEach((slot, index) => {
    const value = input[index];
    slot.textContent = value || '';
    slot.classList.toggle('filled', Boolean(value));
    slot.classList.toggle('active', index === input.length && input.length < maxLength);
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

function showWrongModal() {
  if (!wrongModal) return;
  wrongModal.classList.add('visible');
  wrongModal.setAttribute('aria-hidden', 'false');
}

function hideWrongModal() {
  if (!wrongModal) return;
  wrongModal.classList.remove('visible');
  wrongModal.setAttribute('aria-hidden', 'true');
  input = [];
  renderSlots();
}

function unlock() {
  document.body.classList.add('unlocked');
}

function handleInput(value) {
  if (wrongModal && wrongModal.classList.contains('visible')) {
    hideWrongModal();
  }

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
      setTimeout(() => {
        shakeScreen();
        showWrongModal();
      }, 180);
    }
  }
}

function handleBackspace() {
  if (wrongModal && wrongModal.classList.contains('visible')) {
    hideWrongModal();
    return;
  }
  input.pop();
  renderSlots();
}

function handleClear() {
  if (wrongModal && wrongModal.classList.contains('visible')) {
    hideWrongModal();
    return;
  }
  input = [];
  renderSlots();
}

if (tryAgainBtn) {
  tryAgainBtn.addEventListener('click', hideWrongModal);
}

if (wrongModal) {
  wrongModal.addEventListener('click', (e) => {
    if (e.target === wrongModal) {
      hideWrongModal();
    }
  });
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

slots.forEach((slot, index) => {
  slot.addEventListener('click', () => {
    if (input.length > index) {
      input = input.slice(0, index);
      renderSlots();
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (document.body.classList.contains('unlocked')) return;
  if (wrongModal && wrongModal.classList.contains('visible')) {
    if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
      e.preventDefault();
      hideWrongModal();
      return;
    }
  }
  if (/^[0-9]$/.test(e.key)) {
    handleInput(e.key);
  } else if (e.key === 'Backspace') {
    handleBackspace();
  } else if (e.key === 'Escape' || e.key === 'Delete') {
    handleClear();
  }
});

renderSlots();
