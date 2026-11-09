const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  playPop() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
};

let currentStep = 1;

function goToStep(stepNumber) {
  AudioEngine.playPop();
  document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active'));
  const targetCard = document.getElementById(`step${stepNumber}`);
  if (targetCard) {
    targetCard.classList.add('active');
    currentStep = stepNumber;
    document.getElementById('stepCounter').innerText = `STAGE ${currentStep < 10 ? '0' + currentStep : currentStep} / 12`;
  }
}

/* STAGE 1 */
document.getElementById('step1Trigger').addEventListener('click', () => goToStep(2));

/* STAGE 2: PIN SYSTEM */
let enteredPin = "";
const targetPin = "1409";
const pinDisplay = document.getElementById('pinDisplay');

document.querySelectorAll('.key-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    AudioEngine.playPop();
    const val = e.target.getAttribute('data-val');
    if (enteredPin.length < 4) {
      enteredPin += val;
      pinDisplay.innerText = enteredPin.padEnd(4, '_').split('').join(' ');
    }
    if (enteredPin === targetPin) {
      setTimeout(() => goToStep(3), 500);
    } else if (enteredPin.length === 4) {
      setTimeout(() => {
        enteredPin = "";
        pinDisplay.innerText = "_ _ _ _";
      }, 500);
    }
  });
});

/* STAGE 3 */
document.getElementById('blowBtn').addEventListener('click', () => {
  document.getElementById('candleFlame').classList.add('off');
  AudioEngine.playPop();
  setTimeout(() => goToStep(4), 1000);
});

/* STAGE 4 */
document.getElementById('step4Next').addEventListener('click', () => goToStep(5));

/* STAGE 5 */
const card3d = document.getElementById('card3d');
const step5Next = document.getElementById('step5Next');
card3d.addEventListener('click', () => {
  card3d.classList.toggle('flipped');
  AudioEngine.playPop();
  step5Next.classList.remove('hidden');
});
step5Next.addEventListener('click', () => goToStep(6));

/* STAGE 6: PUZZLE MATRIX */
const puzzleGrid = document.getElementById('puzzleGrid');
const symbols = ['⭐', '🌙', '⭐', '🌙'];
let flippedTiles = [];
let matchedCount = 0;

symbols.sort(() => Math.random() - 0.5);

symbols.forEach((sym, index) => {
  const tile = document.createElement('div');
  tile.classList.add('puzzle-tile');
  tile.dataset.symbol = sym;
  tile.innerText = '?';
  tile.addEventListener('click', () => {
    if (flippedTiles.length < 2 && !tile.classList.contains('matched') && !flippedTiles.includes(tile)) {
      AudioEngine.playPop();
      tile.innerText = sym;
      flippedTiles.push(tile);

      if (flippedTiles.length === 2) {
        if (flippedTiles[0].dataset.symbol === flippedTiles[1].dataset.symbol) {
          flippedTiles.forEach(t => t.classList.add('matched'));
          matchedCount += 2;
          flippedTiles = [];
          if (matchedCount === 4) {
            document.getElementById('step6Next').classList.remove('hidden');
          }
        } else {
          setTimeout(() => {
            flippedTiles.forEach(t => t.innerText = '?');
            flippedTiles = [];
          }, 800);
        }
      }
    }
  });
  puzzleGrid.appendChild(tile);
});
document.getElementById('step6Next').addEventListener('click', () => goToStep(7));

/* STAGE 7 */
document.getElementById('step7Next').addEventListener('click', () => goToStep(8));

/* STAGE 8 */
const wishes = [
  "\"May your days be stress-free and peaceful!\"",
  "\"Always stay happy and keep spreading your positive energy!\"",
  "\"May all your goals and ambitions turn into reality this year!\""
];
let wishIdx = 0;
document.getElementById('genWishBtn').addEventListener('click', () => {
  AudioEngine.playPop();
  document.getElementById('wishText').innerText = wishes[wishIdx % wishes.length];
  wishIdx++;
  if (wishIdx >= 3) {
    document.getElementById('step8Next').classList.remove('hidden');
  }
});
document.getElementById('step8Next').addEventListener('click', () => goToStep(9));

/* STAGE 9 */
document.getElementById('step9Next').addEventListener('click', () => goToStep(10));

/* STAGE 10 */
let energy = 0;
document.getElementById('chargeBtn').addEventListener('click', () => {
  AudioEngine.playPop();
  energy += 20;
  if (energy > 100) energy = 100;
  document.getElementById('meterInner').style.width = energy + '%';
  document.getElementById('meterVal').innerText = energy + '%';
  if (energy === 100) {
    setTimeout(() => goToStep(11), 600);
  }
});

/* STAGE 11 */
document.getElementById('step11Next').addEventListener('click', () => goToStep(12));

/* STAGE 12: RESTART */
document.getElementById('restartBtn').addEventListener('click', () => {
  enteredPin = "";
  pinDisplay.innerText = "_ _ _ _";
  document.getElementById('candleFlame').classList.remove('off');
  card3d.classList.remove('flipped');
  step5Next.classList.add('hidden');
  document.getElementById('step6Next').classList.add('hidden');
  matchedCount = 0;
  flippedTiles = [];
  document.querySelectorAll('.puzzle-tile').forEach(t => t.innerText = '?');
  wishIdx = 0;
  document.getElementById('wishText').innerText = '"Tap button below to extract wishes..."';
  document.getElementById('step8Next').classList.add('hidden');
  energy = 0;
  document.getElementById('meterInner').style.width = '0%';
  document.getElementById('meterVal').innerText = '0%';
  goToStep(1);
});

/* CANVAS BACKGROUND PARTICLES */
const canvas = document.getElementById('animeCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({ length: 45 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 2 + 1,
  speedY: -Math.random() * 0.8 - 0.2,
  opacity: Math.random() * 0.5 + 0.2
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.y += p.speedY;
    if (p.y < 0) p.y = canvas.height;
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
