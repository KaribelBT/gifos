const myGuifosResultBox = document.querySelector('#myGuifosResultBox');
window.onload = () =>{
    if(localStorage.getItem('isDark')=='true'){
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        logo.src = darkLogo;
    }else{
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        logo.src = lightLogo;
    }

    if(localStorage.getItem('uploadedGifos')){
        let arrayGifs = JSON.parse(localStorage.getItem('uploadedGifos'))
        arrayGifs.map(g=>{
            console.log(g)
            myGuifosResultBox.innerHTML +=
            `<div class="imageResultsBox">
                <div class="myGifs">
                    <img src ="${g.images.original.url}">
                </div>
            </div>`
        })
    }
}