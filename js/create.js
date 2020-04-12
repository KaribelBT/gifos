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
const repeat = document.querySelector('#repeat');
const loading = document.querySelector('.loading');
const closeLoading = document.querySelector('#closeLoading');
const loadingCancel = document.querySelector('#loadingCancel');
const sucessClose = document.querySelector('#sucessClose');
const copy = document.querySelector('#copy');
const download = document.querySelector('#download');
const sucessReady = document.querySelector('#sucessReady');
const successDiv = document.querySelector('.success');
let captureVideo = document.querySelector('#captureVideo');
let counter = document.getElementsByClassName('counter');
let recorder = {};
let countdown = {}
let myGifos = [];
let mediaStream;
let gifId = "";
let gifUrlForClip = "";
let form = new FormData();

function success(stream) { //funcion de exito para acceder a webcam
    mediaStream = stream;
    captureVideo.srcObject = mediaStream;
    captureVideo.play()
    recorder = new RecordRTCPromisesHandler(mediaStream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function () {
            console.log('started');
        },
    });
}

function error(error) { //funcion error para acceder a web came
    alert('error al acceder a la wbcam :(');
    console.error(error);
}

function timer() { //funcion para timer de create
    let sec = 0;
    let min = 0;
    let hour = 0;
    countdown = setInterval(function () {
        counter[0].innerHTML = `${hour}:${min}:${sec}`;
        counter[1].innerHTML = `${hour}:${min}:${sec}`;

        sec++;
        if (sec == 60) {
            sec = 0
            min++
            if (min == 60) {
                min = 0
                hour++
            }
        }
    }, 1000);
}

let uploadGif = async function () { //funcion para subir gif a la api
    let data = form;
    form.append('username', 'KaribelBT')
    let result = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${API_KEY}`, {
        method: 'post',
        body: data
    });
    let resp = await result.json();
    return resp
}

let getUploadedGif = async function (id) { //funcion para recuperar gif subido
    let result = await fetch(`https://api.giphy.com/v1/gifs?api_key=${API_KEY}&ids=${id}`);
    let data = await result.json();
    return data
}

function createStorage(gif) { //funcion para crear loca storage para mis guifos
    let uploadedGifos = []
    if (localStorage.getItem('uploadedGifos')) {
        let uploadedArray = JSON.parse(localStorage.getItem('uploadedGifos'))
        uploadedArray.map(s => {
            uploadedGifos.push(s)
        })
    }
    if (uploadedGifos.length > 0) {
        myGifos = uploadedGifos

    }
    myGifos.push(gif);
    localStorage.setItem('uploadedGifos', JSON.stringify(myGifos));
}

logoBoxCreate.addEventListener('click', () => { // redirecciona a la pagina principal
    window.location.href = '/index.html';
})

cancel.addEventListener('click', () => { //cancela crear guifos
    window.location.href = '/myguifos.html';
})

begin.addEventListener('click', () => { //da acceso a la camara
    instructions.style.display = 'none';
    capturing.style.display = 'block';
    navigator.webcam = (
        navigator.msGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.getUserMedia
    )
    navigator.webcam({ video: true, audio: false }, success, error)

})

closeCapture.addEventListener('click', () => { // cancela crear guifos
    window.location.href = '/myguifos.html';
})

captureButton.addEventListener('click', () => { // empieza a grabar
    document.getElementById('testTitle').innerHTML = 'Capturando Tu Guifo'
    camera.style.display = 'none';
    captureButton.style.display = 'none';
    counter[0].style.display = 'flex';
    recording.style.display = 'flex';
    ready.style.display = 'flex';
    recorder.startRecording();
    timer()
})

ready.addEventListener('click', () => { // termina de grabar
    capturing.style.display = 'none';
    preview.style.display = 'block';
    clearInterval(countdown)
    recorder.stopRecording()
        .then(resp => {
            recorder.getBlob()
                .then(blob => {
                    form.append('file', blob, 'myGif.gif');
                    console.log(form.get('file'))
                    let urlCreator = window.URL || window.webkitURL;
                    let imageUrl = urlCreator.createObjectURL(blob);
                    document.querySelector("#previewImg").src = imageUrl;
                    document.querySelector("#otherPreviewImg").src = imageUrl;
                    mediaStream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                })
        });
})

repeat.addEventListener('click', () => {
    location.reload();

})

upload.addEventListener('click', () => {
    preview.style.display = 'none';
    loading.style.display = "block";
    uploadGif()
        .then(res => {
            console.log('subido con exito')
            getUploadedGif(res.data.id)
                .then(uploaded => {
                    gifId = uploaded.data[0].id
                    gifUrlForClip = uploaded.data[0].url
                    createStorage(uploaded.data[0])
                })
        })
    setTimeout(() => {
        loading.style.display = "none";       
        successDiv.style.display = "block";
    }, 3000);        
})

closeLoading.addEventListener('click', () => { // cancela crear guifos
    window.location.href = '/myguifos.html';
})

loadingCancel.addEventListener('click', () => { // cancela crear guifos
    window.location.href = '/myguifos.html';
})

successClose.addEventListener('click', () => { //cancela crear guifos
    window.location.href = '/myguifos.html';
})

successReady.addEventListener('click', () => { //cancela crear guifos
    window.location.href = '/myguifos.html';
})

copy.addEventListener('click', () => {
    const el = document.createElement('textarea');
    el.value = gifUrlForClip;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el); 
    document.execCommand('copy');
})


download.addEventListener('click',()=>{
    let downloadUrl = `https://media.giphy.com/media/${gifId}/giphy.gif`;
    let getGif = fetch(downloadUrl);
    getGif.then(resp=>{
        return resp.blob()
    })
    .then(blob=>{
        let urlGif = URL.createObjectURL(blob);
        let saveImg = document.createElement("a");
        saveImg.href = urlGif;
        saveImg.download = "myGuifo.gif";
        saveImg.style = 'display: "none"';
        document.body.appendChild(saveImg);
        saveImg.click();
        document.body.removeChild(saveImg);
    })
})