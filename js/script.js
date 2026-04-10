
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