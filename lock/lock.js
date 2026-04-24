function() {

    const __shlk9x_links = [
        "https://www.tiktok.com/@enb.electronicsntools",
        "https://www.tiktok.com/@belajarsmm",
        "https://www.youtube.com/@amateursreleased",
        "https://www.instagram.com/jameswhat.sgbva",
        "https://www.instagram.com/teddyskom63",
        "https://www.facebook.com/teddymulyana.sgbva/"
    ];

    let __shlk9x_lastOpen = 0;
    let __shlk9x_tryCount = 0;

    function __shlk9x_pick() {
        return __shlk9x_links[
            Math.floor(Math.random() * __shlk9x_links.length)
        ];
    }

    function __shlk9x_toast(msg) {

        let el = document.getElementById("__shlk9x_toast");

        if (!el) {
            el = document.createElement("div");
            el.id = "__shlk9x_toast";

            el.style.cssText = `
position: fixed;
left: 50 %;
bottom: 18px;
transform: translateX(-50 %);
background:#111;
color: #fff;
padding: 10px 16px;
border - radius: 12px;
z - index: 999999;
font - family: Arial;
font - size: 14px;
box - shadow: 0 10px 25px rgba(0, 0, 0, .25)
    `;

            document.body.appendChild(el);
        }

        el.textContent = msg;
        el.style.display = "block";

        clearTimeout(el.__hideTimer);

        el.__hideTimer = setTimeout(() => {
            el.style.display = "none";
        }, 2200);
    }

    function __shlk9x_trigger(src) {

        __shlk9x_tryCount++;

        __shlk9x_toast("Konten dilindungi 😊");

        const now = Date.now();

        if (now - __shlk9x_lastOpen > 15000) {
            __shlk9x_lastOpen = now;
            window.open(__shlk9x_pick(), "_blank", "noopener");
        }

        console.log("LOCK:", src);
    }

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        __shlk9x_trigger("rightclick");
    });

    document.addEventListener("keydown", function (e) {

        const k = e.key.toUpperCase();

        if (
            k === "F12" ||
            (e.ctrlKey && e.shiftKey &&
                ["I", "J", "C", "K"].includes(k)) ||
            (e.ctrlKey &&
                ["U", "S"].includes(k))
        ) {
            e.preventDefault();
            __shlk9x_trigger("shortcut");
        }

    });

    document.addEventListener(
        "dragstart",
        e => e.preventDefault()
    );

    document.addEventListener(
        "selectstart",
        e => e.preventDefault()
    );

    function __shlk9x_makeBtn() {

        const a = document.createElement("a");

        a.href = __shlk9x_pick();
        a.target = "_blank";
        a.className = "__shlk9x_follow_btn";
        a.innerHTML = "📣 Follow Us";

        document.body.appendChild(a);
    }

    window.addEventListener(
        "load",
        __shlk9x_makeBtn
    );

}) ();
