const canvas = document.getElementById('canvas');
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

function updateCanvasScale() {
  const scale = Math.min(
    window.innerWidth / CANVAS_WIDTH,
    window.innerHeight / CANVAS_HEIGHT
  );

  canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

updateCanvasScale();

window.addEventListener('resize', updateCanvasScale);
window.addEventListener('orientationchange', updateCanvasScale);


const screens = document.querySelectorAll('.screen');
let isTransitioning = false;

function showScreen(name) {
  const target = document.querySelector(`.screen[data-screen="${name}"]`);
  const current = document.querySelector('.screen.active');

  if (!target || target === current || isTransitioning) {
    return;
  }

  isTransitioning = true;

  screens.forEach(screen => {
    [...screen.children].forEach((element, index) => {
      element.style.setProperty('--stagger-index', index);
    });
  });

  if (current) {
    current.classList.add('is-exiting');
    current.classList.remove('active');
  }

  const elementCount = current ? current.children.length : 0;

  const exitTime =
    450 + Math.max(0, elementCount - 1) * 90;

  const delayBetween = 150;

  setTimeout(() => {
    if (current) {
      current.classList.remove('is-exiting');
    }

    target.classList.add('active');

    const newElementCount = target.children.length;

    const enterTime =
      450 + Math.max(0, newElementCount - 1) * 90;

    setTimeout(() => {
    if (name === 'end') {
        updateDaysCounter();
    }

    isTransitioning = false;
    }, enterTime);

  }, exitTime + delayBetween);
}


document.querySelectorAll('[data-next]').forEach(el => {
  el.addEventListener('click', () => {
    showScreen(el.dataset.next);
  });
});


const bgSong = document.getElementById('bgSong');
let songStarted = false;

function maybeStartSong(screenName) {
  if (screenName === 'song' && !songStarted) {
    songStarted = true;

    bgSong.play().catch(err => {
      console.warn('Song could not autoplay:', err);
    });
  }
}

document.querySelectorAll('[data-next]').forEach(el => {
  el.addEventListener('click', () => {
    maybeStartSong(el.dataset.next);
  });
});


const mainIcon = document.getElementById('mainIcon');

mainIcon.addEventListener('click', () => {
  mainIcon.classList.remove('pulse');

  void mainIcon.offsetWidth;

  mainIcon.classList.add('pulse');
});


const START_DATE = new Date('2025-07-14T00:00:00');

function updateDaysCounter() {
  const msPerDay = 1000 * 60 * 60 * 24;

  const targetValue = Math.floor(
    (Date.now() - START_DATE.getTime()) / msPerDay
  );

  const counter = document.getElementById('daysCounterValue');
  const message = document.getElementById('counterMessage')

  message.style.opacity = '0';
  message.style.transform = 'translateY(20px)';

  let currentValue = 0;

  function animateCounter() {
    if (currentValue >= targetValue) {
        counter.textContent = String(targetValue).padStart(3, '0');

        const message = document.getElementById('counterMessage');

        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 300);

        return;
    }

    currentValue++;

    counter.textContent = String(currentValue).padStart(3, '0');

    const progress = currentValue / targetValue;

    const slowdownStart = 0.90;

    const normalizedProgress = Math.max(
    0,
    (progress - slowdownStart) / (1 - slowdownStart)
    );

    const delay = 5 + Math.pow(normalizedProgress, 3) * 120;

    setTimeout(animateCounter, delay);
  }

  counter.textContent = '000';
  animateCounter();
}


const lastYesBtn = document.getElementById('lastYesBtn');
const customAnswerInput = document.getElementById('customAnswerInput');
const sendAnswerBtn = document.getElementById('sendAnswerBtn');
const submitStatus = document.getElementById('submitStatus');

async function recordAnswer(answerText) {
  submitStatus.textContent = 'sending Response..';

  try {
    await db.collection('answers').add({
      answer: answerText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    submitStatus.textContent = '';

    showScreen('end');
  } catch (err) {
    console.error('Failed to save answer:', err);

    submitStatus.textContent =
      'Something went wrong? try again pls..';
  }
}

lastYesBtn.addEventListener('click', () => {
  recordAnswer('Yes');
});


sendAnswerBtn.addEventListener('click', () => {
  const text = customAnswerInput.value.trim();

  if (!text) {
    submitStatus.textContent = 'type something first pls..';
    return;
  }

  recordAnswer(text);
});