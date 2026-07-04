/*
=========================================================
SilverQR CMS
admin/admin.js
Version : 0.1
=========================================================
*/

const page = document.getElementById("page");

/* ===========================
   MENU
=========================== */

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        loadPage(button.dataset.page);

    });

});


/* ===========================
   ROUTER
=========================== */

function loadPage(name){

    switch(name){

        case "dashboard":
            dashboard();
            break;

        case "rules":
            rules();
            break;

        case "plugins":
            plugins();
            break;

        case "github":
            github();
            break;

        case "preview":
            preview();
            break;

        default:
            dashboard();

    }

}


/* ===========================
   DASHBOARD
=========================== */

function dashboard(){

    const mode = Storage.load("mode","AUTO");

    page.innerHTML = `

        <h2>Dashboard</h2>

        <hr><br>

        <h3>Current Mode</h3>

        <select id="mode">

            <option value="AUTO">AUTO</option>

            <option value="DRIVER">DRIVER</option>

            <option value="TEACHING">TEACHING</option>

            <option value="PROMOTION">PROMOTION</option>

        </select>

        <br><br>

        <button id="saveMode">
            Simpan
        </button>

        <br><br>

        <div id="info"></div>

    `;

    document.getElementById("mode").value = mode;

    document.getElementById("saveMode").onclick = () => {

        Storage.save(
            "mode",
            document.getElementById("mode").value
        );

        document.getElementById("info").innerHTML =
        "<b style='color:green'>Mode berhasil disimpan.</b>";

    };

}


/* ===========================
   RULES
=========================== */

function rules(){

    page.innerHTML = `

        <h2>Rules</h2>

        <hr><br>

        <p>Fitur masih dalam proses pembuatan.</p>

    `;

}


/* ===========================
   PLUGINS
=========================== */

function plugins(){

    page.innerHTML = `

        <h2>Plugins</h2>

        <hr><br>

        <p>Daftar plugin akan muncul di sini.</p>

    `;

}


/* ===========================
   GITHUB
=========================== */

function github(){

    page.innerHTML = `

        <h2>GitHub Setting</h2>

        <hr><br>

        <label>Personal Access Token</label>

        <br>

        <input
            id="pat"
            type="password"
            style="width:100%;padding:10px;"
        >

        <br><br>

        <label>Repository</label>

        <br>

        <input
            id="repo"
            style="width:100%;padding:10px;"
            placeholder="username/repository"
        >

        <br><br>

        <button id="saveGithub">

            Simpan

        </button>

    `;

    document.getElementById("pat").value =
        Storage.load("githubPAT","");

    document.getElementById("repo").value =
        Storage.load("githubRepo","");

    document.getElementById("saveGithub").onclick = ()=>{

        Storage.save(
            "githubPAT",
            document.getElementById("pat").value
        );

        Storage.save(
            "githubRepo",
            document.getElementById("repo").value
        );

        alert("GitHub berhasil disimpan.");

    };

}


/* ===========================
   PREVIEW
=========================== */

function preview(){

    page.innerHTML = `

        <h2>Preview</h2>

        <hr><br>

        <p>Live Preview akan dibuat pada versi berikutnya.</p>

    `;

}


/* ===========================
   START
=========================== */

dashboard();
