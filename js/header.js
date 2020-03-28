
//change theme
let dropButton = document.querySelector('#dropButton');
let themes = document.querySelector('#themes')

dropButton.addEventListener('click', ()=>{
    themes.classList.toggle('active');
})
