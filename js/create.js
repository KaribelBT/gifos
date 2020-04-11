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
let captureVideo = document.querySelector('#captureVideo'); 
let counter = document.querySelector('#counter');
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
    var sec = 0;
    var min = 0;
    var hour = 0;
    countdown = setInterval(function(){
        document.getElementById('counter').innerHTML=`${hour}:${min}:${sec}`;
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
    
    recorder.startRecording();
    
    document.getElementById('testTitle').innerHTML='Capturando Tu Guifo'
    camera.style.display = 'none';
    captureButton.style.display = 'none';
    counter.style.display = 'flex';
    recording.style.display = 'flex';
    ready.style.display = 'flex'; 
    timer()
})

ready.addEventListener('click',()=>{ // termina de grabar
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

