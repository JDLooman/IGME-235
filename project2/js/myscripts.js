
let diplayterm = "";

let pictureFront;
let pictureBack;
let type;
let type1;
let type2;
let weakness;
let strength;
let damage = "";
let pokeName;

let picActive = false;
let weakActive = false;
let strenActive = false;
let typeActive = false;

const prefix = "jdl9046";
const nameKey = prefix + "name";
const picKey = prefix + "pic";

const storedName = localStorage.getItem(nameKey);
const storedPic = localStorage.getItem(picKey);

window.onload = (e) => {
    const searchField = document.querySelector(".searchBar");
    const pic = document.querySelector(".data");

    if(storedName){
        searchField.value = storedName;
        searchButtonClicked;
    }
    else{
        searchField.value = "";
    }

    if(storedPic){
        pic.value = storedPic;
        pokePictureFront;
    }
    else{
        pic.value = "";
    }

    searchField.onchange = e =>{localStorage.setItem(nameKey, e.target.value);};
    pic.onchange = e =>{localStorage.setItem(picKey, e.target.value);};

    document.querySelector(".searchManu").onclick = searchButtonClicked;
    document.querySelector(".searchRand").onclick = randomSearch;
    document.querySelector(".buttonBot").onclick = pokeType;
    document.querySelector(".buttonLeft").onclick = pokeWeak;
    document.querySelector(".buttonRight").onclick = pokeStrong;
    document.querySelector(".buttonTop").onclick = pokePictureFront;
    document.querySelector(".padRight").onclick = pokePictureFront;
    document.querySelector(".padLeft").onclick = pokePictureBack;
};



function searchButtonClicked(){
    const GIPHY_URL = "https://pokeapi.co/api/v2/pokemon-form/";

    let url = GIPHY_URL;

    let term = document.querySelector(".searchBar").value;
    displayTerm = term;

    term = term.trim();

    term = term.toLowerCase();

    term = encodeURIComponent(term);

    if(term.length < 1) return;

    url += term;

    console.log(url);

    getData(url);
}

function randomSearch(){
    const GIPHY_URL = "https://pokeapi.co/api/v2/pokemon-form/";

    let url = GIPHY_URL;

    let term = getRandomInt(894);

    url += term;

    console.log(url);

    getData(url);
}

function pokeWeak(){
    let url = damage;

    pokeWeakness(url);
}

function pokeStrong(){
    let url = damage;
    
    pokeStrength(url);
}

function pokeType(){
    document.querySelector(".data").innerHTML = pokeName.toUpperCase() + " is a(n) " + type + " type!";



    picActive = false;
    weakActive = false;
    strenActive = false;
    typeActive = true;
}

function pokeWeakness(url){
    let xhr = new XMLHttpRequest();
    xhr.onload = weaknessLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function pokeStrength(url){
    let xhr = new XMLHttpRequest();
    xhr.onload = strengthLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();    
}   

function pokePictureFront(){
    document.querySelector(".data").innerHTML = `<img src = ${pictureFront} width=300px height=300px>`;

    picActive = true;
    weakActive = false;
    strenActive = false;
    typeActive = false;
}

function pokePictureBack(){
    document.querySelector(".data").innerHTML = `<img src = ${pictureBack} width=300px height=300px>`;

    picActive = true;
    weakActive = false;
    strenActive = false;
    typeActive = false;
}

function getData(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e){
    let xhr = e.target;

    let result = JSON.parse(xhr.responseText);

    document.querySelector(".content").innerHTML = "Showing result for '" + result.name.toUpperCase() + "'";

    pokeName = result.name;
    pictureFront = result.sprites.front_default;
    pictureBack = result.sprites.back_default;

    if(result.types.length > 1){
        type1 = result.types[0].type.url;
        type2 = result.types[1].type.url;

        type = result.types[0].type.name.toUpperCase() + " and " + result.types[1].type.name.toUpperCase();
    }
    else{
        type = result.types[0].type.name;
    }

    damage = result.types[0].type.url;

    
    if(weakActive){
        pokeWeakness(damage);
    }
    if(strenActive){
        pokeStrength(damage);
    }
    if(typeActive){
        pokeType();
    }
    
    pokePictureFront();    
}

function weaknessLoaded(e){
    let xhr = e.target;
    let weak;

    let result = JSON.parse(xhr.responseText);

    if(result.damage_relations.double_damage_from.length > 1){
        weak = result.damage_relations.double_damage_from[0].name.toUpperCase() + " & " + result.damage_relations.double_damage_from[1].name.toUpperCase();
    }
    else{
        weak = result.damage_relations.double_damage_from[0].name.toUpperCase();
    }

    document.querySelector(".data").innerHTML = type.toUpperCase() + " is weak against " + weak;
 
    picActive = false;
    weakActive = true;
    strenActive = false;
    typeActive = false;
}

function strengthLoaded(e){
    let xhr = e.target;
    let strong;

    let result = JSON.parse(xhr.responseText);

    if(result.damage_relations.double_damage_from.length > 1){
        strong = result.damage_relations.double_damage_to[0].name.toUpperCase() + " & " + result.damage_relations.double_damage_to[1].name.toUpperCase();
    }
    else{
        strong = result.damage_relations.double_damage_to[0].name.toUpperCase();
    }

    document.querySelector(".data").innerHTML = type.toUpperCase() + " is strong against " + strong;

    picActive = false;
    weakActive = false;
    strenActive = true;
    typeActive = false;
}

function dataError(e){
    console.log("An error occured");
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
  // Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}