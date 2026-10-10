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

  // ---------- Internet Speed Test ----------
  (function initSpeedTest() {
    const btn = document.getElementById("stStartBtn");
    if (!btn) return;

    const elVal = document.getElementById("stValue");
    const elUnit = document.getElementById("stUnit");
    const elLabel = document.getElementById("stLabel");
    const elDown = document.getElementById("stDown");
    const elUp = document.getElementById("stUp");
    const elPing = document.getElementById("stPing");
    const progress = document.getElementById("stProgress");
    const barFill = document.getElementById("stBarFill");
    const progressText = document.getElementById("stProgressText");

    // Use Cloudflare speed test endpoints / public CDN files for measurement
    const PING_URL = "https://www.cloudflare.com/cdn-cgi/trace";
    // Small + medium payloads from reliable CDNs
    const DL_URLS = [
      "https://speed.cloudflare.com/__down?bytes=1000000",   // ~1 MB
      "https://speed.cloudflare.com/__down?bytes=5000000",   // ~5 MB
      "https://speed.cloudflare.com/__down?bytes=10000000"   // ~10 MB
    ];
    const UL_URL = "https://speed.cloudflare.com/__up";

    function setProgress(pct, text) {
      barFill.style.width = pct + "%";
      progressText.textContent = text;
    }

    async function measurePing() {
      const samples = [];
      for (let i = 0; i < 4; i++) {
        const t0 = performance.now();
        try {
          await fetch(PING_URL + "?_=" + Date.now(), { cache: "no-store", mode: "cors" });
          samples.push(performance.now() - t0);
        } catch {
          samples.push(999);
        }
      }
      samples.sort((a, b) => a - b);
      return Math.round(samples[1] || samples[0]); // median-ish
    }

    async function measureDownload() {
      let bestMbps = 0;
      for (let i = 0; i < DL_URLS.length; i++) {
        const url = DL_URLS[i] + "&_=" + Date.now();
        const t0 = performance.now();
        try {
          const res = await fetch(url, { cache: "no-store", mode: "cors" });
          const buf = await res.arrayBuffer();
          const ms = performance.now() - t0;
          const bits = buf.byteLength * 8;
          const mbps = (bits / (ms / 1000)) / 1e6;
          if (mbps > bestMbps) bestMbps = mbps;
          setProgress(20 + (i + 1) * 20, "Download… " + mbps.toFixed(1) + " Mbps");
          elVal.textContent = mbps.toFixed(1);
        } catch (err) {
          console.warn("DL attempt failed", err);
        }
      }
      return bestMbps;
    }

    async function measureUpload() {
      // Upload ~1MB of random data
      const size = 1 * 1024 * 1024;
      const data = new Uint8Array(size);
      crypto.getRandomValues(data);
      const t0 = performance.now();
      try {
        await fetch(UL_URL, {
          method: "POST",
          body: data,
          cache: "no-store",
          mode: "cors"
        });
        const ms = performance.now() - t0;
        const bits = size * 8;
        return (bits / (ms / 1000)) / 1e6;
      } catch (err) {
        console.warn("Upload failed", err);
        // Fallback estimate based on download (rough)
        return 0;
      }
    }

    btn.addEventListener("click", async () => {
      btn.disabled = true;
      progress.hidden = false;
      elVal.textContent = "…";
      elLabel.textContent = "Mengukur…";
      elDown.textContent = "— Mbps";
      elUp.textContent = "— Mbps";
      elPing.textContent = "— ms";
      setProgress(5, "Mengukur ping…");

      try {
        // 1. Ping
        const ping = await measurePing();
        elPing.textContent = ping + " ms";
        setProgress(15, "Ping: " + ping + " ms");

        // 2. Download
        elLabel.textContent = "Download";
        const down = await measureDownload();
        elDown.textContent = down.toFixed(1) + " Mbps";
        elVal.textContent = down.toFixed(1);
        elUnit.textContent = "Mbps";
        setProgress(80, "Mengukur upload…");

        // 3. Upload
        elLabel.textContent = "Upload";
        const up = await measureUpload();
        elUp.textContent = (up > 0 ? up.toFixed(1) : "N/A") + " Mbps";
        setProgress(100, "Selesai!");

        elLabel.textContent = "Selesai";
        elVal.textContent = down.toFixed(1);
      } catch (err) {
        console.error(err);
        elLabel.textContent = "Gagal";
        elVal.textContent = "—";
        progressText.textContent = "Tes gagal. Coba lagi.";
      }

      btn.disabled = false;
      setTimeout(() => { progress.hidden = true; }, 2500);
    });
  })();


  // ---------- Visitor Stats (floating) ----------
  (function initVisitorStats() {
    const KEY = "sh_stats_v1";
    const ONLINE_KEY = "sh_online";
    const SESSION_ID = sessionStorage.getItem("sh_sid") || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
    sessionStorage.setItem("sh_sid", SESSION_ID);

    function today() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function weekKey() {
      const d = new Date();
      const onejan = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      return d.getFullYear() + "-W" + week;
    }
    function monthKey() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    }

    let stats;
    try { stats = JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch { stats = {}; }

    const t = today(), w = weekKey(), m = monthKey();
    if (stats.dayKey !== t) { stats.day = 0; stats.dayKey = t; }
    if (stats.weekKey !== w) { stats.week = 0; stats.weekKey = w; }
    if (stats.monthKey !== m) { stats.month = 0; stats.monthKey = m; }

    const visitKey = "visited_" + t;
    if (!sessionStorage.getItem(visitKey)) {
      stats.day = (stats.day || 0) + 1;
      stats.week = (stats.week || 0) + 1;
      stats.month = (stats.month || 0) + 1;
      sessionStorage.setItem(visitKey, "1");
      localStorage.setItem(KEY, JSON.stringify(stats));
    }

    function heartbeat() {
      let online = {};
      try { online = JSON.parse(localStorage.getItem(ONLINE_KEY) || "{}"); } catch {}
      const now = Date.now();
      Object.keys(online).forEach(id => {
        if (now - online[id] > 45000) delete online[id];
      });
      online[SESSION_ID] = now;
      localStorage.setItem(ONLINE_KEY, JSON.stringify(online));
      const el = document.getElementById("fsOnline");
      if (el) el.textContent = Object.keys(online).length;
    }

    function renderStats() {
      const d = document.getElementById("fsDay");
      const wEl = document.getElementById("fsWeek");
      const mEl = document.getElementById("fsMonth");
      if (d) d.textContent = stats.day || 0;
      if (wEl) wEl.textContent = stats.week || 0;
      if (mEl) mEl.textContent = stats.month || 0;
    }

    renderStats();
    heartbeat();
    setInterval(heartbeat, 15000);
  })();

})();
