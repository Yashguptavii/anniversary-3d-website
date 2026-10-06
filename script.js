const correctPassword = "22114251";
const maxLength = 8;
let input = [];

const slots = [...document.querySelectorAll('.slot')];
const keypadButtons = [...document.querySelectorAll('.keypad-button')];
const wrongModal = document.getElementById('wrongModal');
const wrongModalTitle = document.getElementById('wrongModalTitle');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noPlea = document.getElementById('noPlea');

let noCount = 0;
let modalSource = 'passcode'; // 'passcode' | 'question_no'

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

function renderArchedTitle(container, text) {
  if (!container) return;
  container.innerHTML = '';
  container.setAttribute('aria-label', text);
  const chars = [...text];
  const n = chars.length;
  const mid = (n - 1) / 2;

  chars.forEach((char, i) => {
    const span = document.createElement('span');
    if (char === ' ') {
      span.className = 'title-space';
      span.innerHTML = '&nbsp;';
    } else {
      const distFromMid = mid === 0 ? 0 : (i - mid) / mid;
      const archY = Math.abs(distFromMid) * 8 - 2;
      const archRot = distFromMid * 10;
      span.style.setProperty('--i', i);
      span.style.setProperty('--arch-y', `${archY.toFixed(1)}px`);
      span.style.setProperty('--arch-rot', `${archRot.toFixed(1)}deg`);
      span.textContent = char;
    }
    container.appendChild(span);
  });
}

function showWrongModal(type = 'passcode') {
  if (!wrongModal) return;
  modalSource = type;

  if (type === 'passcode') {
    renderArchedTitle(wrongModalTitle, 'WRONG PASSCODE!');
    if (tryAgainBtn) tryAgainBtn.textContent = 'TRY AGAIN';
  } else if (type === 'question_no') {
    renderArchedTitle(wrongModalTitle, 'NOTANKI');
    if (tryAgainBtn) tryAgainBtn.textContent = 'MAN JAO NA 💕';
  }

  wrongModal.classList.add('visible');
  wrongModal.setAttribute('aria-hidden', 'false');
}

function hideWrongModal() {
  if (!wrongModal) return;
  wrongModal.classList.remove('visible');
  wrongModal.setAttribute('aria-hidden', 'true');
  if (modalSource === 'passcode') {
    input = [];
    renderSlots();
  }
}

function openQuestionScreen() {
  document.body.classList.remove('step-surprise');
  document.body.classList.add('step-question');
}

function openSurpriseScreen() {
  document.body.classList.remove('step-question');
  document.body.classList.add('step-surprise');
}

function handleNo() {
  noCount++;

  // Always show "Bhessiii, natak nhi" under the buttons
  if (noPlea) {
    noPlea.textContent = 'Bhessiii, natak nhi';
    noPlea.classList.remove('pop');
    void noPlea.offsetWidth;
    noPlea.classList.add('pop');
  }

  // Playful shake animation on the NO button
  if (noBtn) {
    noBtn.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px) rotate(-6deg)' },
        { transform: 'translateX(10px) rotate(6deg)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 320, easing: 'ease-in-out' }
    );
  }

  // YES button size increases progressively every time
  if (yesBtn) {
    yesBtn.classList.add('pulse-grow');
    const nextScale = 1 + noCount * 0.28;
    yesBtn.style.transform = `scale(${nextScale})`;
  }

  // Only on the 2nd click: show the popup modal with NOTANKI!
  if (noCount === 2) {
    setTimeout(() => {
      showWrongModal('question_no');
    }, 220);
  }
  // For noCount > 2: modal is NEVER shown again, only YES button grows!
}

if (yesBtn) {
  yesBtn.addEventListener('click', openSurpriseScreen);
}

if (noBtn) {
  noBtn.addEventListener('click', handleNo);
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
      setTimeout(openQuestionScreen, 360);
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
  if (document.body.classList.contains('step-surprise')) return;

  if (document.body.classList.contains('step-question')) {
    if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') {
      openSurpriseScreen();
    } else if (e.key === 'n' || e.key === 'N') {
      handleNo();
    }
    return;
  }

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
