// MENU SWITCH
const menuLinks=document.querySelectorAll(".menu-link");
const sections=document.querySelectorAll(".content-section");
const title=document.getElementById("sectionTitle");

menuLinks.forEach(link=>{
link.addEventListener("click",()=>{
menuLinks.forEach(l=>l.classList.remove("active"));
link.classList.add("active");
sections.forEach(sec=>sec.classList.remove("active"));
document.getElementById(link.dataset.target).classList.add("active");
title.textContent=link.textContent;
});
});

// SKILL ANIMATION
document.querySelectorAll(".bar div").forEach(bar=>{
setTimeout(()=>{bar.style.width=bar.dataset.width},500);
});

// TYPING EFFECT
const text="Teddy Mulyana";
let i=0;
function typing(){
if(i<text.length){
document.getElementById("typing").innerHTML+=text[i];
i++;setTimeout(typing,80);
}}
typing();

// COUNTER
let years=0,target=24;
const counter=document.getElementById("yearCounter");
let interval=setInterval(()=>{
years++;counter.textContent=years;
if(years>=target)clearInterval(interval);
},60);

// THEME TOGGLE
document.getElementById("themeToggle")
.addEventListener("click",()=>{
document.body.classList.toggle("light");
});
