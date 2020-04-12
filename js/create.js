const API_KEY = 'I4ImkYXIIRPVjxhHSoLhYOy0XEVXwxWj';
const instructions = document.querySelector('.instructions');
const cancel = document.querySelector('#cancel');
const begin = document.querySelector('#begin');
const capturing = document.querySelector('.capturing');
const closeCapture = document.querySelector('#closeCapture');
const captureButton = document.querySelector('#captureButton');
const camera = document.querySelector('.camera');
const logoBoxCreate = document.querySelector('.logoBoxCreate');
const logo = document.querySelector('#logoCreate');
const darkLogo = "./images/gifOF_logo_dark.png";
const lightLogo = "./images/gifOF_logo.png";
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
const myGuifosResultBox = document.querySelector('#myGuifosResultBox');
let captureVideo = document.querySelector('#captureVideo');
let counter = document.getElementsByClassName('counter');
let recorder = {};
let countdown = {}
let myGifos = [];
let mediaStream;
let gifId = "";
let gifUrlForClip = "";
let form = new FormData();

//funcion de exito para acceder a webcam
function success(stream) { 
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

//funcion error para acceder a webcam
function error(error) { 
    alert('error al acceder a la wbcam :(');
    console.error(error);
}

//funcion para timer de create
function timer() { 
    let sec = 0;
    let min = 0;
    let hour = 0;
    countdown = setInterval(function () {
        counter[0].innerHTML = `${hour}:${min}:${sec}`;
        counter[1].innerHTML = `${hour}:${min}:${sec}`;
        sec++;
        if (sec == 60) {
            sec = 0;
            min++;
            if (min == 60) {
                min = 0;
                hour++;
            }
        }
    }, 1000);
}

//funcion para subir gif a la api
let uploadGif = async function () { 
    let data = form;
    let result = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${API_KEY}`, {
        method: 'post',
        body: data
    });
    let resp = await result.json();
    return resp
}

//funcion para recuperar gif subido
let getUploadedGif = async function (id) {
    let result = await fetch(`https://api.giphy.com/v1/gifs?api_key=${API_KEY}&ids=${id}`);
    let data = await result.json();
    return data
}

//funcion para crear local storage para mis guifos
function createStorage(gif) { 
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

window.onload = () =>{
    //mantiene change theme
    if(localStorage.getItem('isDark')=='true'){
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        logo.src = darkLogo;
    }else{
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        logo.src = lightLogo;
    }
    //agrega gif a mis guifos
    if(localStorage.getItem('uploadedGifos')){
        let arrayGifs = JSON.parse(localStorage.getItem('uploadedGifos'))
        arrayGifs.map(g=>{
            myGuifosResultBox.innerHTML +=
            `<div class="imageResultsBox">
                <div class="myGifs">
                    <img src ="${g.images.original.url}">
                </div>
            </div>`
        })
    }
}

// redirecciona a la pagina principal
logoBoxCreate.addEventListener('click', () => { 
    window.location.href = '/index.html';
})

//cancela crear guifos
cancel.addEventListener('click', () => { 
    window.location.href = '/myguifos.html';
})

//da acceso a la camara
begin.addEventListener('click', () => { 
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

// cancela crear guifos
closeCapture.addEventListener('click', () => { 
    window.location.href = '/myguifos.html';
})

// empieza a grabar
captureButton.addEventListener('click', () => { 
    document.getElementById('testTitle').innerHTML = 'Capturando Tu Guifo'
    camera.style.display = 'none';
    captureButton.style.display = 'none';
    counter[0].style.display = 'flex';
    recording.style.display = 'flex';
    ready.style.display = 'flex';
    recorder.startRecording();
    timer()
})

// termina de grabar
ready.addEventListener('click', () => { 
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

//vuelve a la primera pantalla
repeat.addEventListener('click', () => {
    location.reload();

})

//sube el gif
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

// cancela crear guifos
closeLoading.addEventListener('click', () => { 
    window.location.href = '/myguifos.html';
})

// cancela crear guifos
loadingCancel.addEventListener('click', () => {
    window.location.href = '/myguifos.html';
})

// cancela crear guifos
successClose.addEventListener('click', () => {
    window.location.href = '/myguifos.html';
})

//devuelve a mis guifos luego de subido el gif
successReady.addEventListener('click', () => {
    window.location.href = '/myguifos.html';
})

//copia enlace del gif
copy.addEventListener('click', () => {
    const el = document.createElement('textarea');
    el.value = gifUrlForClip;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el); 
    document.execCommand('copy');
})

//descarga gif
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

