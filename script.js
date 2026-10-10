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
const clickMeBtn = document.getElementById('clickMeBtn');
const viewMomentsVideoBtn = document.getElementById('viewMomentsVideoBtn');
const backToLetterBtn = document.getElementById('backToLetterBtn');
const videoToShowcaseBtn = document.getElementById('videoToShowcaseBtn');
const backToShowcaseFromLetterBtn = document.getElementById('backToShowcaseFromLetterBtn');
const momentsVideo = document.getElementById('momentsVideo');
const momentsVideo2 = document.getElementById('momentsVideo2');

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
  document.body.classList.remove('step-showcase', 'step-surprise', 'step-video');
  document.body.classList.add('step-question');
  tryAutoPlayMusic();
}

function openShowcaseScreen() {
  document.body.classList.remove('step-question', 'step-surprise', 'step-video');
  document.body.classList.add('step-showcase');
  tryAutoPlayMusic();
}

function openSurpriseScreen() {
  document.body.classList.remove('step-question', 'step-showcase', 'step-video');
  document.body.classList.add('step-surprise');
  tryAutoPlayMusic();
}

function openMomentsVideoScreen() {
  document.body.classList.remove('step-question', 'step-showcase', 'step-surprise');
  document.body.classList.add('step-video');

  // Pause synthesizer music box so video audio is clear
  if (musicBox && musicBox.isPlaying) {
    musicBox.stop();
    updateMusicUI(false);
  }

  // Reset video 2
  if (momentsVideo2) {
    momentsVideo2.pause();
    momentsVideo2.currentTime = 0;
  }

  // Play moments video 1 from beginning
  if (momentsVideo) {
    momentsVideo.currentTime = 0;
    const playPromise = momentsVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Video autoplay handled by browser:', err);
      });
    }
  }
}

function closeMomentsVideoScreen(target = 'surprise') {
  if (momentsVideo) {
    momentsVideo.pause();
  }
  if (momentsVideo2) {
    momentsVideo2.pause();
  }
  if (target === 'showcase') {
    openShowcaseScreen();
  } else {
    openSurpriseScreen();
  }
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
  yesBtn.addEventListener('click', openShowcaseScreen);
}

if (noBtn) {
  noBtn.addEventListener('click', handleNo);
}

if (clickMeBtn) {
  clickMeBtn.addEventListener('click', openSurpriseScreen);
}

if (viewMomentsVideoBtn) {
  viewMomentsVideoBtn.addEventListener('click', openMomentsVideoScreen);
}

if (backToLetterBtn) {
  backToLetterBtn.addEventListener('click', () => closeMomentsVideoScreen('surprise'));
}

if (videoToShowcaseBtn) {
  videoToShowcaseBtn.addEventListener('click', () => closeMomentsVideoScreen('showcase'));
}

if (backToShowcaseFromLetterBtn) {
  backToShowcaseFromLetterBtn.addEventListener('click', openShowcaseScreen);
}

// Mutual pause between both videos so audio doesn't clash
if (momentsVideo && momentsVideo2) {
  momentsVideo.addEventListener('play', () => {
    if (!momentsVideo2.paused) {
      momentsVideo2.pause();
    }
  });

  momentsVideo2.addEventListener('play', () => {
    if (!momentsVideo.paused) {
      momentsVideo.pause();
    }
  });
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
  if (document.body.classList.contains('step-video')) {
    if (e.key === 'Escape') {
      closeMomentsVideoScreen('surprise');
    }
    return;
  }

  if (document.body.classList.contains('step-surprise')) {
    if (e.key === 'Escape') {
      openShowcaseScreen();
    }
    return;
  }

  if (document.body.classList.contains('step-showcase')) {
    if (e.key === 'Enter' || e.key === ' ') {
      openSurpriseScreen();
    }
    return;
  }

  if (document.body.classList.contains('step-question')) {
    if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') {
      openShowcaseScreen();
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

// --- 1. Romantic Music Box Player (Web Audio API) ---
class RomanticMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    // Sweet, soothing lofi romantic music box melody
    this.melody = [
      261.63, 329.63, 392.00, 523.25,
      293.66, 369.99, 440.00, 587.33,
      220.00, 261.63, 329.63, 440.00,
      174.61, 220.00, 261.63, 349.23,
      196.00, 246.94, 293.66, 392.00,
      261.63, 329.63, 392.00, 523.25
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playNote(freq) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Bell music-box envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch(err) {}
  }

  start() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;

    const tick = () => {
      if (!this.isPlaying) return;
      const freq = this.melody[this.step % this.melody.length];
      this.playNote(freq);
      this.step++;
      this.timer = setTimeout(tick, 340);
    };
    tick();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

const musicBox = new RomanticMusicBox();
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicLabel = document.getElementById('musicLabel');

function updateMusicUI(isPlaying) {
  if (!musicToggleBtn) return;
  musicToggleBtn.classList.toggle('playing', isPlaying);
  if (musicLabel) {
    musicLabel.textContent = isPlaying ? 'Music: Playing' : 'Music: Paused';
  }
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', () => {
    const isPlaying = musicBox.toggle();
    updateMusicUI(isPlaying);
  });
}

function tryAutoPlayMusic() {
  if (!musicBox.isPlaying) {
    musicBox.start();
    updateMusicUI(true);
  }
}

// --- 2. Interactive Wax Seal Envelope Opening ---
// --- 2. Interactive Wax Seal Envelope Opening ---
const sealedEnvelopeStage = document.getElementById('sealedEnvelopeStage');
const openedLetterView = document.getElementById('openedLetterView');
const envFlap = document.getElementById('envFlap');
const waxSealBtn = document.getElementById('waxSealBtn');
const resealEnvelopeBtn = document.getElementById('resealEnvelopeBtn');

function openEnvelope() {
  if (waxSealBtn) waxSealBtn.classList.add('broken');
  if (envFlap) envFlap.classList.add('open');

  setTimeout(() => {
    if (sealedEnvelopeStage) {
      sealedEnvelopeStage.classList.add('opening');
      setTimeout(() => {
        sealedEnvelopeStage.classList.add('hidden');
        if (openedLetterView) {
          openedLetterView.classList.add('visible');
          openedLetterView.setAttribute('aria-hidden', 'false');
        }
      }, 350);
    }
  }, 450);
  tryAutoPlayMusic();
}

function resealEnvelope() {
  if (openedLetterView) {
    openedLetterView.classList.remove('visible');
    openedLetterView.setAttribute('aria-hidden', 'true');
  }
  if (sealedEnvelopeStage) {
    sealedEnvelopeStage.classList.remove('hidden', 'opening');
  }
  if (envFlap) envFlap.classList.remove('open');
  if (waxSealBtn) waxSealBtn.classList.remove('broken');
}

if (waxSealBtn) {
  waxSealBtn.addEventListener('click', openEnvelope);
}

if (resealEnvelopeBtn) {
  resealEnvelopeBtn.addEventListener('click', resealEnvelope);
}

// --- 3. Relationship Counter (Live count from 11 October 2024) ---
const cntDays = document.getElementById('cntDays');
const cntHours = document.getElementById('cntHours');
const cntMinutes = document.getElementById('cntMinutes');
const cntSeconds = document.getElementById('cntSeconds');

// Relationship start date: 11 October 2024 (00:00:00)
const RELATIONSHIP_START_DATE = new Date(2024, 9, 11, 0, 0, 0);

function updateRelationshipCounter() {
  const now = new Date();
  const diffMs = Math.max(0, now - RELATIONSHIP_START_DATE);
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (cntDays) cntDays.textContent = String(days);
  if (cntHours) cntHours.textContent = String(hours).padStart(2, '0');
  if (cntMinutes) cntMinutes.textContent = String(minutes).padStart(2, '0');
  if (cntSeconds) cntSeconds.textContent = String(seconds).padStart(2, '0');
}

setInterval(updateRelationshipCounter, 1000);
updateRelationshipCounter();

// --- 4. Polaroid Memory Cards Modal & Surprise Reveal ---
const polaroidCards = document.querySelectorAll('.polaroid-card');
const polaroidModal = document.getElementById('polaroidModal');
const polaroidModalClose = document.getElementById('polaroidModalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

function triggerHeartBurst(x, y) {
  const emojis = ['💖', '💕', '✨', '🌸', '🧸', '💝'];
  for (let i = 0; i < 9; i++) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (i / 9) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
    const dist = 45 + Math.random() * 45;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 20;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--dy', `${dy}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }
}

polaroidCards.forEach(card => {
  card.addEventListener('click', (e) => {
    const img = card.querySelector('.polaroid-pic') || card.querySelector('img');
    const title = card.getAttribute('data-title') || 'Sweet Moment';
    const text = card.getAttribute('data-text') || '';
    const modalImageSrc = card.getAttribute('data-modal-img') || (img ? img.src : '');
    const revealImg = card.getAttribute('data-reveal-img');

    // Trigger reveal if card has secret reveal image (starts with bear image, reveals photo on click)
    if (revealImg && img) {
      const rect = card.getBoundingClientRect();
      const burstX = e.clientX || (rect.left + rect.width / 2);
      const burstY = e.clientY || (rect.top + rect.height / 2);
      triggerHeartBurst(burstX, burstY);

      if (!card.classList.contains('is-revealed')) {
        card.classList.add('is-revealed');
        // Smoothly reveal image on the card
        img.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        img.style.opacity = '0';
        img.style.transform = 'scale(0.94)';

        setTimeout(() => {
          img.src = revealImg;
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        }, 180);

        const pill = card.querySelector('.reveal-hint-pill');
        if (pill) {
          pill.textContent = '💖 Revealed! ✨';
          setTimeout(() => {
            pill.style.opacity = '0';
          }, 1500);
        }
      }
    }

    if (modalImg) {
      if (modalImageSrc) {
        modalImg.src = modalImageSrc;
      }
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = text;
    if (polaroidModal) {
      polaroidModal.classList.add('visible');
      polaroidModal.setAttribute('aria-hidden', 'false');
    }
  });
});

function closePolaroidModal() {
  if (polaroidModal) {
    polaroidModal.classList.remove('visible');
    polaroidModal.setAttribute('aria-hidden', 'true');
  }
}

if (polaroidModalClose) {
  polaroidModalClose.addEventListener('click', closePolaroidModal);
}

if (polaroidModal) {
  polaroidModal.addEventListener('click', (e) => {
    if (e.target === polaroidModal) {
      closePolaroidModal();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePolaroidModal();
  }
});
