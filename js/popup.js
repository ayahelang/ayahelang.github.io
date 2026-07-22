/* =========================================================
   Silverhawk Popup System v1.0
   https://silverhawk.web.id
========================================================= */

const SH_POPUP = {

    title: "📢 Informasi Siswi At-Taqwa",

    message:
        "Silakan melakukan registrasi Google Classroom terlebih dahulu sebelum mengikuti kegiatan pembelajaran.",

    buttonText: "📚 Registrasi Sekarang",

    url: "https://shorturl.at/LVQCg",

    showAfter: 2000,

    duration: 30000,

    footer: "Powered by Silverhawk",

    showCloseButton: true

};

let popupTimer = null;

let progressTimer = null;

function createPopup() {

    if (document.getElementById("sh-popup-overlay")) return;

    const html = `
<div id="sh-popup-overlay">

    <div id="sh-popup">

        <div class="sh-popup-header">

            <h3 class="sh-popup-title">${SH_POPUP.title}</h3>

            ${
                SH_POPUP.showCloseButton
                    ? `<div class="sh-popup-close" id="sh-close">&times;</div>`
                    : ""
            }

        </div>

        <div class="sh-popup-body">

            <div class="sh-popup-message">

                ${SH_POPUP.message}

            </div>

            <a
                href="${SH_POPUP.url}"
                class="sh-popup-button"
                id="sh-button"
                target="_blank">

                ${SH_POPUP.buttonText}

            </a>

        </div>

        <div class="sh-popup-footer">

            ${SH_POPUP.footer}

        </div>

        <div class="sh-popup-progress">

            <div
                class="sh-popup-progress-bar"
                id="sh-progress">

            </div>

        </div>

    </div>

</div>
`;

    document.body.insertAdjacentHTML("beforeend", html);

    const overlay = document.getElementById("sh-popup-overlay");

    const progress = document.getElementById("sh-progress");

    setTimeout(() => {

        overlay.classList.add("show");

    }, 50);

    progress.style.transition = `width ${SH_POPUP.duration}ms linear`;

    progress.style.width = "0%";

    popupTimer = setTimeout(closePopup, SH_POPUP.duration);

    document.getElementById("sh-button").onclick = function () {

        closePopup();

    };

    const closeBtn = document.getElementById("sh-close");

    if (closeBtn) {

        closeBtn.onclick = closePopup;

    }

    overlay.onclick = function (e) {

        if (e.target.id === "sh-popup-overlay") {

            closePopup();

        }

    };

}

function closePopup() {

    clearTimeout(popupTimer);

    clearTimeout(progressTimer);

    const overlay = document.getElementById("sh-popup-overlay");

    if (!overlay) return;

    overlay.classList.remove("show");

    setTimeout(() => {

        overlay.remove();

    }, 400);

}

window.addEventListener("load", () => {

    setTimeout(createPopup, SH_POPUP.showAfter);

});
