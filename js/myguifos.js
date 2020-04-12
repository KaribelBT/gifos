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
}