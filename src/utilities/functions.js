import { guardarImagen } from "./data";
import { mapearError } from "./map_response";

export const appendScript = (scriptToAppend) => {
    const script = document.createElement('script');
    script.src = scriptToAppend;
    script.async = true;
    document.head.appendChild(script);
}

export const toggleFullScreen = () => {
    if (
        document.fullscreenElement || /* Standard syntax */
        document.webkitFullscreenElement || /* Safari and Opera syntax */
        document.msFullscreenElement /* IE11 syntax */
    ) {
        console.log('Lo soporta');
    } else {
        console.log('NO Lo soporta');
    }
}

export const validarVideo = (stateVideo) => {
    if (stateVideo) {
        return '';
    } else {
        return 'stop';
    }
}

export const obtenerPrediccion = async (
    maxPrediction,
    imagenes,
    setMostrarBotonCancelar,
    setTextoMensaje,
    setRespuestaFinal,
    getResponse,
    getImage,
    mediaRecorder,
    videoTag,
    spinner,
    uuidCliente,
    uuidTransaccion,
    uuidOtorgante,
    apikey,
    bucket,
    imageFolderReal,
    imageFolderSpoof,
    environment,
    urlEnvironment,
    respuestaPrediccion,
) => {
    const resultado = {};
    let folder = '', nombreImagen = '';
    const fechaTime = new Date().getTime();

    maxPrediction.forEach(valor => (resultado[valor] = resultado[valor] + 1 || 1));

    const arregloPrediccionOrdenanda = Object.keys(resultado).map((key) => {
        return ({ 'clase': key, 'value': resultado[key] });
    }).sort((a, b) => {
        if (a.value > b.value) {
            return -1
        }
    });

    setMostrarBotonCancelar(false);

    console.log(arregloPrediccionOrdenanda[0].clase);
    const colorBordeCirculo = document.getElementsByClassName('circle-progress-value');
    if (arregloPrediccionOrdenanda[0].clase === 'real') {
        colorBordeCirculo[0].setAttribute('style', 'stroke: #6DD400');
        spinner.setAttribute('style', 'z-index: 5');
        getResponse({ mensaje: 'Persona real', clase: arregloPrediccionOrdenanda[0].clase, score: ordenarArreglo(imagenes, 'score')[0].score });
        getImage({ imagen: ordenarArreglo(imagenes, 'score')[0].image });
        setTextoMensaje('real');
        folder = imageFolderReal;
        respuestaPrediccion = 'Persona real';
        setRespuestaFinal( 'Persona real')
        mediaRecorder.stop();
        videoTag.pause();
    } else {
        colorBordeCirculo[0].setAttribute('style', 'stroke: #FF0000');
        getResponse({ mensaje: 'No se detectó rostro válido', clase: arregloPrediccionOrdenanda[0].clase, score: ordenarArreglo(imagenes, 'score')[0].score });
        setTextoMensaje('spoof');
        folder = imageFolderSpoof;
        respuestaPrediccion = 'No se detectó rostro válido';
        setRespuestaFinal('No se detectó rostro válido');
        mediaRecorder.stop();
        videoTag.pause();
    }
    try {
        nombreImagen = `${respuestaPrediccion.includes('real') ? 'real' : (respuestaPrediccion.includes('rostro') ? 'spoof' : 'tiempo')}_${fechaTime}`;
        const response = await guardarImagen(uuidCliente, uuidTransaccion, uuidOtorgante, apikey, bucket, folder, ordenarArreglo(imagenes, 'score')[0].image, nombreImagen, environment, urlEnvironment);
        // console.log('RESPONSE', response);
    } catch (error) {
        getResponse({ mensaje: 'Error al guardar imagen en el server', error: mapearError(error) });
    }

}

export const ordenarArreglo = (arreglo, parametro) => {
    const arregloOrdenado = arreglo.sort((a, b) => {
        if (a[parametro] > b[parametro]) {
            return -1;
        }
    });
    return arregloOrdenado;
}