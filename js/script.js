
const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".content-section");
const title = document.getElementById("sectionTitle");

menuLinks.forEach(link => {
    link.addEventListener("click", () => {

        menuLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const target = link.dataset.target; // 🔥 INI YANG KURANG

        const current = document.querySelector(".content-section.active");
        const next = document.getElementById(target);

        if (!next || current === next) return;

        // animasi keluar
        current.style.opacity = "0";
        current.style.transform = "translateY(20px)";

        setTimeout(() => {
            current.classList.remove("active");

            next.classList.add("active");

            // reset awal
            next.style.opacity = "0";
            next.style.transform = "translateY(20px)";

            setTimeout(() => {
                next.style.opacity = "1";
                next.style.transform = "translateY(0)";
            }, 50);

        }, 200);

        title.textContent = link.textContent;

        if (target === "about") {
            setTimeout(() => {
                animateSkills();
            }, 300);
        }

        // scroll atas
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
});

// Typing animation
const text = "Miscellaneous Skills";
let index = 0;
function typeEffect() {
    if (index < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(index); index++;
        setTimeout(typeEffect, 100);
    }
} typeEffect(); // Counter animation let years=0; let targetYears=24; const
counter = document.getElementById("yearCounter"); let counterInterval = setInterval(() => {
    years++;
    counter.textContent = years;
    if (years >= targetYears) clearInterval(counterInterval);
}, 80);

// Skill animation
function animateSkills() {
    document.querySelectorAll("#about .bar div").forEach((bar, i) => {
        bar.style.width = "0";

        setTimeout(() => {
            bar.style.width = bar.dataset.width;
        }, 200 + (i * 200)); // delay berurutan
    });
}

// Expandable timeline
document.querySelectorAll(".expand-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const content = btn.nextElementSibling;
        content.style.display = content.style.display === "block" ? "none" : "block";
    });
});

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
});

const burger = document.getElementById("burger");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
        console.log("MENU OPEN → WAITING IDLE");
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            console.log("START SHOWCASE");
            startShowcase();
        }, 3000);
    } else {
        stopShowcase();
    }
});

// klik luar nutup
overlay.addEventListener("click", () => {
    burger.classList.remove("active");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", () => {
        burger.classList.remove("active");
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
});

window.scrollTo({
    top: 0,
    behavior: "smooth"
});

// Disable klik kanan
document.addEventListener("contextmenu", e => e.preventDefault());

// Disable shortcut inspect
document.addEventListener("keydown", function (e) {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
    }
});

setInterval(() => {
    if (window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160) {
        document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:20%'>Access Denied</h1>";
    }
}, 1000);

// ===== AUTO SHOWCASE MODE =====
let autoScrollInterval;
let idleTimer;
let autoActive = false;
let direction = 1;
let currentCardIndex = 0;
let sectionIndex = 0;

const sectionsList = ["main-webs", "webtools", "formal", "casual"];

// cek apakah burger menu aktif
function isBurgerMode() {
    return window.innerWidth <= 768 || document.querySelector(".burger").offsetParent !== null;
}

// ===== START MODE =====
function startShowcase() {
    if (!isBurgerMode() || autoActive) return; // 🔥 penting

    autoActive = true;

    autoScrollInterval = setInterval(() => {
        if (!autoActive || !isBurgerMode()) return;

        let activeSection = document.querySelector(".content-section.active");
        if (!activeSection) return;

        let cards = activeSection.querySelectorAll(".card");
        if (cards.length === 0) return;

        let card = cards[currentCardIndex];

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        highlightCard(card);

        currentCardIndex++;

        if (currentCardIndex >= cards.length) {
            currentCardIndex = 0;
            nextSection();
        }

    }, 2500);
}

// ===== STOP =====
function stopShowcase() {
    if (!autoActive) return;
    autoActive = false;
    clearInterval(autoScrollInterval);
    removeAllHighlight();
}

// ===== IDLE TIMER =====
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (isBurgerMode() && !autoActive) {
            startShowcase();
        }
    }, 3000);
}

// ===== HIGHLIGHT EFFECT =====
function highlightCard(card) {
    removeAllHighlight();

    card.style.transform = "scale(1.05)";
    card.style.boxShadow = "0 0 30px rgba(0,245,255,0.9)";
    card.style.transition = "0.4s";
}

function removeAllHighlight() {
    document.querySelectorAll(".card").forEach(c => {
        c.style.transform = "";
        c.style.boxShadow = "";
    });
}

// ===== PINDAH SECTION =====
function nextSection() {
    sectionIndex++;
    if (sectionIndex >= sectionsList.length) sectionIndex = 0;

    let targetId = sectionsList[sectionIndex];

    document.querySelectorAll(".menu-link").forEach(link => {
        link.classList.remove("active");

        if (link.dataset.target === targetId) {
            link.classList.add("active");
        }
    });

    let current = document.querySelector(".content-section.active");
    let next = document.getElementById(targetId);

    if (!next || current === next) return;

    current.classList.remove("active");
    next.classList.add("active");

    // reset scroll
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ===== DETEKSI INTERAKSI USER =====
["click", "touchstart", "wheel", "keydown"].forEach(evt => {
    window.addEventListener(evt, (e) => {

        if (
            e.target.closest(".sidebar") ||
            e.target.closest("#burger")
        ) return;

        stopShowcase();
        resetIdleTimer();
    });
});

// tambahan swipe HP
window.addEventListener("touchmove", () => {
    stopShowcase();
    resetIdleTimer();
});

// ===== DETEKSI MENU DIBUKA =====
const observer = new MutationObserver(() => {
    if (isBurgerMode()) {
        resetIdleTimer();
    } else {
        stopShowcase();
    }
});

observer.observe(sidebar, { attributes: true, attributeFilter: ["class"] });

// start awal
resetIdleTimer();