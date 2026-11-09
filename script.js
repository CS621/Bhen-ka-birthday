document.addEventListener("DOMContentLoaded", () => {
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
  const step1Trigger = document.getElementById('step1Trigger');
  if (step1Trigger) {
    step1Trigger.addEventListener('click', () => goToStep(2));
  }

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
        if (pinDisplay) pinDisplay.innerText = enteredPin.padEnd(4, '_').split('').join(' ');
      }
      if (enteredPin === targetPin) {
        setTimeout(() => goToStep(3), 500);
      } else if (enteredPin.length === 4) {
        setTimeout(() => {
          enteredPin = "";
          if (pinDisplay) pinDisplay.innerText = "_ _ _ _";
        }, 500);
      }
    });
  });

  /* STAGE 3 */
  const blowBtn = document.getElementById('blowBtn');
  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      const candleFlame = document.getElementById('candleFlame');
      if (candleFlame) candleFlame.classList.add('off');
      AudioEngine.playPop();
      setTimeout(() => goToStep(4), 1000);
    });
  }

  /* STAGE 4 */
  const step4Next = document.getElementById('step4Next');
  if (step4Next) step4Next.addEventListener('click', () => goToStep(5));

  /* STAGE 5 */
  const card3d = document.getElementById('card3d');
  const step5Next = document.getElementById('step5Next');
  if (card3d && step5Next) {
    card3d.addEventListener('click', () => {
      card3d.classList.toggle('flipped');
      AudioEngine.playPop();
      step5Next.classList.remove('hidden');
    });
    step5Next.addEventListener('click', () => goToStep(6));
  }

  /* STAGE 6: PUZZLE MATRIX */
  const puzzleGrid = document.getElementById('puzzleGrid');
  const step6Next = document.getElementById('step6Next');
  if (puzzleGrid && step6Next) {
    const symbols = ['⭐', '🌙', '⭐', '🌙'];
    let flippedTiles = [];
    let matchedCount = 0;

    symbols.sort(() => Math.random() - 0.5);

    symbols.forEach((sym) => {
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
                step6Next.classList.remove('hidden');
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
    step6Next.addEventListener('click', () => goToStep(7));
  }

  /* STAGE 7 */
  const step7Next = document.getElementById('step7Next');
  if (step7Next) step7Next.addEventListener('click', () => goToStep(8));

  /* STAGE 8 */
  const wishes = [
    "\"May your days be stress-free and peaceful!\"",
    "\"Always stay happy and keep spreading your positive energy!\"",
    "\"May all your goals and ambitions turn into reality this year!\""
  ];
  let wishIdx = 0;
  const genWishBtn = document.getElementById('genWishBtn');
  const step8Next = document.getElementById('step8Next');
  const wishText = document.getElementById('wishText');
  if (genWishBtn && step8Next && wishText) {
    genWishBtn.addEventListener('click', () => {
      AudioEngine.playPop();
      wishText.innerText = wishes[wishIdx % wishes.length];
      wishIdx++;
      if (wishIdx >= 3) {
        step8Next.classList.remove('hidden');
      }
    });
    step8Next.addEventListener('click', () => goToStep(9));
  }

  /* STAGE 9 */
  const step9Next = document.getElementById('step9Next');
  if (step9Next) step9Next.addEventListener('click', () => goToStep(10));

  /* STAGE 10 */
  let energy = 0;
  const chargeBtn = document.getElementById('chargeBtn');
  const meterInner = document.getElementById('meterInner');
  const meterVal = document.getElementById('meterVal');
  if (chargeBtn && meterInner && meterVal) {
    chargeBtn.addEventListener('click', () => {
      AudioEngine.playPop();
      energy += 20;
      if (energy > 100) energy = 100;
      meterInner.style.width = energy + '%';
      meterVal.innerText = energy + '%';
      if (energy === 100) {
        setTimeout(() => goToStep(11), 600);
      }
    });
  }

  /* STAGE 11 */
  const step11Next = document.getElementById('step11Next');
  if (step11Next) step11Next.addEventListener('click', () => goToStep(12));

  /* STAGE 12: RESTART */
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      enteredPin = "";
      if (pinDisplay) pinDisplay.innerText = "_ _ _ _";
      const candleFlame = document.getElementById('candleFlame');
      if (candleFlame) candleFlame.classList.remove('off');
      if (card3d) card3d.classList.remove('flipped');
      if (step5Next) step5Next.classList.add('hidden');
      if (step6Next) step6Next.classList.add('hidden');
      wishIdx = 0;
      if (wishText) wishText.innerText = '"Tap button below to extract wishes..."';
      if (step8Next) step8Next.classList.add('hidden');
      energy = 0;
      if (meterInner) meterInner.style.width = '0%';
      if (meterVal) meterVal.innerText = '0%';
      goToStep(1);
    });
  }

  /* CANVAS BACKGROUND PARTICLES */
  const canvas = document.getElementById('animeCanvas');
  if (canvas) {
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
  }
});
