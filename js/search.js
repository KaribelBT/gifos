//boton buscar y sugestions
let search = document.querySelector('#search');
let searchButton = document.querySelector('#searchButton');
let lens = document.querySelector('#lens');
let inactiveLens = './images/lupa_inactive.svg';
let activeLens = './images/lupa.svg';
let sugResults = document.querySelector('#sugResults');

let API_KEY = 'VA2FUF04PUZ6';
let getSuggest = async (q) =>{
    console.log(q)
    let response = await fetch(`https://api.tenor.com/v1/search_suggestions?key=${API_KEY}&q=${q}`);
    let suggest = await response.json();
    return suggest.results.splice(0,3);
}

search.addEventListener('keyup', ev=> {
    if (search.value.length !==0){
        searchButton.disabled = false;
        lens.src = activeLens;
        sugResults.classList.toggle('active');
    }
    else{
        searchButton.disabled = true;
        lens.src = inactiveLens;
    }

    let query = ev.target.value;
    if (query.length < 3) return;
    getSuggest(query).then(results =>{
        results.forEach(result=>{
            let li = document.createElement('li');
            li.innerHTML = result;
            sugResults.appendChild(li);
        })
    })
})
