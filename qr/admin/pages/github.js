/*
===========================================
SilverQR
GitHub Setting Page
===========================================
*/

function githubPage() {

    page.innerHTML = `

        <h2>GitHub Configuration</h2>

        <hr><br>

        <label>Personal Access Token</label>

        <input
            id="githubPAT"
            type="password"
            class="input"
        >

        <br><br>

        <label>Repository</label>

        <input
            id="githubRepo"
            class="input"
            placeholder="username/repository"
        >

        <br><br>

        <label>Branch</label>

        <input
            id="githubBranch"
            class="input"
            value="main"
        >

        <br><br>

        <button id="btnTest">

            Test Connection

        </button>

        <button id="btnSave">

            Save

        </button>

        <br><br>

        <div id="githubStatus"></div>

    `;

    document.getElementById("githubPAT").value =
        Storage.load("githubPAT","");

    document.getElementById("githubRepo").value =
        Storage.load("githubRepo","");

    document.getElementById("githubBranch").value =
        Storage.load("githubBranch","main");

    document.getElementById("btnSave").onclick = saveGithub;

    document.getElementById("btnTest").onclick = testGithub;

}
