window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;
    document.querySelector("#random").onclick = randomSearch;
};

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

    let term = getRandomInt(200);

    url += term;

    console.log(url);

    getData(url);
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

    document.querySelector("#content").innerHTML = "Showing result for '" + result.name.toUpperCase() + "' " + result.type;
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