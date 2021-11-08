window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};

window.onload = (e) => {document.querySelector("#random").onclick = searchRandomClicked};

let diplayterm = "";

function searchButtonClicked(){
    const GIPHY_URL = "https://pokeapi.co/api/v2/pokemon/";

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

fucntion searchRandomClicked(){
    const GIPHY_URL = "https://pokeapi.co/api/v2/pokemon/";

    let url = GIPHY_URL;

    let term = getRandomInt()

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

fucntion dataLoaded(e){
    let xhr = e.target;
}