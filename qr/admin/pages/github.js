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

async function testGithub(){

    const token =
        document.getElementById("githubPAT").value;

    const repo =
        document.getElementById("githubRepo").value;

    const branch =
        document.getElementById("githubBranch").value;

    GitHub.saveSetting(
        token,
        repo,
        branch
    );

    const status =
        document.getElementById("githubStatus");

    status.innerHTML = "Testing...";

    try{

        const settings =
            await GitHub.readJSON(
                "qr/config/settings.json"
            );

        status.innerHTML = `

        <div style="color:green">

        ✅ Connected

        <br><br>

        Project :

        ${settings.project}

        <br>

        Version :

        ${settings.version}

        </div>

        `;

    }
    catch(e){

        status.innerHTML = `

        <div style="color:red">

        ❌ ${e}

        </div>

        `;

    }

}

function saveGithub(){

    GitHub.saveSetting(

        document.getElementById("githubPAT").value,

        document.getElementById("githubRepo").value,

        document.getElementById("githubBranch").value

    );

    alert("GitHub Setting Saved");

}

