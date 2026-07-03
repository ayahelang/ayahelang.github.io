const page=document.getElementById("page");

document
.querySelectorAll("button[data-page]")
.forEach(btn=>{

btn.onclick=()=>{

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

dashboard();

function dashboard(){

page.innerHTML=`

<h2>

SilverQR CMS

</h2>

<br>

<h3>

Current Mode

</h3>

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

document
.getElementById("saveMode")
.onclick=()=>{

Storage.save(

"mode",

document
.getElementById("mode")
.value

);

alert("Saved");

};

}
