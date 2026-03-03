
const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".content-section");
const title = document.getElementById("sectionTitle");

menuLinks.forEach(link => {
    link.addEventListener("click", () => {

        menuLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        sections.forEach(sec => sec.classList.remove("active"));

        const target = link.dataset.target;
        document.getElementById(target).classList.add("active");

        title.textContent = link.textContent;
    });
});


// Skill animation
document.querySelectorAll(".bar div").forEach(bar => {
    setTimeout(() => {
        bar.style.width = bar.dataset.width;
    }, 500);
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
document.querySelectorAll(".bar div").forEach(bar => {
    setTimeout(() => {
        bar.style.width = bar.dataset.width;
    }, 500);
});

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

