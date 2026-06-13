// LIVE CLOCK
(function() {
  function updateClock() {
    const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    const clockEl = document.getElementById('liveClock');
    if (clockEl) clockEl.innerText = timeStr.replace(/\u202f/g, ' ');
  }
  updateClock();
  setInterval(updateClock, 1000);
})();

// THEME + GIF + 3D FLIP
(function() {
  const card = document.getElementById('card');
  const themeBtn = document.getElementById('themeBtn');
  const gifBg = document.getElementById('cardGifBg');
  function setTheme(theme) {
    if (theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    localStorage.setItem('yokai_theme', theme);
  }
  function getTheme() { return document.body.classList.contains('light') ? 'light' : 'dark'; }
  if (localStorage.getItem('yokai_theme') === 'light') setTheme('light');
  let isFlipping = false;
  function startGifAndFlip() {
    if (isFlipping) return;
    isFlipping = true;
    if (gifBg) gifBg.classList.add('active');
    setTimeout(() => {
      if (gifBg) gifBg.classList.remove('active');
      if (card) card.classList.add('flipping');
      const onEnd = () => {
        if (card) card.classList.remove('flipping');
        const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        isFlipping = false;
        if (card) card.removeEventListener('animationend', onEnd);
      };
      if (card) card.addEventListener('animationend', onEnd, { once: true });
    }, 800);
  }
  if (themeBtn) themeBtn.addEventListener('click', () => { if (!isFlipping) startGifAndFlip(); });
})();

// EMAIL COPY
(function() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const email = 'itachiyaar@gmail.com';
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
  }
  if (copyBtn) copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(email).then(() => showToast('📧 Email copied!')).catch(() => showToast('❌ Failed'));
  });
})();

// HOLD TO SLIDE
(function() {
  const card = document.getElementById('card');
  let holdTimeout = null, isHolding = false;
  function startHold() {
    holdTimeout = setTimeout(() => {
      if (card && !card.classList.contains('flipping')) {
        card.classList.add('card-hold');
        isHolding = true;
      }
    }, 350);
  }
  function cancelHold() {
    if (holdTimeout) clearTimeout(holdTimeout);
    if (isHolding && card) {
      card.classList.remove('card-hold');
      isHolding = false;
    }
  }
  if (card) {
    card.addEventListener('mousedown', startHold);
    window.addEventListener('mouseup', cancelHold);
    card.addEventListener('touchstart', startHold);
    window.addEventListener('touchend', cancelHold);
    window.addEventListener('touchcancel', cancelHold);
    card.addEventListener('contextmenu', (e) => e.preventDefault());
  }
})();

// RIPPLE
(function() {
  const card = document.getElementById('card');
  function createRipple(event, isTouch = false) {
    if (!card || card.classList.contains('flipping')) return;
    const rect = card.getBoundingClientRect();
    let clientX, clientY;
    if (isTouch && event.touches) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event.clientX !== undefined) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = 70;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size/2}px`;
    ripple.style.top = `${y - size/2}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }
  if (card) {
    card.addEventListener('mousedown', (e) => createRipple(e, false));
    card.addEventListener('touchstart', (e) => createRipple(e, true));
  }
})();

// SKILLS BOX TOGGLE
(function() {
  const toggleBtn = document.getElementById('skillsToggleBtn');
  const skillsBox = document.getElementById('skillsBox');
  let boxOpen = false;
  function animateBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const width = bar.getAttribute('data-width');
      if (width && bar.style.width !== width + '%') bar.style.width = width + '%';
    });
  }
  if (toggleBtn) toggleBtn.addEventListener('click', () => {
    if (boxOpen && skillsBox) skillsBox.classList.remove('open');
    else if (skillsBox) { skillsBox.classList.add('open'); setTimeout(animateBars, 80); }
    boxOpen = !boxOpen;
  });
})();

// GLASS ICONS INJECTION
(function() {
  const container = document.getElementById('glassIconsContainer');
  if (container && container.children.length === 0) {
    const iconItems = [
      { icon: '<i class="fab fa-node-js"></i>', color: 'green', label: 'Node.js' },
      { icon: '<i class="fab fa-python"></i>', color: 'blue', label: 'Python' },
      { icon: '<i class="fab fa-js"></i>', color: 'yellow', label: 'JavaScript' },
      { icon: '<i class="fab fa-css3-alt"></i>', color: 'blue', label: 'CSS' },
      { icon: '<i class="fab fa-html5"></i>', color: 'orange', label: 'HTML' },
      { icon: '<i class="fab fa-discord"></i>', color: 'purple', label: 'Discord Bots' }
    ];
    const gradMap = {
      blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
      purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
      orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
      green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
      yellow: 'linear-gradient(hsl(55, 90%, 50%), hsl(45, 90%, 50%))'
    };
    function getBgStyle(color) {
      return gradMap[color] ? `background: ${gradMap[color]};` : `background: ${color};`;
    }
    iconItems.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'icon-btn';
      btn.setAttribute('aria-label', item.label);
      btn.innerHTML = `
        <span class="icon-btn__back" style="${getBgStyle(item.color)}"></span>
        <span class="icon-btn__front">
          <span class="icon-btn__icon" aria-hidden="true">${item.icon}</span>
        </span>
        <span class="icon-btn__label">${item.label}</span>
      `;
      container.appendChild(btn);
    });
  }
})();

// CUSTOM CURSOR – INSTANT (no throttling)
(function() {
  const cursor = document.getElementById('customCursor');
  let active = false;
  function show() {
    if (active) return;
    active = true;
    cursor.style.display = 'block';
    document.body.classList.add('custom-cursor-active');
  }
  function move(x, y) {
    if (!active) return;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }
  let detected = false;
  window.addEventListener('mousemove', (e) => {
    if (!detected) { detected = true; show(); }
    move(e.clientX, e.clientY);
  });
  document.body.addEventListener('mouseenter', () => { if (detected) show(); });
  document.body.addEventListener('mouseleave', () => { if (active) cursor.style.opacity = '0'; });
  document.body.addEventListener('mouseenter', () => { if (active) cursor.style.opacity = '1'; });
})();

// SPARKLE TRAIL – VERY LIGHT (max 3 particles, 100ms delay)
(function() {
  const canvas = document.getElementById('sparkle-canvas');
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth, height = window.innerHeight;
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  let particles = [];
  const MAX = 3;
  const darkColor = 'rgba(255,255,255,0.4)';
  const lightColor = 'rgba(217,79,143,0.4)';
  function getColor() {
    return document.body.classList.contains('light') ? lightColor : darkColor;
  }
  function addSparkle(x, y) {
    if (particles.length > MAX) return;
    particles.push({
      x, y,
      size: Math.random() * 2 + 1.5,
      color: getColor(),
      life: 1,
      decay: 0.07,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    });
  }
  function update() {
    for (let i = particles.length-1; i >= 0; i--) {
      const p = particles[i];
      p.life -= p.decay;
      p.x += p.vx;
      p.y += p.vy;
      if (p.life <= 0) particles.splice(i,1);
    }
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      ctx.globalAlpha = p.life * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
  }
  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }
  animate();

  let last = 0;
  const DELAY = 100;
  function onMove(x, y, now) {
    if (now - last > DELAY) {
      addSparkle(x, y);
      last = now;
    }
  }
  let pending = false, px = null, py = null, pt = null;
  function handle(clientX, clientY, time) {
    if (pending) { px = clientX; py = clientY; pt = time; return; }
    pending = true;
    requestAnimationFrame(() => {
      onMove(px !== null ? px : clientX, py !== null ? py : clientY, pt !== null ? pt : time);
      px = py = pt = null;
      pending = false;
    });
  }
  window.addEventListener('mousemove', (e) => handle(e.clientX, e.clientY, performance.now()));
  window.addEventListener('touchmove', (e) => { e.preventDefault(); if (e.touches.length) handle(e.touches[0].clientX, e.touches[0].clientY, performance.now()); }, { passive: false });
  window.addEventListener('touchstart', (e) => { if (e.touches.length) handle(e.touches[0].clientX, e.touches[0].clientY, performance.now()); });
})();

// BORDER ROTATION – DIRECT UPDATE (no RAF, no throttling)
(function() {
  const card = document.getElementById('card');
  if (!card) return;
  const handleMouseMove = (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let angleDeg = angleRad * 180 / Math.PI;
    angleDeg = (angleDeg + 360) % 360;
    card.style.setProperty('--border-angle', `${angleDeg}deg`);
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${xPercent}%`);
    card.style.setProperty('--mouse-y', `${yPercent}%`);
  };
  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--border-angle');
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  });
})();
