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

let currentStep = 1;
const totalSteps = 4;

function goToStep(stepNumber) {
  AudioEngine.playPop();
  
  document.querySelectorAll('.step-card').forEach(card => {
    card.classList.remove('active');
  });

  const targetCard = document.getElementById(`step${stepNumber}`);
  if (targetCard) {
    targetCard.classList.add('active');
    currentStep = stepNumber;
    document.getElementById('stepCounter').innerText = `STAGE 0${currentStep} / 04`;
  }
}

document.getElementById('boxTrigger').addEventListener('click', () => {
  AudioEngine.playTune();
  goToStep(2);
});

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

const card3d = document.getElementById('card3d');
const nextStep3Btn = document.getElementById('nextStep3Btn');

card3d.addEventListener('click', () => {
  card3d.classList.toggle('flipped');
  AudioEngine.playPop();
  nextStep3Btn.classList.remove('hidden');
});

nextStep3Btn.addEventListener('click', () => {
  AudioEngine.playTune();
  goToStep(4);
});

document.getElementById('restartBtn').addEventListener('click', () => {
  candleFlame.classList.remove('off');
  blowBtn.innerText = "💨 BLOW OUT CANDLE";
  blowBtn.disabled = false;
  card3d.classList.remove('flipped');
  nextStep3Btn.classList.add('hidden');
  
  goToStep(1);
});

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
