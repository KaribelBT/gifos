let search = document.querySelector('#search');
let searchBar = document.querySelector('#searchBar');
let lens = document.querySelector('#lens');
let inactiveLens = './images/lupa_inactive.svg';
let activeLens = './images/lupa.svg';
let sugResults = document.querySelector('#sugResults');
let imageBox = document.querySelector('#imageBox')
let searchResult = document.querySelector('#searchResult');

let API_KEY = 'VA2FUF04PUZ6';//tenor
let getSuggest = async (q) =>{ //buscar sugerencias
    let response = await fetch(`https://api.tenor.com/v1/search_suggestions?key=${API_KEY}&q=${q}&limit=3`);
    let suggest = await response.json();
    return suggest.results;
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
                `<li onclick="setSug('${result}')">
                    ${result}
                </li>`; 
            })
        }
        else{
            sugResults.classList.remove('active');
        }
    })
})

let API_KEY_GIPHY = 'I4ImkYXIIRPVjxhHSoLhYOy0XEVXwxWj'; // giphy
async function getGif(inputSearchQuery){ //busca gifs
    let resp = await fetch(`http://api.giphy.com/v1/gifs/search?api_key=${API_KEY_GIPHY}&q=${inputSearchQuery}`);
    let data = await resp.json();
    return data;
}

function createTittle(text){//crear y rellenar titulo 
    let searchTittle = `<h3>${text}:</h3>`;
    let searchResultTittle = document.querySelector('#searchResultTittle');
    searchResultTittle.innerHTML = searchTittle;
}

function showResults(arrayGif){
    let searchResultBox = document.querySelector('#searchResultBox');
    if(arrayGif < 1){
        let noResults = 'Oops! no se encontraron resultados';
        let parragraph = document.createElement('p');
        parragraph.innerHTML = noResults;
        searchResultBox.append(parragraph)
    }
    
    
    arrayGif.forEach( (gif)=> {
        let img = `<img src ="${gif.images.original.url}">`;
        imageBox.innerHTML += img;
    });
}

searchBar.addEventListener('submit', (e)=>{
    e.preventDefault()
    let inputSearchQuery = search.value;
    imageBox.innerHTML = '';
    search.value = '';
    sugResults.classList.remove('active');
    searchResult.style.display = 'block';
    createTittle(inputSearchQuery);
    getGif(inputSearchQuery).then(resp=>{
        showResults(resp.data)            
    })    
})