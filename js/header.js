//change theme
let dropButton = document.querySelector('#dropButton');
let themes = document.querySelector('#themes')

dropButton.addEventListener('click', ()=>{
    themes.classList.toggle('active');
})

let btnLight = document.querySelector('#btnLight');
let btnDark = document.querySelector('#btnDark');
let logo = document.querySelector('#logo');
let darkLogo = "./images/gifOF_logo_dark.png";
let lightLogo = "./images/gifOF_logo.png";


btnDark.addEventListener('click', ()=>{
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    themes.classList.toggle('active')
    logo.src = darkLogo;
    
})

btnLight.addEventListener('click', ()=>{
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    themes.classList.toggle('active')
    logo.src = lightLogo;
})
