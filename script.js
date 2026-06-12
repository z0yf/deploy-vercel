(function() {
  // Dynamic Age (DOB 28 Nov 2007)
  function calculateAge() {
    const birth = new Date(2007, 10, 28);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
  function updateAgeUI() {
    const age = calculateAge();
    document.getElementById('ageBadge').innerHTML = `${age} YEARS OLD · CODER`;
    document.getElementById('dynamicAge').textContent = age;
  }
  updateAgeUI();
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
  setTimeout(() => { updateAgeUI(); setInterval(updateAgeUI, 24*60*60*1000); }, msUntilMidnight);
  
  // Skills box toggle
  const toggleBtn = document.getElementById('skillsToggleBtn');
  const skillsBox = document.getElementById('skillsBox');
  let isOpen = false;
  function animateBoxBars() {
    document.querySelectorAll('.skill-bar-fill-box').forEach(bar => {
      const width = bar.getAttribute('data-width');
      if (width && bar.style.width !== width + '%') bar.style.width = width + '%';
    });
  }
  toggleBtn.addEventListener('click', () => {
    if (isOpen) skillsBox.classList.remove('open');
    else { skillsBox.classList.add('open'); setTimeout(animateBoxBars, 120); }
    isOpen = !isOpen;
  });
  
  // Live clock (IST, with seconds)
  function updateClock() {
    const timeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    document.getElementById('liveClock').innerText = timeStr.replace(/\u202f/g, ' ');
  }
  updateClock();
  setInterval(updateClock, 1000);
  
  // Theme switch + 3D flip (120fps optimized)
  const card = document.getElementById('card');
  const themeBtn = document.getElementById('themeBtn');
  const gifBg = document.getElementById('gifBg');
  function setTheme(theme) {
    if (theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    localStorage.setItem('yokai_theme', theme);
  }
  function getTheme() { return document.body.classList.contains('light') ? 'light' : 'dark'; }
  if (localStorage.getItem('yokai_theme') === 'light') setTheme('light');
  
  themeBtn.addEventListener('click', () => {
    if (card.classList.contains('flipping')) return;
    card.classList.add('flipping');
    gifBg.classList.add('active');
    const onEnd = () => {
      card.classList.remove('flipping');
      const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      setTimeout(() => gifBg.classList.remove('active'), 50);
      card.removeEventListener('animationend', onEnd);
    };
    card.addEventListener('animationend', onEnd, { once: true });
  });
  
  // Email copy with toast
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
    setTimeout(() => toast.classList.remove('show'), 1800);
  }
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(email).then(() => showToast('📧 Email copied!')).catch(() => showToast('❌ Failed'));
  });
  
  // Hold to slide (400ms)
  let holdTimeout = null, isHolding = false;
  function startHold() {
    holdTimeout = setTimeout(() => {
      if (!card.classList.contains('flipping')) {
        card.classList.add('card-hold');
        isHolding = true;
      }
    }, 400);
  }
  function cancelHold() {
    if (holdTimeout) clearTimeout(holdTimeout);
    if (isHolding) {
      card.classList.remove('card-hold');
      isHolding = false;
    }
  }
  card.addEventListener('mousedown', startHold);
  window.addEventListener('mouseup', cancelHold);
  card.addEventListener('touchstart', startHold);
  window.addEventListener('touchend', cancelHold);
  window.addEventListener('touchcancel', cancelHold);
  card.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Ripple effect (exactly at tap point)
  function createRipple(event, isTouch = false) {
    if (card.classList.contains('flipping')) return;
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
    const size = 120;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size/2}px`;
    ripple.style.top = `${y - size/2}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }
  card.addEventListener('mousedown', (e) => createRipple(e, false));
  card.addEventListener('touchstart', (e) => createRipple(e, true));
})();
