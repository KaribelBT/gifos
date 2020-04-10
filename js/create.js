const buttonCreate = document.querySelector('#buttonCreate');
const headerBox = document.querySelector('.headerBox');
const searchs = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const tops = document.querySelector('.top');
const instructions = document.querySelector('.instructions');
const cancel = document.querySelector('#cancel');
const begin = document.querySelector('#begin');
const test = document.querySelector('.test');
const closeUno = document.querySelector('#closeUno');
let captureVideo = document.querySelector('#captureVideo'); 

function success(stream){
    const mediaStream = stream;
    captureVideo.srcObject = mediaStream
    captureVideo.play()
}

function error(error){
    alert('error al acceder a la wbcam :(')
    console.error(error)
}
buttonCreate.addEventListener('click', ()=>{
    headerBox.style.display = 'none';
    searchs.style.display = 'none';
    searchResultButtons.style.display = 'none';
    suggestions.style.display = 'none';
    tops.style.display = 'none';
    logoBoxCreate.style.display = 'flex';
    instructions.style.display = 'block';
})

cancel.addEventListener('click', ()=>{
    location.reload()
})



begin.addEventListener('click', ()=>{
    instructions.style.display = 'none';
    test.style.display = 'block';
    navigator.webcam = (
        navigator.msGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.getUserMedia
    ) 
    navigator.webcam({video:true, audio:false}, success, error )
})

closeUno.addEventListener('click', ()=>{
    location.reload()
})
