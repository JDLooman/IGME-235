window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;
    document.querySelector("#random").onclick = randomSearch;
    document.querySelector("#type").onclick = pokeType;
    document.querySelector("#weakness").onclick = pokeWeakness;
    document.querySelector("#strength").onclick = pokeStrength;
    document.querySelector("#picture").onclick = pokePicture;
};

// add an on click for the about function to make things happen when you click it

let diplayterm = "";

function searchButtonClicked(){
    const GIPHY_URL = "https://pokeapi.co/api/v2/pokemon-form/";

    let url = GIPHY_URL;

    let term = document.querySelector("#searchterm").value;
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

    let term = getRandomInt(893);

    url += term;

    console.log(url);

    getData(url);
}

function pokeType(){
    document.querySelector("#data").innerHTML = "this is for the type";
}

function pokeWeakness(){
    document.querySelector("#data").innerHTML = "this is for the weakness";
}

function pokeStrength(){
    document.querySelector("#data").innerHTML = "this is for the strength";
}   

function pokePicture(){
    document.querySelector("#data").innerHTML = "this is for the picture";
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

    console.log(xhr.responseText);

    let result = JSON.parse(xhr.responseText);

    let typeArray = result.types;
    let newArray = typeArray[1];

    document.querySelector("#content").innerHTML = "Showing result for '" + result.name.toUpperCase() + "'";
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