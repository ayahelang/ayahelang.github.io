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

  let aggressiveIdle = false; // false = 15–30s random, true = 5s
  const AGGRESSIVE_IDLE_MS = 5000;

  function randomIdleMs() {
    return 15000 + Math.floor(Math.random() * 15001); // 15–30s
  }

  function currentIdleMs() {
    return aggressiveIdle ? AGGRESSIVE_IDLE_MS : randomIdleMs();
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!autoActive) startShowcase();
    }, currentIdleMs());
  }

  // Floating toggle for aggressive auto-scroll
  const autoToggle = document.getElementById('autoScrollToggle');
  function updateAutoToggleUI() {
    if (!autoToggle) return;
    autoToggle.classList.toggle('active', aggressiveIdle);
    autoToggle.setAttribute('aria-pressed', aggressiveIdle ? 'true' : 'false');
    autoToggle.title = aggressiveIdle
      ? 'Auto-scroll agresif ON (idle 5 dtk) — klik untuk matikan'
      : 'Auto-scroll normal (idle 15–30 dtk) — klik untuk mode agresif 5 dtk';
    const label = autoToggle.querySelector('.ast-label');
    if (label) label.textContent = aggressiveIdle ? 'Auto 5s ON' : 'Auto scroll';
  }
  if (autoToggle) {
    autoToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      aggressiveIdle = !aggressiveIdle;
      updateAutoToggleUI();
      stopShowcase();
      resetIdle();
    });
    updateAutoToggleUI();
  }

  // User interaction stops & resets idle
  const interactionEvents = ['click', 'touchstart', 'wheel', 'keydown', 'touchmove', 'mousemove'];
  interactionEvents.forEach(evt => {
    window.addEventListener(evt, (e) => {
      // Ignore clicks on the toggle itself (handled above)
      if (e.target && e.target.closest && e.target.closest('#autoScrollToggle')) return;
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

    // Cloudflare public speedtest endpoints (CORS-enabled, free)
    const CF_DOWN = "https://speed.cloudflare.com/__down?bytes=";
    const CF_UP = "https://speed.cloudflare.com/__up";
    const PING_URL = "https://speed.cloudflare.com/__down?bytes=0";
    const DL_SIZES = [2000000, 5000000, 10000000];
    const UL_SIZES = [1000000, 3000000, 5000000];

    function setProgress(pct, text) {
      barFill.style.width = pct + "%";
      progressText.textContent = text;
    }

    function setNeedle(mbps) {
      const needleG = document.getElementById("stNeedleG");
      const arc = document.getElementById("stArc");
      const clamped = Math.max(0, Math.min(200, Number(mbps) || 0));
      const deg = -90 + (clamped / 200) * 180;
      if (needleG) {
        needleG.setAttribute("transform", "translate(100,100) rotate(" + deg + ")");
      }
      if (arc) {
        const pct = (clamped / 200) * 100;
        arc.setAttribute("stroke-dasharray", pct + " 100");
      }
    }

    const stFloat = document.getElementById("stFloat");
    const stToggle = document.getElementById("stFloatToggle");
    const stClose = document.getElementById("stFloatClose");
    let collapseTimer = null;

    function openSt() {
      if (!stFloat) return;
      stFloat.classList.add("open");
      clearTimeout(collapseTimer);
    }
    function closeSt() {
      if (!stFloat) return;
      stFloat.classList.remove("open");
      clearTimeout(collapseTimer);
    }
    function scheduleCollapse() {
      clearTimeout(collapseTimer);
      collapseTimer = setTimeout(closeSt, 15000);
    }

    if (stToggle) stToggle.addEventListener("click", (e) => { e.stopPropagation(); openSt(); });
    if (stClose) stClose.addEventListener("click", (e) => { e.stopPropagation(); closeSt(); });
    const panel = document.getElementById("stFloatPanel");
    if (panel) {
      panel.addEventListener("mousemove", () => clearTimeout(collapseTimer));
      panel.addEventListener("touchstart", () => clearTimeout(collapseTimer), { passive: true });
    }

    function xhrGet(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
          else reject(new Error("HTTP " + xhr.status));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send();
      });
    }

    function xhrPost(url, body, onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        if (onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(e.loaded, e.total);
          };
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("HTTP " + xhr.status));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(body);
      });
    }

    async function measurePing() {
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now();
        try {
          await xhrGet(PING_URL + "&tid=" + Math.random());
          samples.push(performance.now() - t0);
        } catch {
          samples.push(999);
        }
      }
      samples.sort((a, b) => a - b);
      return Math.round(samples[Math.floor(samples.length / 2)]);
    }

    async function measureDownload() {
      let best = 0;
      for (let i = 0; i < DL_SIZES.length; i++) {
        const size = DL_SIZES[i];
        const t0 = performance.now();
        try {
          const buf = await xhrGet(CF_DOWN + size + "&tid=" + Math.random());
          const ms = performance.now() - t0;
          const bytes = buf.byteLength || size;
          const mbps = (bytes * 8 / (ms / 1000)) / 1e6;
          if (mbps > best) best = mbps;
          setProgress(15 + (i + 1) * 18, "Download… " + mbps.toFixed(1) + " Mbps");
          elVal.textContent = mbps.toFixed(1);
          setNeedle(mbps);
        } catch (e) {
          console.warn("DL fail", e);
        }
      }
      return best;
    }

    async function measureUpload() {
      // XHR required for reliable upload + live progress (fetch is unreliable here)
      let best = 0;
      for (let i = 0; i < UL_SIZES.length; i++) {
        const size = UL_SIZES[i];
        const payload = new Uint8Array(size);
        for (let j = 0; j < size; j += 4096) {
          payload[j] = (Math.random() * 256) | 0;
        }
        const t0 = performance.now();
        try {
          await xhrPost(CF_UP + "?tid=" + Math.random(), payload, (loaded) => {
            const elapsed = (performance.now() - t0) / 1000;
            if (elapsed > 0.05) {
              const live = (loaded * 8 / elapsed) / 1e6;
              elVal.textContent = live.toFixed(1);
              setNeedle(live);
              setProgress(70 + (i + 1) * 8, "Upload… " + live.toFixed(1) + " Mbps");
            }
          });
          const ms = performance.now() - t0;
          const mbps = (size * 8 / (ms / 1000)) / 1e6;
          if (mbps > best) best = mbps;
          setProgress(70 + (i + 1) * 8, "Upload… " + mbps.toFixed(1) + " Mbps");
          elVal.textContent = mbps.toFixed(1);
          setNeedle(mbps);
        } catch (e) {
          console.warn("UL fail", e);
        }
      }
      return best;
    }

    btn.addEventListener("click", async () => {
      btn.disabled = true;
      progress.hidden = false;
      openSt();
      clearTimeout(collapseTimer);
      elVal.textContent = "…";
      setNeedle(0);
      elLabel.textContent = "Mengukur…";
      elDown.textContent = "— Mbps";
      elUp.textContent = "— Mbps";
      elPing.textContent = "— ms";
      setProgress(5, "Mengukur ping…");

      try {
        const ping = await measurePing();
        elPing.textContent = ping + " ms";
        setProgress(12, "Ping: " + ping + " ms");

        elLabel.textContent = "Download";
        const down = await measureDownload();
        elDown.textContent = down.toFixed(1) + " Mbps";
        elVal.textContent = down.toFixed(1);
        if (elUnit) elUnit.textContent = "Mbps";
        setProgress(68, "Mengukur upload…");

        elLabel.textContent = "Upload";
        const up = await measureUpload();
        elUp.textContent = (up > 0 ? up.toFixed(1) : "N/A") + " Mbps";
        if (up > 0) elVal.textContent = up.toFixed(1);

        setProgress(100, "Selesai!");
        elLabel.textContent = "Selesai";
        elVal.textContent = down.toFixed(1);
        setNeedle(down);
        scheduleCollapse();
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
    const KEY = "sh_stats_v2";
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
    function yearKey() {
      return String(new Date().getFullYear());
    }

    let stats;
    try { stats = JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch { stats = {}; }

    const t = today(), w = weekKey(), m = monthKey(), y = yearKey();
    if (stats.dayKey !== t) { stats.day = 0; stats.dayKey = t; }
    if (stats.weekKey !== w) { stats.week = 0; stats.weekKey = w; }
    if (stats.monthKey !== m) { stats.month = 0; stats.monthKey = m; }
    if (stats.yearKey !== y) { stats.year = 0; stats.yearKey = y; }

    // Migrate v1
    try {
      const old = JSON.parse(localStorage.getItem("sh_stats_v1") || "null");
      if (old && !stats.total) {
        stats.day = Math.max(stats.day || 0, old.day || 0);
        stats.week = Math.max(stats.week || 0, old.week || 0);
        stats.month = Math.max(stats.month || 0, old.month || 0);
        stats.year = Math.max(stats.year || 0, old.year || 0, old.month || 0, old.week || 0, old.day || 0);
        stats.total = Math.max(stats.total || 0, stats.year);
      }
    } catch {}

    stats.total = stats.total || 0;
    stats.year = Math.max(stats.year || 0, stats.month || 0, stats.week || 0, stats.day || 0);
    stats.total = Math.max(stats.total, stats.year);

    const visitKey = "visited_" + t;
    if (!sessionStorage.getItem(visitKey)) {
      stats.day = (stats.day || 0) + 1;
      stats.week = (stats.week || 0) + 1;
      stats.month = (stats.month || 0) + 1;
      stats.year = (stats.year || 0) + 1;
      stats.total = (stats.total || 0) + 1;
      stats.year = Math.max(stats.year, stats.month);
      stats.total = Math.max(stats.total, stats.year);
      sessionStorage.setItem(visitKey, "1");
      localStorage.setItem(KEY, JSON.stringify(stats));
    } else {
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
      const map = {
        fsDay: stats.day || 0,
        fsWeek: stats.week || 0,
        fsMonth: stats.month || 0,
        fsYear: stats.year || 0,
        fsTotal: stats.total || 0
      };
      Object.keys(map).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = map[id];
      });
    }

    renderStats();
    heartbeat();
    setInterval(heartbeat, 15000);
  })();

})();
