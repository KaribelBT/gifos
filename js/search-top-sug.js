const API_KEY = 'I4ImkYXIIRPVjxhHSoLhYOy0XEVXwxWj';
const search = document.querySelector('#search');
const searchBar = document.querySelector('#searchBar');
const lens = document.querySelector('#lens');
const inactiveLens = './images/lupa_inactive.svg';
const activeLens = './images/lupa.svg';
const sugResults = document.querySelector('#sugResults');
const searchResult = document.querySelector('#searchResult');
const searchResultBox = document.querySelector('#searchResultBox');
const searchResultTitle = document.querySelector('#searchResultTitle');
const searchResultButtons = document.querySelector('#searchResultButtons');
const topResultBox = document.querySelector('#topResultBox');
const sugResultBox = document.querySelector('#sugResultBox');
const sugGifArray = ['cute dogs', 'cute cats', 'sailor moon', 'dragon ball', 'the big bang theory', 'friends', 'nintendo', 'games of thrones', 'breaking bad', 'simpsons', 'bleach', 'doctor who', 'happy', 'angry', 'sad', 'fuck off', 'panda', 'fox', 'dance', 'music', 'orgullo y prejuicio', 'narwhals', 'disney', 'travel', 'pokemon'];
let tagsArray = [];

let getSuggest = async (q) =>{ //buscar sugerencias
    let response = await fetch(`https://api.giphy.com/v1/tags/related/${q}?api_key=${API_KEY}`);
    let suggest = await response.json();
    return suggest.data.splice(0,3);
}

function setSug(suggestion){ //busca sugerencias de busqueda input
    search.value = suggestion
    sugResults.innerHTML = '';
    sugResults.classList.remove('active');
}

async function getGif(inputSearchQuery){ //busca gifs desde un input
    let resp = await fetch(`http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${inputSearchQuery}`);
    let data = await resp.json();
    return data;
}

async function getTopGif(){ //busca gifs de trending
    let resp = await fetch(`http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`);
    let data = await resp.json();
    return data;
}

function getNewGif(title){ // busca gif desde otro gif
    searchResultBox.innerHTML = '';
    searchResult.style.display = 'block';
    createTitle(title)
    createTags(title)
    getGif(title)
    .then(resp=>{
        showResults(resp.data);
    }) 
}

function createTitle(text){//crear y rellenar titulo 
    let searchTitle = `<h3>${text}:</h3>`;
    searchResultTitle.innerHTML = searchTitle;
}

function createTags (inputSearchQuery){//crea los tags para volver a buscar
    let searchedTags = []
    if(localStorage.getItem('searchedTags')){
        let searchedArray = JSON.parse(localStorage.getItem('searchedTags'))
        searchedArray.map(s=>{
            searchedTags.push(s)
        })
    }
    if(searchedTags.length>0){
        tagsArray = searchedTags

    }
    tagsArray.push(inputSearchQuery);
    localStorage.setItem('searchedTags', JSON.stringify(tagsArray));
}

function getTags(){ //muestra los tags creados
    if(localStorage.getItem('searchedTags')){
        let searchedArray = JSON.parse(localStorage.getItem('searchedTags'))
        searchedArray.map(s=>{
            searchResultButtons.innerHTML += 
            `<button class="searchResultButton" onclick="getNewGif('${s}')">
                ${s}
            </button>`
        })
    }
}

function showResults(arrayGif){ //muestra resultados de busqueda de gif
    if(arrayGif < 1){
        let noResults = 'Oops! no se encontraron resultados';
        let parragraph = document.createElement('p');
        parragraph.innerHTML = noResults;
        searchResultBox.append(parragraph)
    }
    arrayGif
        .forEach( (gif)=> {
            const textToRender = this.showHashtags(gif.title);
            let imageResultBox=
            `<div class="imageResultsBox" onclick="getNewGif('${gif.title}')">
                <div class="gifs">
                    <img src ="${gif.images.original.url}">
                </div>
                <div class="hashtags">
                    <h2 class="hashtagsGif">${textToRender}</h2>
                </div>
            </div>`
            searchResultBox.innerHTML += imageResultBox;
    });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function getSugResults(){ //busca y muestra resultados sugeridos
    let shuffledSugGif = sugGifArray.sort(function(){return .4 - Math.random()});
    let randomSugGif=shuffledSugGif.slice(0,4); 
    randomSugGif.map(r => {
        getGif(r)
        .then (resp =>{
        let gif = resp.data[0];
            const textToRender = this.showHashtag(gif.title);
            let imageResultBox=
            `<div id="imageSugResultBox" class="imageSugResultsBox">
                <div class="sugHashtags">
                    <h2 class="sugHashtagsGif">${textToRender}</h2>
                    <img onclick="removeSugGif(event)" src = ./images/button3.svg>
                </div>    
                <div class="sugGifs">
                    <img src ="${gif.images.original.url}">
                </div>
                <button id="btnSug" onclick="getNewGif('${gif.title}')"> Ver más...</button>
            </div>`
            sugResultBox.innerHTML += imageResultBox;
        })
    })
    
}

function getNewSugResult(){ //busca y muestra 1 resultado sugeridos
    let shuffledSugGif = sugGifArray[Math.floor(Math.random() * sugGifArray.length)];
    getGif(shuffledSugGif)
    .then (resp =>{
    let gif = resp.data[0];
        const textToRender = this.showHashtag(gif.title);
        let imageResultBox=
        `<div id="imageSugResultBox" class="imageSugResultsBox">
            <div class="sugHashtags">
                <h2 class="sugHashtagsGif">${textToRender}</h2>
                <img onclick="removeSugGif(event)" src = ./images/button3.svg>
            </div>    
            <div class="sugGifs">
                <img src ="${gif.images.original.url}">
            </div>
            <button id="btnSug" onclick="getNewGif('${gif.title}')"> Ver más...</button>
        </div>`
        sugResultBox.innerHTML += imageResultBox;
    })
}

function removeSugGif(event){
    event.target.parentNode.parentNode.remove()
    getNewSugResult()
}

function showTopResults(arrayGif){ //muestra resultados tendencias
    arrayGif
        .forEach( (gif)=> {
            const textToRender = this.showHashtags(gif.title);
            let imageResultBox=
            `<div class="imageTopResultsBox" onclick="getNewGif('${gif.title}')">
                <div class="topGifs">
                    <img src ="${gif.images.original.url}">
                </div>
                <div class="topHashtags">
                    <h2 class="topHashtagsGif">${textToRender}</h2>
                </div>
            </div>`
            topResultBox.innerHTML += imageResultBox;
    });
}

function showHashtags(title){ //create - push #hastags #en #hover #gif    
    const hashtag = '#';
    let gifTitle = title
    let hashtagsArray = gifTitle.split(' '); // return array ['hola', 'karibel']
    let valuesWithHashtag = hashtagsArray.map((valor)=>`${hashtag}${valor}`); // return array ['#hola', '#karibel']
    let valuesWithHashtagLimited = valuesWithHashtag.filter((element, i)=>i < 4); // Filtra solo 4 primeras palabras
    let hashtagsString = valuesWithHashtagLimited.join(' '); //pasar a string separado por espacio
    return hashtagsString
}

function showHashtag(title){ //create - push #hastagenhovergif    
    let gifTitle = title
    let hashtagsArray = gifTitle.split(' '); // return array ['hola', 'karibel']
    let valuesWithHashtagLimited = hashtagsArray.filter((element, i)=>i < 4); // Filtra solo 4 primeras palabras
    let hashtagsString = valuesWithHashtagLimited.join(''); //pasar a string separado por espacio
    return `#${hashtagsString}`
}

window.onload = () =>{
    //muestra historial de busquedas realizadas    
    getTags() 
    //muestra gif sugeridos
    getSugResults()
    //muestra tendencias
    getTopGif() 
    .then(resp=>{
        showTopResults(resp.data);  
    }) 
}

search.addEventListener('keyup', ev=> { //habilitar btn busqueda + mostrar sugerencias
    if (search.value.length > 0){
        searchButton.disabled = false;
        lens.src = activeLens;
        sugResults.classList.add('active');
    }
    else{
        searchButton.disabled = true;
        lens.src = inactiveLens;
        sugResults.classList.remove('active');
    }
    let query = ev.target.value;
    if (query.length != ''){
        getSuggest(query).then(results =>{
            sugResults.innerHTML = '';        
            if (results.length > 0) {
                results.forEach(result=>{
                    sugResults.innerHTML += 
                    `<li onclick="setSug('${result.name}')">
                        ${result.name}
                    </li>`; 
                })
            }
            else{
                sugResults.classList.remove('active');
            }
        })
    } 
})

searchBar.addEventListener('submit', (e)=>{ //muestra resultados de busqueda de gif
    e.preventDefault()
    let inputSearchQuery = search.value;
    searchResultBox.innerHTML = '';
    search.value = '';
    sugResults.classList.remove('active');
    searchResult.style.display = 'block';
    createTitle(inputSearchQuery);
    createTags(inputSearchQuery);
    getGif(inputSearchQuery)
    .then(resp=>{
        showResults(resp.data);  
    })    
})