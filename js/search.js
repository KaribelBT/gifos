const search = document.querySelector('#search');
const searchBar = document.querySelector('#searchBar');
const lens = document.querySelector('#lens');
const inactiveLens = './images/lupa_inactive.svg';
const activeLens = './images/lupa.svg';
const sugResults = document.querySelector('#sugResults');
const searchResult = document.querySelector('#searchResult');
const searchResultBox = document.querySelector('#searchResultBox');
const searchResultTitle = document.querySelector('#searchResultTitle');
const API_KEY = 'I4ImkYXIIRPVjxhHSoLhYOy0XEVXwxWj';

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
})

async function getGif(inputSearchQuery){ //busca gifs
    let resp = await fetch(`http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${inputSearchQuery}`);
    let data = await resp.json();
    return data;
}

function createTitle(text){//crear y rellenar titulo 
    let searchTitle = `<h3>${text}:</h3>`;
    searchResultTitle.innerHTML = searchTitle;
}

function showResults(arrayGif){ //muestra resultados de busqueda de gif
    if(arrayGif < 1){
        let noResults = 'Oops! no se encontraron resultados';
        let parragraph = document.createElement('p');
        parragraph.innerHTML = noResults;
        searchResultBox.append(parragraph)
    }
        
    arrayGif.forEach( (gif)=> {
        let imageResultBox=
         `<div class="imageResultsBox">
            <div class="gifBox">
                <div class="gifs">
                    <img src ="${gif.images.original.url}">
                </div>
                <div class="hashtags">
                    <h2 id="hashtagsGif"></h2>
                </div>
            </div>            
        </div>`
        searchResultBox.innerHTML += imageResultBox;
    });
}

searchBar.addEventListener('submit', (e)=>{ //muestra resultados de busqueda de gif
    e.preventDefault()
    let inputSearchQuery = search.value;
    searchResultBox.innerHTML = '';
    search.value = '';
    sugResults.classList.remove('active');
    searchResult.style.display = 'block';
    createTitle(inputSearchQuery);
    getGif(inputSearchQuery).then(resp=>{
        showResults(resp.data)
        //create - push hastags en hover gif
        let hashtagsArray = ' ';
        hashtagsArray = inputSearchQuery.split(' ');
        //hashtagsArray.push(inputSearchQuery)
        let h2Value = '';
        for (let i = 0; i < hashtagsArray.length; i++) {
            h2Value = h2Value + hashtagsArray[i];
        }
        let hashtagsGif = document.querySelector('#hashtagsGif')
        hashtagsGif.innerHTML = h2Value;
        console.log(h2Value)             
        })      
})