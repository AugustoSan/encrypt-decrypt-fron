/* Librerías */
import * as faceapi from 'face-api.js';
import { guardarImagenBase64, predictionClient } from '../services/api';

/*--- Nuevas variables ---*/

/* Frontend */
let
    /* Elemento video */
    videoTag,

    /* Elemento progress bar */
    progressBar,

    /* Elemento circle */
    circle,

    /* Elemento Circle progress */
    circleProgress,

    /* Elemento div donde se muestra el mensaje */
    divMensaje,

    /* Elemento div donde se muestra el mensaje de mantente a cuadro */
    // divCuadro,

    /* Elemento svg */
    svgBackground,

    /* Identificador de la transacción */
    uuidTransaccion,

    /* Identificador del dispositivo */
    uuidCliente,

    /* Identificador del otorgante */
    uuidOtorgante,

    /* Apikey del otorgante */
    apikey,

    /* Variable para identificador el ambiente (dev_, qa_, prod_) */
    ambiente,

    /* URL del ambiente a utilizar */
    urlAmbiente,

    /* Contenedor del OBS */
    contenedor,

    /* Contenedor del OBS */
    host,

    /* Ruta para almacenar la imagen, clasificada como real, en el OBS */
    imageFolderReal,

    /* Ruta para almacenar la imagen, clasificada como spoof, en el OBS */
    imageFolderSpoof,

    /* Función para la comunicación del componente */
    getResponse,

    /* Función para obtener la imagen cuando el resultado es real */
    getImage,

    /* Mensaje que se muestra al usuario cuando se detecta que el rostro no está centrado */
    mensajeErrorCentro,

    /* Mensaje que se muestra al usuario cuando se detecta que el rostro no está cerca */
    mensajeErrorCerca,

    /* Mensaje que se muestra al usuario cuando se detecta que el rostro no está lejos */
    mensajeErrorLejos,

    /* Mensaje que se muestra al usuario cuando se logra realizar la predicción */
    mensajeEstable,

    /* Mensaje que se muestra al usuario cuando se obtiene una validación con clasificación real */
    mensajeReal,

    /* Mensaje que se muestra al usuario cuando se obtiene una validación con clasificación spoof */
    mensajeSpoof,

    /*Mensaje que se muestra al usuario cuando se excede el tiempo de la evaluación */
    mensajeTiempo,

    /*Mensaje que se muestra al usuario cuando hay un error en el servicio de predicción*/
    mensajeErrorSpoof,

    /*Mensaje que se muestra al usuario cuando se cancelar el proceso */
    mensajeCancelar,

    /* Hook para mostrar/ocultar botón "cancelar"  */
    setMostrarBotonCancelar,

    /* Hook para mostrar/ocultar botón "reiniciar"  */
    setMostrarBotonReiniciar,

    /* Hook para obtener la respuesta final  */
    setRespuestaFinal,

    /* Hook para obtener la respuesta final  */
    setMostrarSpinner,

    /* Hook para deshabilitar/habilitar botón "reiniciar"  */
    setDeshabilitarBotonReiniciar,

    /* Hook para deshabilitar/habilitar botón "reiniciar"  */
    setDeshabilitarBotonCancelar,

    /* Hook para obtener la respuesta final  */
    arregloOrdenado = [],

    /* Variable para cancelar el flujo dentro del loop  */
    cancelarProceso = false;

/* Ciencia de datos */

let
    /* Definición de variable */
    responsePredict,
    nombre,
    id;
var iteradorLoader = 0;
var contadorGeneral = 1;
var detections, canvas, resultado, arrayJsonPredict, prediction;
var windowWidth = window.innerWidth;
// var windowHeight = window.innerHeight;
var imagesOrder = [];
var maxPrediction = [];
var saveImages = [];
var loopInterno;
var base64StringEyes = "";
var segundos = 0;
var tiempoEjecucionApp;
var stopGeneral = "false";
var tiempoAgotado = 180;

//variables para obtener el ID
// var nombre = new Date().getTime()
// var id = nombre.toString().substring(nombre.toString().length - 6, nombre.toString().length)
//variables para guardar video
// let chunks = [];
//var mediaRecorder = null;
let resPrediction = '', ajusteY = 0, ajusteH = 0;

const protocol = "https"; // MODIFICAR_PRUEBA_LOCALES -QUITAR ESTE COMENTARIO EN OTRAS RAMAS

// const url_service_file = `${protocol}://${host}:8444/v1/sec_${ambiente}file`;

/*------*/

/*---- Nuevas funciones ---*/

/* Frontend */
export const asignarVariable = (valor, nombre) => {
    switch (nombre) {
        case 'video':
            videoTag = valor;
            videoTag.addEventListener('play', startTimeApp);
            videoTag.addEventListener('play', play);
            break;
        case 'progressBar':
            progressBar = valor;
            break;
        case 'circle':
            circle = valor;
            break;
        case 'circleProgress':
            circleProgress = valor;
            break;
        case 'response':
            getResponse = valor;
            break;
        case 'get_image':
            getImage = valor;
            break;
        case 'mostrar_boton_cancelar':
            setMostrarBotonCancelar = valor;
            break;
        case 'mostrar_boton_reiniciar':
            setMostrarBotonReiniciar = valor;
            break;
        case 'spinner':
            setMostrarSpinner = valor;
            break;
        case 'mensaje':
            divMensaje = valor;
            break;
        case 'svg':
            svgBackground = valor;
            break;
        case 'respuesta_final':
            setRespuestaFinal = valor;
            break;
        case 'uuidTransaccion':
            uuidTransaccion = valor;
            break;
        case 'uuidCliente':
            uuidCliente = valor;
            break;
        case 'uuidOtorgante':
            uuidOtorgante = valor;
            break;
        case 'ambiente':
            ambiente = valor;
            break;
        case 'url_ambiente':
            urlAmbiente = valor;
            break;
        case 'host':
            host = valor;
            break;
        case 'contenedor':
            contenedor = valor;
            break;
        case 'imagen_folder_real':
            imageFolderReal = valor;
            break;
        case 'imagen_folder_spoof':
            imageFolderSpoof = valor;
            break;
        case 'mensaje_error_centro':
            mensajeErrorCentro = valor;
            break;
        case 'mensaje_error_cerca':
            mensajeErrorCerca = valor;
            break;
        case 'mensaje_error_lejos':
            mensajeErrorLejos = valor;
            break;
        case 'mensaje_error_servicio_spoof':
            mensajeErrorSpoof = valor;
            break;
        case 'mensaje_estable':
            mensajeEstable = valor;
            break;
        case 'mensaje_real':
            mensajeReal = valor;
            break;
        case 'mensaje_spoof':
            mensajeSpoof = valor;
            break;
        case 'mensaje_tiempo':
            mensajeTiempo = valor;
            break;
        case 'mensaje_cancelar':
            mensajeCancelar = valor;
            break;
        case 'apikey':
            apikey = valor;
            break;
        case 'deshabilitar_boton_reiniciar':
            setDeshabilitarBotonReiniciar = valor;
            break;
        case 'deshabilitar_boton_cancelar':
            setDeshabilitarBotonCancelar = valor;
            break;
        // case 'div_cuadro':
        //     divCuadro = valor;
        //     break;
        case 'bandera_cancelar_proceso':
            cancelarProceso = valor;
            break;
        default:
            break;
    }
}

const enviarRespuestaFinal = (folder) => {
    switch (folder) {
        case 'real':
            getResponse({ mensaje: 'Persona real', clase: imagesOrder[0].clase, score: imagesOrder[0].score });
            getImage({ imagen: imagesOrder[0].image });
            break;
        default:
            getResponse({ mensaje: 'No se detectó rostro válido', clase: imagesOrder[0].clase, score: imagesOrder[0].score });
            break;
    }
}

export const cancelar = () => {
    cancelarProceso = true;
    // divMensaje.innerHTML = mensajeCancelar;
}

export const reinicarVariables = () => {
    nombre = new Date().getTime()
    id = nombre.toString().substring(nombre.toString().length - 6, nombre.toString().length)
    stopGeneral = "false";
    segundos = 0;
    iteradorLoader = 0;
    contadorGeneral = 1;
    maxPrediction = [];
    saveImages = [];
    canvas = null;
    loopInterno = null;
}

export const asignarValoresCircleProgress = () => {
    if (circleProgress) circleProgress.value = (0);
    const cir_prog_color = document.getElementsByClassName('circle-progress-value');
    if (cir_prog_color) cir_prog_color[0].setAttribute('style', 'stroke: #3498db');
}

/* Ciencia de datos */
export const cargarModelos = () => {
    return Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
    ]);
}
/*
export const guardarVideo = (blob) => {
    console.log("Guardando videos para entrenar modelo...")
    var myHeaders = new Headers();
    var formdata = new FormData();
    myHeaders.append("apikey", "i2MopevgEp2HSmOppDOR3MHUzT4SEZOi");
    myHeaders.append("Host", "api.devdicio.net");
    formdata.append("bucket", "dco-bucket-ciencia");
    formdata.append("folder", "model_14535_1/videos");
    formdata.append("uuid", "holaciencia");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata
    };

    let nom = resPrediction.includes('real') ? 'real' : (resPrediction.includes('rostro') ? 'spoof' : 'tiempo');
    formdata.append("file", blob, nom + "_" + id + "_" + nombre + ".mp4");

    axios("https://api.devdicio.net:8444/v1/sec_dev_file", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => {
            console.error("Error al guardar video en el server: " + error)
        });


}
*/
const play = async () => {
    svgBackground.style.background = "none";
    setMostrarSpinner(false);
    setDeshabilitarBotonCancelar(false);
    if (windowWidth >= 500) { windowWidth = 360; }
    //displaySize = { width: windowWidth, height: windowWidth };
    var errorShowView = [0, 0, 0, 0];
    getResponse({ mensaje: 'Reproduciendo streaming' });
    divMensaje.innerHTML = mensajeErrorCentro;
    var loop = async () => {
        var inputSizeModel = 320;
        detections = await faceapi.detectSingleFace(videoTag, new faceapi.TinyFaceDetectorOptions({ inputSize: inputSizeModel, scoreThreshold: Number.parseFloat(0.30) })).withFaceLandmarks()
            .withFaceDescriptor();
        if (detections !== undefined) {
            //Variables y calculos para calcular el rostro centrado
            // var circle = document.getElementById("circle");
            var areaEval = circle.getBoundingClientRect().width;//tamaño circulo transparente
            // var progressbsize = document.getElementById("progressb").clientWidth;
            // var progressbsize = progressBar.clientWidth;
            // var tamMargenArcLoader = parseInt((progressbsize - areaEval) / 2);
            // var tamMargenArcUpLoader = parseInt((windowWidth - areaEval) / 2);
            var orgX_tamW = parseInt(detections.detection._box._x + detections.detection._box._width);
            var orgy_tamh = parseInt(detections.detection._box._y + detections.detection._box._height);
            var val_mar_der;
            var val_mar_arr;
            var val_mar_izq;
            var val_mar_aba;
            if (windowWidth >= 500) {
                val_mar_der = detections.detection._box._x >= 27;
                val_mar_arr = (detections.detection._box._y) >= 27;
                val_mar_izq = orgX_tamW <= 334;
                val_mar_aba = orgy_tamh <= 334;
            } else {
                val_mar_der = detections.detection._box._x >= ((windowWidth - areaEval) / 2);
                val_mar_arr = (detections.detection._box._y) >= ((windowWidth - areaEval) / 2);
                val_mar_izq = orgX_tamW <= ((windowWidth - areaEval) / 2) + areaEval;
                val_mar_aba = orgy_tamh <= ((windowWidth - areaEval) / 2) + areaEval;
            }
            //Variables y calculos para medir lo cercano o lejano de un rostro frente a una pantalla
            var porcentajeCerca = ((areaEval * 25) / 100);
            var porcentajeLejos = ((areaEval * 43) / 100);
            var dmaxdistanceface = parseInt((Math.sqrt(Math.pow((areaEval - porcentajeCerca), 2) + Math.pow((areaEval - porcentajeCerca), 2))));
            var dmindistanceface = parseInt((Math.sqrt(Math.pow((areaEval - porcentajeLejos), 2) + Math.pow((areaEval - porcentajeLejos), 2))));
            var d_distanceface = parseInt((Math.sqrt(Math.pow((detections.detection._box._height), 2) + Math.pow((detections.detection._box._width), 2))));
            var val_face_cerca = d_distanceface >= dmaxdistanceface;
            var val_face_lejos = d_distanceface <= dmindistanceface;
            if (((val_face_cerca == false) && (val_face_lejos == false))) { //VALIDA QUE EL ROSTRO NO ESTE LEJOS O CERCA
                if (val_mar_der && val_mar_arr && val_mar_izq && val_mar_aba) { //VALIDACION OK PREDICE
                    iteradorLoader = 1 + iteradorLoader;
                    circleProgress.value = (iteradorLoader);
                    //console.log("Loop");
                    await predict();
                    if (iteradorLoader == 10) {
                        stopGeneral = "true";
                        obtienePrediccion();
                    }
                    if (iteradorLoader >= 10) {
                        stopGeneral = "true";
                        cancelAnimationFrame(loopInterno);
                        return;
                    }

                    //document.getElementById("mensaje").innerHTML = "Estable";
                } else { //VALIDA ERROR CENTRO 3 INTENTOS
                    //console.log("Error centro: " + errorShowView[0]);
                    errorShowView[0] = errorShowView[0] + 1;
                    if (errorShowView[0] == 3) {
                        circleProgress.value = (0);
                        divMensaje.innerHTML = mensajeErrorCentro;
                        // divCuadro.style.display = 'none';
                        // document.getElementById("mensaje").innerHTML = "Mueve tu rostro al <b>centro</b> del área circular";
                        iteradorLoader = 0;
                        maxPrediction = [];
                        errorShowView[0] = 0;
                    }
                }
            } else {
                if ((val_face_cerca)) { //VALIDA ERROR CERCA 3 INTENTOS
                    //console.log("Error cerca: " + errorShowView[1]);
                    errorShowView[1] = errorShowView[1] + 1;
                    if (errorShowView[1] == 3) {
                        circleProgress.value = (0);
                        iteradorLoader = 0;
                        divMensaje.innerHTML = mensajeErrorCerca;
                        // divCuadro.style.display = 'none';
                        // document.getElementById("mensaje").innerHTML = "Aleja tu rostro";
                        maxPrediction = [];
                        errorShowView[1] = 0;
                    }
                }
                if ((val_face_lejos)) { //VALIDA ERROR LEJOS 3 LEJOS
                    //console.log("Error lejos: " + errorShowView[2]);
                    errorShowView[2] = errorShowView[2] + 1;
                    if (errorShowView[2] == 3) {
                        circleProgress.value = (0);
                        iteradorLoader = 0;
                        divMensaje.innerHTML = mensajeErrorLejos;
                        // divCuadro.style.display = 'none';
                        // document.getElementById("mensaje").innerHTML = "Acerca tu rostro";
                        maxPrediction = [];
                        errorShowView[2] = 0;
                    }
                }
            }

        } else { //FACE_API NO DETECTA ROSTRO
            //console.log("Error No rostro: " + errorShowView[3]);
            errorShowView[3] = errorShowView[3] + 1;
            if (errorShowView[3] == 3) {
                // document.getElementById("mensaje").innerHTML = "Mueve tu rostro al <b>centro</b> del área circular";
                divMensaje.innerHTML = mensajeErrorCentro;
                // divCuadro.style.display = 'none';
                circleProgress.value = (0);
                iteradorLoader = 0;
                maxPrediction = [];
                errorShowView[3] = 0;
            }
        }


        contadorGeneral = contadorGeneral + 1;
        if (segundos >= tiempoAgotado) {
            cancelAnimationFrame(loopInterno);
            return;
        }

        if (!navigator.onLine) {
            cancelAnimationFrame(loopInterno);
            clearTimeout(tiempoEjecucionApp);
            restartVideo();
            getResponse({ mensaje: 'Error de red', error: "Sin acceso a internet" });
            return;
        }

        if (cancelarProceso) return;

        loopInterno = requestAnimationFrame(loop);
    };
    loopInterno = requestAnimationFrame(loop);

}

const startTimeApp = () => {
    tiempoEjecucionApp = setTimeout(startTimeApp, 1000);
    segundos = segundos + 1;
    if (10 == maxPrediction.length) {
        // console.log("Finalizo");
        cancelAnimationFrame(loopInterno);
        clearTimeout(tiempoEjecucionApp);
        videoTag.pause();
        return;
    }
    if (segundos == tiempoAgotado) {
        resPrediction = "Tiempo agotado";
        console.log("Excedio tiempo de validacion liveness General " + segundos);
        getResponse({ mensaje: 'Se excedio el tiempo' });
        setMostrarBotonCancelar(false);
        divMensaje.innerHTML = mensajeTiempo;
        // divCuadro.style.display = 'none';
        circleProgress.value = (0);
        cancelAnimationFrame(loopInterno);
        videoTag.pause();
    }
    if (stopGeneral === "true") {
        // console.log("Finalizo");
        cancelAnimationFrame(loopInterno);
        clearTimeout(tiempoEjecucionApp);
        videoTag.pause();
        return;
    }
    if (segundos >= tiempoAgotado) {
        cancelAnimationFrame(loopInterno);
        clearTimeout(tiempoEjecucionApp);
        return;
    }
    // console.log("Segundos:" + segundos);
}

const predict = async () => {
    // document.getElementById("mensaje").innerHTML = "Mantente <b>estable</b><p>Procesando</p>";
    divMensaje.innerHTML = mensajeEstable;
    // divCuadro.style.display = 'initial';
    //codigo para obtener img
    canvas = faceapi.createCanvasFromMedia(videoTag);
    // canvas.classList.add('canvas-liveness-interactivo-bimodel');
    if (windowWidth >= 500) {
        canvas.width = 360;
        canvas.height = 360;
        canvas.getContext("2d").drawImage(videoTag, 0, 0, 360, 360);
    } else {
        canvas.width = videoTag.videoWidth;
        canvas.height = videoTag.videoHeight;
        canvas.getContext("2d").drawImage(videoTag, 0, 0, videoTag.videoWidth, videoTag.videoHeight);
    }
    var dataURL = canvas.toDataURL();
    var base64String = dataURL.replace('data:image/png;base64,', "");
    try {
        rangoValue(detections.detection._box._height);
        var eyesBox;
        //console.log(face);

        const features = {
            jaw: detections.landmarks.positions.slice(0, 17),
            eyebrowLeft: detections.landmarks.positions.slice(17, 22),
            eyebrowRight: detections.landmarks.positions.slice(22, 27),
            noseBridge: detections.landmarks.positions.slice(27, 31),
            nose: detections.landmarks.positions.slice(31, 36),
            eyeLeft: detections.landmarks.positions.slice(36, 42),
            eyeRight: detections.landmarks.positions.slice(42, 48),
            lipOuter: detections.landmarks.positions.slice(48, 60),
            lipInner: detections.landmarks.positions.slice(60),
        };
        const eyeLeftBox = await getBoxFromPoints(features.eyeLeft);
        const eyeRightBox = await getBoxFromPoints(features.eyeRight);
        const eyebrowLeftBox = await getBoxFromPoints(features.eyebrowLeft);
        const eyebrowRightBox = await getBoxFromPoints(features.eyebrowRight);
        var cejaMayor;
        var ojoMayor;
        var calc_ojo_height;

        if (eyebrowLeftBox.top > eyebrowRightBox.top) { cejaMayor = eyebrowRightBox.top; } else { cejaMayor = eyebrowLeftBox.top; }
        if (eyeLeftBox.bottom < eyeRightBox.bottom) { ojoMayor = eyeRightBox.bottom; } else { ojoMayor = eyeLeftBox.bottom; }
        calc_ojo_height = ojoMayor - cejaMayor;
        eyesBox = {
            _x: detections.detection._box._x,
            _y: (cejaMayor),
            _width: detections.detection._box._width,
            _height: (calc_ojo_height + ajusteH)
        }
        await extractFaceFromBox(videoTag, eyesBox);
    } catch (error) {
        console.log("Hay un error ", error);
        // Definir mensaje que recibirá el front como retroalimentación
    }
    prediction = await predictClient(base64String, base64StringEyes);
    //console.log("prediccion esperada: ",prediction);
    //console.log("prediction: " + prediction[0].className + " score: " + prediction[0].score)
    maxPrediction.push({ "prediction": prediction[0].class, "score": prediction[0].score, "image": dataURL});
    // console.log({ "score": prediction[0].score, "image": dataURL })
    // saveImages.push({ "score": prediction[0].score, "image": dataURL })
    //console.log(maxPrediction.length);
}

const predictClient = async (base64, base64Eyes) => {

    const url_service_eyes = `${urlAmbiente}/v1/sec_${ambiente}bc_spoofing/prediction/classify/face/base64`;
    var formdata = new FormData();
    // var headers = new Headers();
    formdata.append("face", base64);
    formdata.append("eyes", base64Eyes);
    formdata.append("uuid", uuidCliente);
    formdata.append("transaccion", uuidTransaccion);
    formdata.append("event", "DataScience");
    const headers = {
        'apikey': apikey,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    // headers.append("apikey", apikey);
    // console.log('apikey', apikey);
    // headers.append("Content-Type", 'application/x-www-form-urlencoded');
    // var requestOptions = {
    //     method: 'POST',
    //     headers: headers,
    //     data: formdata
    // };
    // const axiosInstance = instance(url_service_eyes);

    // let responseSpoof =  await axiosInstance(requestOptions)
    let responseSpoof =  await predictionClient(url_service_eyes, headers, formdata)
        .then(async response => {
            if (!response.statusText === 'OK') {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson ? await response.data : null;
                const error = (data && data.message) || response.status;
                getResponse({ mensaje: 'Servicio de spoofing no disponible', error: error });
                restartVideo();
                cancelAnimationFrame(loopInterno);
                clearTimeout(tiempoEjecucionApp);
                setMostrarBotonCancelar(false)
                setMostrarBotonReiniciar(true)
            }
            return response.data

        })
        .then(result => responsePredict = result.payload)
        .catch(error => {
            console.log("Error al guardar imagen en el server: " + error );
            getResponse({ mensaje: 'Error en el servicio de spoofing', error: error });
            getResponse({ mensaje: 'Ocurrio algun error en el archivo', error: error });
            restartVideo();
            cancelAnimationFrame(loopInterno);
            clearTimeout(tiempoEjecucionApp);
            setMostrarBotonCancelar(false)
            setMostrarBotonReiniciar(true)
        });

    var body = await responseSpoof;
    return body;
}

const restartVideo = async () => {
    // if (tipo === 'servicio') divMensaje.innerHTML = mensajeErrorSpoof;
    // divCuadro.style.display = 'none';
    circleProgress.value = (0);
    videoTag.pause();
    var cir_prog_color = document.getElementsByClassName('circle-progress-value');
    cir_prog_color[0].setAttribute('style', 'stroke: #3498db');
    //$("canvas").remove();
    segundos = 0;
    iteradorLoader = 0;
    maxPrediction = [];
    saveImages = [];
}

const obtienePrediccion = () => {
    resultado = {}
    maxPrediction.forEach(el => (resultado[el.prediction] = resultado[el.prediction] + 1 || 1));
    //console.log("Resultado cantidad - ", maxPrediction.length);
    //console.log("::Resultado - ", resultado);
    arrayJsonPredict = [];

    var resultadoLiveness = "";
    if ("real" in resultado) {
        if (resultado["real"] <= 8) {
            maxPrediction.forEach(el => { if (el.prediction !== "real") { saveImages.push({ "score": el.score, "image": el.image, 'clase': el.prediction }) } });
            resultadoLiveness = "spoof";
        } else {
            maxPrediction.forEach(el => { if (el.prediction === "real") { saveImages.push({ "score": el.score, "image": el.image, 'clase': el.prediction }) } });
            resultadoLiveness = "real";
        }
    } else {
        maxPrediction.forEach(el => { if (el.prediction !== "real") { saveImages.push({ "score": el.score, "image": el.image, 'clase': el.prediction }) } });
        resultadoLiveness = "spoof";
    }

    imagesOrder = saveImages.sort(function (a, b) {
        if (a.score > b.score) {
            return -1;
        }
    });

    const colorBordeCirculo = document.getElementsByClassName('circle-progress-value');
    setMostrarBotonCancelar(false);

    if (resultadoLiveness === "real") {
        colorBordeCirculo[0].setAttribute('style', 'stroke: #6DD400');
        setMostrarSpinner(true);
        resPrediction = "real";
        divMensaje.innerHTML = mensajeReal;
        // divCuadro.style.display = 'none';
        setRespuestaFinal('Persona real')
        //mediaRecorder.stop();
        //aqui se guarda imagen de mejor frame
        enviarRespuestaFinal('real');
        guardarImagen(imagesOrder[0].image, 'real');


    } else {
        resPrediction = "spoof";
        colorBordeCirculo[0].setAttribute('style', 'stroke: #FF0000');
        divMensaje.innerHTML = mensajeSpoof;
        // divCuadro.style.display = 'none';
        setRespuestaFinal('No se detectó rostro válido')
        enviarRespuestaFinal('spoof');
        guardarImagen(imagesOrder[0].image, 'spoof')
        //mediaRecorder.stop();
    }

}

/* const ordenaImagenes = async (folder) => {
    console.log("Guardando imagen...");
    //ordenamos de mayor  a menor score
    imagesOrder = saveImages.sort(function (a, b) {
        if (a.score > b.score) {
            return -1;
        }
    });
    enviarRespuestaFinal(folder);
    guardarImagen(imagesOrder[0].image, folder);
} */

const guardarImagen = async (img, folder) => {
    const URL_guardar_img = `${urlAmbiente}/v1/${ambiente}webhook_workflows/webhook/d_base64_file`;
    var myHeaders = new Headers();
    var formdata = new FormData();
    myHeaders.append("apikey", apikey);
    myHeaders.append("Host", host);
    formdata.append("bucket", contenedor);
    if (folder == 'real') {
        formdata.append("folder", "bimodel/" + imageFolderReal + "/mejorFrame_real");
    } else {
        formdata.append("folder", "bimodel/" + imageFolderSpoof + "/imagesTraining");
    }

    formdata.append("uuid", "holaciencia");
    let nom = (resPrediction === 'real' ? 'real' : (resPrediction === 'spoof' ? 'spoof' : 'timeout')) + '_' + id + '_' + nombre;
    formdata.append("file", img);
    formdata.append("filename", nom);

    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: formdata
    // };

    await guardarImagenBase64(URL_guardar_img, myHeaders, formdata)
    .then(result => console.log("Se guardo exitosamente la imagen", result))
    .catch(error => {
        getResponse({ mensaje: 'Error en el servicio de guardar imagen', error: error });
        console.error("Error al guardar imagen en el server: " + error)
    });

    // await axiosInstance(requestOptions)
    //     .then(response => response.text())
    //     // .then(result => console.log("Se guardo exitosamente la imagen"))
    //     .catch(error => {
    //         getResponse({ mensaje: 'Error en el servicio de guardar imagen', error: error });
    //         console.error("Error al guardar imagen en el server: " + error)
    //     });

    // await fetch(url_service_base64, requestOptions)
    //     .then(response => response.text())
    //     // .then(result => console.log("Se guardo exitosamente la imagen"))
    //     .catch(error => {
    //         getResponse({ mensaje: 'Error en el servicio de guardar imagen', error: error });
    //         console.error("Error al guardar imagen en el server: " + error)
    //     });

}

const rangoValue = async (sizeFace) => {
    if (sizeFace >= 80 && sizeFace <= 199) {
        //console.log("Rango de 100");
        ajusteY = 15;
        ajusteH = 10;
        //return 100;
    }
    if (sizeFace >= 200 && sizeFace <= 299) {
        //console.log("Rango de 200");
        ajusteY = 25;
        ajusteH = 20;
        //return 200;
    }
    if (sizeFace >= 300 && sizeFace <= 399) {
        //console.log("Rango de 300");
        ajusteY = 40;
        ajusteH = 30;
        //return 300;
    }
    if (sizeFace >= 400 && sizeFace <= 499) {
        //console.log("Rango de 400");
        ajusteY = 45;
        ajusteH = 40;
        //return 400;
    }
    if (sizeFace >= 500 && sizeFace <= 599) {
        //console.log("Rango de 500");
        ajusteY = 60;
        ajusteH = 50;
        //return 500;
    }
    if (sizeFace >= 600 && sizeFace <= 699) {
        //console.log("Rango de 600");
        ajusteY = 70;
        ajusteH = 60;
        //return 600;
    }
    if (sizeFace >= 700 && sizeFace <= 799) {
        //console.log("Rango de 700");
        ajusteY = 80;
        ajusteH = 70;
        //return 700;
    }
    if (sizeFace >= 800 && sizeFace <= 899) {
        //console.log("Rango de 800");
        ajusteY = 95;
        ajusteH = 80;
        //return 800;
    }
    if (sizeFace >= 900 && sizeFace <= 1000) {
        //console.log("Rango de 900");
        ajusteY = 110;
        ajusteH = 90;
        //return 900;
    }
}

const getBoxFromPoints = async (points) => {
    const box = {
        bottom: -Infinity,
        left: Infinity,
        right: -Infinity,
        top: Infinity,

        get center() {
            return {
                x: this.left + this.width / 2,
                y: this.top + this.height / 2,
            };
        },

        get height() {
            return this.bottom - this.top;
        },

        get width() {
            return this.right - this.left;
        },
    };

    for (const point of points) {
        box.left = Math.min(box.left, point.x);
        box.right = Math.max(box.right, point.x);

        box.bottom = Math.max(box.bottom, point.y);
        box.top = Math.min(box.top, point.y);
    }

    return box;
}

const extractFaceFromBox = async (imageRef, box) => {
    //console.log(box);
    const regionsToExtract = [
        new faceapi.Rect(box._x, box._y, box._width, box._height)
    ];
    let faceImages = await faceapi.extractFaces(imageRef, regionsToExtract);

    if (faceImages.length === 0) {
        console.log("No face found");
    } else {
        const outputImage = "";
        faceImages.forEach(async (cnv) => {
            //console.log(cnv);
            //const buffer = cnv.toBuffer("image/jpeg");
            //fs.writeFileSync(pathFinal+path.basename(imageCrop), buffer);
            //outputImage.src = cnv.toDataURL();
            //console.log(cnv.toDataURL());
            base64StringEyes = cnv.toDataURL().replace(/data:*.*,/, "");
            //await servicioEyes(cnv.toDataURL().replace(/data:*.*,/,""),imageCrop)
        });
        // setPic(faceImages.toDataUrl);
        //console.log("face found ");
    }
}

export const playVideo2 = () => {
    // console.log("Reiniciar Proceso")
    setMostrarBotonCancelar(true);
    setDeshabilitarBotonCancelar(false);
    cancelarProceso = false;
    nombre = new Date().getTime()
    id = nombre.toString().substring(nombre.toString().length - 6, nombre.toString().length)
    stopGeneral = "false";
    segundos = 0;
    iteradorLoader = 0;
    maxPrediction = [];
    saveImages = [];
    videoTag.play();
    const cir_prog_color = document.getElementsByClassName('circle-progress-value');
    if (cir_prog_color) cir_prog_color[0].setAttribute('style', 'stroke: #3498db');
}

export const playVideo = () => {
    videoTag.play();
    setDeshabilitarBotonReiniciar(false);
}

export const stopLoop = () => {
    cancelAnimationFrame(loopInterno);
    clearTimeout(tiempoEjecucionApp);
    restartVideo();
    return;
    // console.log("StopLoop")
}
