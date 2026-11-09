/* --- NATIVE AUDIO SYNTHESIZER (NO EXTERNAL FILES) --- */
const AudioEngine = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playPop() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  },

  playTone(freq, duration, type = 'sine') {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  playTune() {
    // Short Happy Birthday Melody Snippet
    const notes = [
      { f: 264, d: 0.3 }, { f: 264, d: 0.3 }, { f: 297, d: 0.5 },
      { f: 264, d: 0.5 }, { f: 352, d: 0.5 }, { f: 330, d: 0.8 }
    ];
    let time = 0;
    notes.forEach(note => {
      setTimeout(() => this.playTone(note.f, note.d, 'triangle'), time * 1000);
      time += note.d + 0.1;
    });
  }
};

/* --- STEP MANAGEMENT ENGINE --- */
let currentStep = 1;
const totalSteps = 5;

function goToStep(stepNumber) {
  AudioEngine.playPop();
  
  // Hide all steps
  document.querySelectorAll('.step-card').forEach(card => {
    card.classList.remove('active');
  });

  // Activate targeted step
  const targetCard = document.getElementById(`step${stepNumber}`);
  if (targetCard) {
    targetCard.classList.add('active');
    currentStep = stepNumber;
    document.getElementById('stepCounter').innerText = `STAGE 0${currentStep} / 05`;
  }
}

/* --- STEP 1: SEALED BOX TRIGGER --- */
document.getElementById('boxTrigger').addEventListener('click', () => {
  AudioEngine.playTune();
  goToStep(2);
});

/* --- STEP 2: CANDLE BLOWING --- */
const candleFlame = document.getElementById('candleFlame');
const blowBtn = document.getElementById('blowCandleBtn');

blowBtn.addEventListener('click', () => {
  candleFlame.classList.add('off');
  AudioEngine.playPop();
  blowBtn.innerText = "CELEBRATION UNLOCKED!";
  blowBtn.disabled = true;

  setTimeout(() => {
    goToStep(3);
  }, 1200);
});

/* --- STEP 3: 3D CARD FLIP --- */
const card3d = document.getElementById('card3d');
const nextStep3Btn = document.getElementById('nextStep3Btn');

card3d.addEventListener('click', () => {
  card3d.classList.toggle('flipped');
  AudioEngine.playPop();
  nextStep3Btn.classList.remove('hidden');
});

nextStep3Btn.addEventListener('click', () => {
  goToStep(4);
});

/* --- STEP 4: ROAST ENGINE --- */
const roasts = [
  "\"Choti choti baat pe irritate hona tera birthright hai!\"",
  "\"Khana thik-thak bana leti ho, par gussa ekdam top level ka hai.\"",
  "\"Chitpitiya types fan #1 - Always ready to fight for no reason.\"",
  "\"Cutie-beauty roasts ki queen, par pyari behan hamesha!\"",
  "\"Irritated expression is your default wallpaper.\""
];

const roastText = document.getElementById('roastText');
const generateRoastBtn = document.getElementById('generateRoastBtn');
const nextStep4Btn = document.getElementById('nextStep4Btn');
let roastCount = 0;

generateRoastBtn.addEventListener('click', () => {
  AudioEngine.playPop();
  const randomIndex = Math.floor(Math.random() * roasts.length);
  roastText.innerText = roasts[randomIndex];
  roastCount++;

  if (roastCount >= 2) {
    nextStep4Btn.classList.remove('hidden');
  }
});

nextStep4Btn.addEventListener('click', () => {
  AudioEngine.playTune();
  goToStep(5);
});

/* --- STEP 5: RESTART --- */
document.getElementById('restartBtn').addEventListener('click', () => {
  // Reset states
  candleFlame.classList.remove('off');
  blowBtn.innerText = "💨 BLOW OUT CANDLE";
  blowBtn.disabled = false;
  card3d.classList.remove('flipped');
  nextStep3Btn.classList.add('hidden');
  nextStep4Btn.classList.add('hidden');
  roastCount = 0;
  roastText.innerText = '"Click the button to extract Didi\'s personality trait..."';
  
  goToStep(1);
});

/* --- CANVAS BACKGROUND ANIME PARTICLES --- */
const canvas = document.getElementById('animeCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
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