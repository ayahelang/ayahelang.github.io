```javascript id="z7w1mq"
/* Silverhawk Universal Lock JS */

(function(){

const allowedHosts = [
  "silverhawk.web.id",
  "www.silverhawk.web.id",
  "localhost",
  "127.0.0.1"
];

/* klik kanan */
document.addEventListener("contextmenu", e=>{
  e.preventDefault();
});

/* shortcut inspect */
document.addEventListener("keydown", e=>{
  const k = e.key.toUpperCase();

  if(
    k === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I","J","C","K"].includes(k)) ||
    (e.ctrlKey && ["U","S","P"].includes(k))
  ){
    e.preventDefault();
    return false;
  }
});

/* drag */
document.addEventListener("dragstart", e=>{
  e.preventDefault();
});

/* select */
document.addEventListener("selectstart", e=>{
  e.preventDefault();
});

/* anti iframe */
if(window.top !== window.self){
  document.body.innerHTML = "Embedding blocked.";
}

/* devtools detect */
setInterval(()=>{
  const w = window.outerWidth - window.innerWidth > 170;
  const h = window.outerHeight - window.innerHeight > 170;

  if(w || h){
    console.clear();
    document.body.innerHTML = `
      <div style="
      padding:40px;
      text-align:center;
      font-family:Arial">
      <h2>Developer Tools Detected</h2>
      <p>Access closed.</p>
      </div>
    `;
  }
},1500);

/* branding console */
console.log("%cSTOP","color:red;font-size:42px;font-weight:bold");
console.log("Protected by Silverhawk Network");

/* ping */
setInterval(()=>{
 localStorage.setItem("silverhawk_lock_ping", Date.now());
},5000);

})();
```
