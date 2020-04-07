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
const API_KEY = 'I4ImkYXIIRPVjxhHSoLhYOy0XEVXwxWj';
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
async function getGif(inputSearchQuery){ //busca gifs
    let resp = await fetch(`http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${inputSearchQuery}`);
    let data = await resp.json();
    return data;
}

function getNewGif(title){
    searchResultBox.innerHTML = '';
    searchResult.style.display = 'block';
    createTitle(title)
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

function getTags(){
    if(localStorage.getItem('searchedTags')){
        let searchedArray = JSON.parse(localStorage.getItem('searchedTags'))
        searchedArray.map(s=>{
            searchResultButtons.innerHTML += 
            `<button class="searchResultButton" onclick="getNewGif('${s}')">
                #${s}
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

searchBar.addEventListener('submit', (e)=>{ //muestra resultados de busqueda de gif
    e.preventDefault()
    let inputSearchQuery = search.value;
    searchResultBox.innerHTML = '';
    search.value = '';
    sugResults.classList.remove('active');
    searchResult.style.display = 'block';
    createTitle(inputSearchQuery);
    createTags(inputSearchQuery);
    getTags()
    getGif(inputSearchQuery)
    .then(resp=>{
        showResults(resp.data);  
    })    
})

window.onload = () =>{
    getTags()
}