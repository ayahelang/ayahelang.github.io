document.querySelectorAll(".card button").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const link = btn.closest(".card").getAttribute("href");
        window.open(link, "_blank");
    });
});
