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
