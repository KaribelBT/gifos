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

//función para buscar sugerencias
let getSuggest = async (q) =>{ 
    let response = await fetch(`https://api.giphy.com/v1/tags/related/${q}?api_key=${API_KEY}`);
    let suggest = await response.json();
    return suggest.data.splice(0,3);
}

// función para buscar sugerencias de busqueda input
function setSug(suggestion){ 
    search.value = suggestion
    sugResults.innerHTML = '';
    sugResults.classList.remove('active');
}

//función para buscar gifs desde un input
async function getGif(inputSearchQuery){
    let resp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${inputSearchQuery}`);
    let data = await resp.json();
    return data;
}

//función para buscar gifs de trending
async function getTopGif(){ 
    let resp = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}`);
    let data = await resp.json();
    return data;
}

//función para buscar gif desde otro gif
function getNewGif(title){
    searchResultBox.innerHTML = '';
    searchResult.style.display = 'block';
    createTitle(title)
    createTags(title)
    getGif(title)
    .then(resp=>{
        showResults(resp.data);
    }) 
}

//función crear y rellenar titulo 
function createTitle(text){
    let searchTitle = `<h3>${text}:</h3>`;
    searchResultTitle.innerHTML = searchTitle;
}

//función para crear los tags para volver a buscar
function createTags (inputSearchQuery){
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

//función para mostrar los tags creados
function getTags(){ 
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

//función para mostrar resultados de busqueda de gif
function showResults(arrayGif){ 
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

//función busca y muestra resultados sugeridos
function getSugResults(){ 
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

//función busca y muestra 1 resultado sugeridos
function getNewSugResult(){ 
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

//función remueve 1 gif sugerido
function removeSugGif(event){
    event.target.parentNode.parentNode.remove()
    getNewSugResult()
}

//función muestra resultados tendencias
function showTopResults(arrayGif){
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

//función crea y push #hastags #en #hover #gif 
function showHashtags(title){    
    const hashtag = '#';
    let gifTitle = title
    let hashtagsArray = gifTitle.split(' '); // return array ['hola', 'karibel']
    let valuesWithHashtag = hashtagsArray.map((valor)=>`${hashtag}${valor}`); // return array ['#hola', '#karibel']
    let valuesWithHashtagLimited = valuesWithHashtag.filter((element, i)=>i < 4); // Filtra solo 4 primeras palabras
    let hashtagsString = valuesWithHashtagLimited.join(' '); //pasar a string separado por espacio
    return hashtagsString
}

//función crea y push #hastagenhovergif   
function showHashtag(title){    
    let gifTitle = title
    let hashtagsArray = gifTitle.split(' '); // return array ['hola', 'karibel']
    let valuesWithHashtagLimited = hashtagsArray.filter((element, i)=>i < 4); // Filtra solo 4 primeras palabras
    let hashtagsString = valuesWithHashtagLimited.join(''); //pasar a string separado por espacio
    return `#${hashtagsString}`
}

window.onload = () =>{
    //mantiene change theme
    if(localStorage.getItem('isDark')=='true'){
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        logo.src = darkLogo;
    }else{
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        logo.src = lightLogo;
    }
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
//habilitar btn busqueda + mostrar sugerencias
search.addEventListener('keyup', ev=> { 
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

//muestra resultados de busqueda de gif
searchBar.addEventListener('submit', (e)=>{ 
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