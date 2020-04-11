
const dropButton = document.querySelector('#dropButton');
const themes = document.querySelector('#themes')
const btnLight = document.querySelector('#btnLight');
const btnDark = document.querySelector('#btnDark');
const logo = document.querySelector('#logo');
const darkLogo = "./images/gifOF_logo_dark.png";
const lightLogo = "./images/gifOF_logo.png";
const logoBox = document.querySelector('.logoBox')
const logoCreate = document.querySelector('#logoCreate');
const darkLogoCreate = "./images/gifOF_logo_dark.png";
const lightLogoCreate = "./images/gifOF_logo.png";
const buttonCreate = document.querySelector('#buttonCreate');

logoBox.addEventListener('click', ()=>{
    location.reload()
})

buttonCreate.addEventListener('click', ()=>{ //accede a crear guifos
    window.location.href = '/upload.html'
})
dropButton.addEventListener('click', ()=>{ //muestra menu de themes
    themes.classList.toggle('active');
})

btnDark.addEventListener('click', ()=>{ //change theme
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    themes.classList.toggle('active')
    logo.src = darkLogo;
    logoCreate.src = darkLogoCreate;
})

btnLight.addEventListener('click', ()=>{ //change theme
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    themes.classList.toggle('active')
    logoCreate.src = lightLogoCreate;
})
