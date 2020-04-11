const API_KEY = 'I4ImkYXIIRPVjxhHSoLhYOy0XEVXwxWj';
const instructions = document.querySelector('.instructions');
const cancel = document.querySelector('#cancel');
const begin = document.querySelector('#begin');
const capturing = document.querySelector('.capturing');
const closeCapture = document.querySelector('#closeCapture');
const captureButton = document.querySelector('#captureButton');
const camera = document.querySelector('.camera');
const logoBoxCreate = document.querySelector('.logoBoxCreate');
const recording = document.querySelector('.recording');
const ready = document.querySelector('.ready');
const upload = document.querySelector('#upload');
const preview = document.querySelector('.preview');
let captureVideo = document.querySelector('#captureVideo'); 
let counter = document.getElementsByClassName('counter');
let recorder = {};
let countdown = {}
let form = new FormData();

function success(stream){ //funcion de exito para acceder a webcam
    const mediaStream = stream;
    captureVideo.srcObject = mediaStream
    captureVideo.play()
    recorder = new RecordRTCPromisesHandler(mediaStream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            console.log('started')
        },
    });
}

function error(error){ //funcion error para acceder a web came
    alert('error al acceder a la wbcam :(')
    console.error(error)
}

function timer(){
    let sec = 0;
    let min = 0;
    let hour = 0;
    countdown = setInterval(function(){
        counter[0].innerHTML=`${hour}:${min}:${sec}`;
        counter[1].innerHTML=`${hour}:${min}:${sec}`;
        
        sec++;
        if(sec==60){
            sec = 0
            min++
            if(min==60){
                min = 0
                hour++
            }
        }
    }, 1000);
}

logoBoxCreate.addEventListener('click', ()=>{ // redirecciona a la pagina principal
    window.location.href = '/index.html';
})

cancel.addEventListener('click', ()=>{ //cancela crear guifos
    window.location.href = '/index.html';
})

begin.addEventListener('click', ()=>{ //da acceso a la camara
    instructions.style.display = 'none';
    capturing.style.display = 'block';
    navigator.webcam = (
        navigator.msGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.getUserMedia
    ) 
    navigator.webcam({video:true, audio:false}, success, error )
    
})

closeCapture.addEventListener('click', ()=>{ // cancela crear guifos
    window.location.href = '/index.html';
})

captureButton.addEventListener('click', ()=>{ // empieza a grabar
    document.getElementById('testTitle').innerHTML='Capturando Tu Guifo'
    camera.style.display = 'none';
    captureButton.style.display = 'none';
    counter[0].style.display = 'flex';
    recording.style.display = 'flex';
    ready.style.display = 'flex'; 
    recorder.startRecording();
    timer()
})

ready.addEventListener('click',()=>{ // termina de grabar
    capturing.style.display = 'none';
    preview.style.display = 'block';
    clearInterval(countdown)
    recorder.stopRecording()
    .then(resp=>{
        recorder.getBlob()
        .then(blob=>{
            form.append('file', blob, 'myGif.gif'); 
            console.log(form.get('file'))
            let urlCreator = window.URL || window.webkitURL;
            let imageUrl = urlCreator.createObjectURL(blob);
            document.querySelector("#previewImg").src = imageUrl;
        })
    });
})
let uploadGif = async function(){
    let data = form;
    form.append('username','KaribelBT')
    let result = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${API_KEY}`, {
        method: 'post', 
        body: data
    });
    let resp = await result.json();
    return resp
}

let getUploadedGif = async function(id){
    let result = await fetch(`https://api.giphy.com/v1/gifs?api_key=${API_KEY}&ids=${id}`);
    let data = await result.json();
    return data
} 
upload.addEventListener('click',()=>{
    console.log('cargando...')
    uploadGif()
    .then(res=>{
        console.log('subido con exito')
        getUploadedGif(res.data.id)
        .then(uploaded =>{
            console.log(uploaded)
        })
    })
})
