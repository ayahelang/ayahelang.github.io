const page = document.getElementById("page");

document
.querySelectorAll("button[data-page]")
.forEach(btn => {

    btn.onclick = () => {

        load(btn.dataset.page);

    };

});

function load(name){

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

    }

}

function dashboard(){

    page.innerHTML = `

        <h2>SilverQR CMS</h2>

        <br>

        <h3>Current Mode</h3>

        <select id="mode">

            <option>AUTO</option>

            <option>DRIVER</option>

            <option>TEACHING</option>

            <option>PROMOTION</option>

        </select>

        <br><br>

        <button id="saveMode">

            SAVE

        </button>

    `;

    const mode = Storage.load("mode","AUTO");

    document.getElementById("mode").value = mode;

    document.getElementById("saveMode").onclick = () => {

        Storage.save(

            "mode",

            document.getElementById("mode").value

        );

        alert("Mode berhasil disimpan.");

    };

}

function rules(){

    page.innerHTML="<h2>Rules (Coming Soon)</h2>";

}

function plugins(){

    page.innerHTML="<h2>Plugins (Coming Soon)</h2>";

}

function github(){

    page.innerHTML="<h2>GitHub (Coming Soon)</h2>";

}

function preview(){

    page.innerHTML="<h2>Preview (Coming Soon)</h2>";

}

dashboard();
