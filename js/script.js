/* =========================================================
   Silverhawk Network Portal — Core Script (cleaned & optimized)
   Efficient, no garbage, fast load/run
========================================================= */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const menuLinks = document.querySelectorAll('.menu-link');
  const titleEl = document.getElementById('sectionTitle');
  const burger = document.getElementById('burger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('themeToggle');

  // ---------- Section navigation ----------
  function switchSection(targetId, updateTitle = true) {
    const current = document.querySelector('.content-section.active');
    const next = document.getElementById(targetId);
    if (!next || current === next) return;

    // Exit animation
    current.style.opacity = '0';
    current.style.transform = 'translateY(20px)';

    setTimeout(() => {
      current.classList.remove('active');
      next.classList.add('active');

      next.style.opacity = '0';
      next.style.transform = 'translateY(20px)';

      requestAnimationFrame(() => {
        next.style.opacity = '1';
        next.style.transform = 'translateY(0)';
      });

      if (targetId === 'about') {
        setTimeout(animateSkills, 280);
      }
    }, 180);

    if (updateTitle) {
      const link = document.querySelector(`.menu-link[data-target="${targetId}"]`);
      if (link && titleEl) titleEl.textContent = link.textContent;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      switchSection(link.dataset.target);
      closeMobileMenu();
    });
  });

  // ---------- Typing effect ----------
  const typingEl = document.getElementById('typing');
  if (typingEl) {
    const text = 'Miscellaneous Skills';
    let i = 0;
    function type() {
      if (i < text.length) {
        typingEl.textContent += text.charAt(i++);
        setTimeout(type, 90);
      }
    }
    type();
  }

  // ---------- Year counter ----------
  const counterEl = document.getElementById('yearCounter');
  if (counterEl) {
    let years = 0;
    const target = 24;
    const timer = setInterval(() => {
      years++;
      counterEl.textContent = years;
      if (years >= target) clearInterval(timer);
    }, 70);
  }

  // ---------- Skills animation ----------
  function animateSkills() {
    document.querySelectorAll('#about .bar div').forEach((bar, idx) => {
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = bar.dataset.width || '0%';
      }, 150 + idx * 160);
    });
  }

  // ---------- Timeline expand ----------
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  // ---------- Theme toggle ----------
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
    });
  }

  // ---------- Mobile menu ----------
  function closeMobileMenu() {
    if (burger) burger.classList.remove('active');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  if (burger && sidebar && overlay) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMobileMenu);
  }

  // ---------- NEW AUTO-SCROLL / SHOWCASE ----------
  // Navigates all sections + cards with random faster speeds
  // (still comfortable for the eye: 550ms – 1600ms)

  const ALL_SECTIONS = ['main-webs', 'webtools', 'formal', 'casual', 'ondev', 'about'];
  let autoActive = false;
  let autoTimer = null;
  let idleTimer = null;
  let sectionIdx = 0;
  let cardIdx = 0;

  function randomDelay() {
    // Faster + random: mostly 700-1400, occasional burst 550-900
    const burst = Math.random() < 0.28;
    return burst
      ? 550 + Math.random() * 350
      : 750 + Math.random() * 850;
  }

  function highlightCard(card) {
    removeHighlights();
    card.style.transform = 'scale(1.04)';
    card.style.boxShadow = '0 0 28px rgba(0, 245, 255, 0.85)';
    card.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease';
  }

  function removeHighlights() {
    document.querySelectorAll('.card').forEach(c => {
      c.style.transform = '';
      c.style.boxShadow = '';
    });
  }

  function goToSection(id) {
    menuLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.target === id);
    });
    switchSection(id, true);
  }

  function nextShowcaseStep() {
    if (!autoActive) return;

    const sectionId = ALL_SECTIONS[sectionIdx];
    const section = document.getElementById(sectionId);
    if (!section) {
      sectionIdx = (sectionIdx + 1) % ALL_SECTIONS.length;
      scheduleNext();
      return;
    }

    // Ensure correct section is active
    if (!section.classList.contains('active')) {
      goToSection(sectionId);
      cardIdx = 0;
      scheduleNext();
      return;
    }

    const cards = section.querySelectorAll('.card');
    if (cards.length === 0) {
      // No cards → just pause a bit then move to next section
      sectionIdx = (sectionIdx + 1) % ALL_SECTIONS.length;
      cardIdx = 0;
      scheduleNext();
      return;
    }

    // Highlight current card
    const card = cards[cardIdx];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightCard(card);
    }

    cardIdx++;
    if (cardIdx >= cards.length) {
      cardIdx = 0;
      // Random chance to jump to a random section instead of sequential
      if (Math.random() < 0.35) {
        sectionIdx = Math.floor(Math.random() * ALL_SECTIONS.length);
      } else {
        sectionIdx = (sectionIdx + 1) % ALL_SECTIONS.length;
      }
    }

    scheduleNext();
  }

  function scheduleNext() {
    clearTimeout(autoTimer);
    if (!autoActive) return;
    autoTimer = setTimeout(nextShowcaseStep, randomDelay());
  }

  function startShowcase() {
    if (autoActive) return;
    autoActive = true;
    sectionIdx = 0;
    cardIdx = 0;
    // Start from a random section sometimes
    if (Math.random() < 0.4) {
      sectionIdx = Math.floor(Math.random() * ALL_SECTIONS.length);
    }
    nextShowcaseStep();
  }

  function stopShowcase() {
    if (!autoActive) return;
    autoActive = false;
    clearTimeout(autoTimer);
    removeHighlights();
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!autoActive) startShowcase();
    }, 4500); // 4.5s idle → start
  }

  // User interaction stops & resets idle (no mousemove to avoid over-sensitivity)
  const interactionEvents = ['click', 'touchstart', 'wheel', 'keydown', 'touchmove'];
  interactionEvents.forEach(evt => {
    window.addEventListener(evt, () => {
      stopShowcase();
      resetIdle();
    }, { passive: true });
  });

  // Initial idle start
  resetIdle();

  // Initial scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });
})();
