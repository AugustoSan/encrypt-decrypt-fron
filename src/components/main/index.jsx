/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
/* Componentes */
import Screen from '../elementos/screen'
/* Funciones */
import { agregarListeners } from '../../utilities/listeners'
import { setVariablesKMS, instanceKMS } from '../../services/cipher';

// import { toggleFullScreen } from '../../utilities/functions'
/* Script ciencia de datos */
import { cargarModelos, asignarVariable, playVideo, stopLoop, playVideo2, cancelar, reinicarVariables, asignarValoresCircleProgress } from '../../ciencia_de_datos/script';

import '../../js/general/circle-progress.min.js'
import '../../js/general/bootstrap.bundle.min.js'
import '../../js/general//bootstrap.min.js'
import '../../js/general/popper.min.js'

let windowWidth = window.innerWidth
let diametroProgressBar = ((75 * windowWidth) / 100)
let videoTag

agregarListeners()

const Index = forwardRef(({
    uuidTransaction,
    uuidClient,
    uuidOtorgante,
    apikey,
    environment,
    urlEnvironment,
    bucket,
    host,
    getErrorPermissions,
    getResponse,
    getImage,
    videoFolder,
    imageFolderReal,
    imageFolderSpoof,
    KMSkeyId,
    KMSaccessKeyId,
    KMSsecretAccessKey,
    KMSregion,
    firstMessage = '<p><b>Espera</b>, estamos preparando tu cámara para iniciar</p>',
    centerErrorMessage = '<p>Muy bien, <b>acerca</b> tu <b>rostro</b> al centro de la toma</p>',
    farAwayErrorMessage = '<p><b>Acércate</b> un poco del <b>centro</b> de la toma</p>',
    nearErrorMessage = '<p><b>Aléjate</b> un poco del <b>centro</b> de la toma</p>',
    stableMessage = `<p>Mantente <b>estable</b></p>`,
    mensajeErrorSpoof = `<p>Lo sentimos ocurrió un<br />error en la aplicación</p>`,
    realMessage = '<p>Procesando, gracias por tu <b>paciencia</b></p>',
    spoofMessage = '<p>No se detectó un rostro válido</p>',
    timeMessage = '<p>No se detectó un rostro válido</p>',
    cancelMessage = '<p>Proceso cancelado</p>',
    textCancelButton = 'CANCELAR',
}, ref) => {

    /* Hooks */
    const [mostrarSpinner, setMostrarSpinner] = useState(true)
    const [mostrarScreen, setMostrarScreen] = useState(true)
    const [mostrarBotonCancelar, setMostrarBotonCancelar] = useState(true)
    const [mostrarBotonReiniciar, setMostrarBotonReiniciar] = useState(false)
    const [deshabilitarBotonReiniciar, setDeshabilitarBotonReiniciar] = useState(false)
    const [deshabilitarBotonCancelar, setDeshabilitarBotonCancelar] = useState(true)
    const [respuestaFinal, setRespuestaFinal] = useState('')
    /* Referencias */
    const refVideo = useRef(null)
    const refInfo = useRef(null)
    const refSvg = useRef(null)
    const refScreen = useRef(null)
    const refProgressBar = useRef(null)
    const refCircle = useRef(null)
    const refCircleProgress = useRef(null)
    const refClassCircleProgress = useRef(null)
    const refSpinner = useRef(null)
    const refMessage = useRef(null)
    // const refDivCuadro = useRef(null)

    useImperativeHandle(ref, () => ({
        reiniciarProceso() {
            playVideo2()
        },
        cancelarProceso() {
            cancelar()
            stopLoop()
            setDeshabilitarBotonCancelar(true)
        },
        detenerVideo() {
            detenerStreaming()
        },
        async reiniciarVideo() {
            await reiniciarStreaming()
        },
        async cargarModelos() {
            await cargarModelosFaceApi()
        }
    }))

    useEffect(() => {
        if (refVideo.current) videoTag = refVideo.current
    }, [refVideo.current])

    useEffect(() => {
        setVariablesKMS(KMSkeyId, 'KMSkeyId')
        instanceKMS();
    }, [KMSkeyId])

    useEffect(() => {
        setVariablesKMS(KMSaccessKeyId, 'KMSaccessKeyId')
        instanceKMS();
    }, [KMSaccessKeyId])

    useEffect(() => {
        setVariablesKMS(KMSsecretAccessKey, 'KMSsecretAccessKey')
        instanceKMS();
    }, [KMSsecretAccessKey])

    useEffect(() => {
        setVariablesKMS(KMSregion, 'KMSregion')
        instanceKMS();
    }, [KMSregion])

    useEffect(() => {
        asignarVariable(apikey, 'apikey')
    }, [apikey])

    useEffect(() => {
        asignarVariable(uuidOtorgante, 'uuidOtorgante')
    }, [uuidOtorgante])

    useEffect(() => {
        asignarVariable(uuidTransaction, 'uuidTransaccion')
    }, [uuidTransaction])

    useEffect(() => {
        asignarVariable(uuidClient, 'uuidCliente')
    }, [uuidClient])

    useEffect(() => {
        asignarVariable(urlEnvironment, 'url_ambiente')
    }, [urlEnvironment])

    useEffect(() => {
        asignarVariable(environment, 'ambiente')
    }, [environment])

    useEffect(() => {
        asignarVariable(bucket, 'contenedor')
    }, [bucket])

    useEffect(() => {
        asignarVariable(host, 'host')
    }, [host])

    useEffect(() => {
        asignarVariable(videoFolder, 'video_folder')
    }, [videoFolder])

    useEffect(() => {
        asignarVariable(imageFolderReal, 'imagen_folder_real')
    }, [imageFolderReal])

    useEffect(() => {
        asignarVariable(imageFolderSpoof, 'imagen_folder_spoof')
    }, [imageFolderSpoof])

    useEffect(() => {
        asignarVariable(getResponse, 'response')
    }, [getResponse])

    useEffect(() => {
        asignarVariable(getImage, 'get_image')
    }, [getImage])

    useEffect(() => {
        asignarVariable(centerErrorMessage, 'mensaje_error_centro')
    }, [centerErrorMessage])

    useEffect(() => {
        asignarVariable(nearErrorMessage, 'mensaje_error_cerca')
    }, [nearErrorMessage])

    useEffect(() => {
        asignarVariable(farAwayErrorMessage, 'mensaje_error_lejos')
    }, [farAwayErrorMessage])

    useEffect(() => {
        asignarVariable(stableMessage, 'mensaje_estable')
    }, [stableMessage])

    useEffect(() => {
        asignarVariable(mensajeErrorSpoof, 'mensaje_error_servicio_spoof')
    }, [mensajeErrorSpoof])

    useEffect(() => {
        asignarVariable(realMessage, 'mensaje_real')
    }, [realMessage])

    useEffect(() => {
        asignarVariable(spoofMessage, 'mensaje_spoof')
    }, [spoofMessage])

    useEffect(() => {
        asignarVariable(timeMessage, 'mensaje_tiempo')
    }, [timeMessage])

    useEffect(() => {
        asignarVariable(cancelMessage, 'mensaje_cancelar')
    }, [cancelMessage])

    useEffect(() => {
        // toggleFullScreen()
        cargarModelosFaceApi()

        asignarVariable(setMostrarBotonCancelar, 'mostrar_boton_cancelar')
        asignarVariable(setMostrarBotonReiniciar, 'mostrar_boton_reiniciar')
        asignarVariable(setRespuestaFinal, 'respuesta_final')
        asignarVariable(setMostrarSpinner, 'spinner')
        asignarVariable(setDeshabilitarBotonReiniciar, 'deshabilitar_boton_reiniciar')
        asignarVariable(setDeshabilitarBotonCancelar, 'deshabilitar_boton_cancelar')
        // asignarVariable(refDivCuadro.current, 'div_cuadro')
        asignarVariable(false, 'bandera_cancelar_proceso')

        return () => {
            windowWidth = window.innerWidth
            diametroProgressBar = ((75 * windowWidth) / 100)
            const mediaStream = videoTag.srcObject
            if (mediaStream) mediaStream.getTracks().forEach(track => track.stop())
            reinicarVariables()
        }
    }, [])

    useEffect(() => {
        if (refProgressBar.current && mostrarScreen) {
            asignarVariable(refMessage.current, 'mensaje')
            asignarVariable(refSvg.current, 'svg')
            refMessage.current.innerHTML = firstMessage
            asignarVariable(refProgressBar.current, 'progressBar')
            asignarVariable(refCircle.current, 'circle')
            // eslint-disable-next-line no-undef
            refCircleProgress.current = new CircleProgress(refProgressBar.current, {
                max: 10,
                value: 0,
                textFormat: 'none',
            })
            if (refCircleProgress.current) asignarVariable(refCircleProgress.current, 'circleProgress')
            asignarValoresCircleProgress()
            if (windowWidth >= 500) {
                diametroProgressBar = 360
                refProgressBar.current.style.width = `${diametroProgressBar}px`
                refProgressBar.current.style.height = `${diametroProgressBar}px`
                refClassCircleProgress.current = document.getElementsByClassName('circle-progress')[0]
                refClassCircleProgress.current.style.width = `${diametroProgressBar}px`
                refClassCircleProgress.current.style.height = `${diametroProgressBar}px`
            } else {
                refProgressBar.current.style.width = `${diametroProgressBar}px`
                refProgressBar.current.style.height = `${diametroProgressBar}px`
                refClassCircleProgress.current = document.getElementsByClassName('circle-progress')[0]
                refClassCircleProgress.current.style.width = `${diametroProgressBar}px`
                refClassCircleProgress.current.style.height = `${diametroProgressBar}px`
                refSvg.current.style.backgroundSize = `${diametroProgressBar - 42}px`
            }

        }
        if (refVideo.current) {
            asignarVariable(refVideo.current, 'video')
        }
    }, [mostrarScreen])

    const startVideo = async () => {
        let videoWidth = windowWidth
        if (windowWidth >= 500) {
            videoWidth = 360
            if (refVideo.current) {
                refVideo.current.style.width = `360px`
                refVideo.current.style.height = `360px`
            }
            if (refSvg.current) {
                refSvg.current.style.width = '480px'
                refSvg.current.style.height = '484px'
            }
        } else {
            if (refVideo.current) {
                refVideo.current.style.width = `${windowWidth}px`
                refVideo.current.style.height = `${windowWidth - 2}px`
            }
            if (refSvg.current) {
                refSvg.current.style.width = `${windowWidth}px`
                refSvg.current.style.height = `${windowWidth + 4}px`
            }

        }

        const constraints = {
            video: {
                width: windowWidth,
                height: windowWidth,
                facingMode: 'user'
            },
            audio: false
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
            setMostrarSpinner(false)

            if (refVideo.current) {
                refVideo.current.srcObject = mediaStream
            }

            refVideo.current.style.display = 'initial'

        } catch (error) {
            handleErrorGeUserMedia(error)
            // throw error
        }
    }

    const cancelarProceso = () => {
        cancelar()
        stopLoop()
        setDeshabilitarBotonCancelar(true)
        getResponse({ mensaje: 'Cancelar' })
    }

    const handleErrorGeUserMedia = (error) => {
        if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
            //required track is missing 
            getErrorPermissions({ 'error': error.name, status: 'NO SE ENCONTRO DISPOSITIVO Y/O TRACK' })
        } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
            //webcam or mic are already in use 
            getErrorPermissions({ 'error': error.name, status: 'LOS DISPOSITVOS SOLICITADOS ESTÁN EN USO' })
        } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
            //constraints can not be satisfied by avb. devices 
            getErrorPermissions({ 'error': error.name, status: 'EL DISPOSITIVO NO PUEDE ALCANZAR LOS CONSTRAINTS' })
        } else if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
            //permission denied in browser 
            getErrorPermissions({ 'error': error.name, status: 'PERMISOS DENEGADOS' })
        } else if (error.name === "TypeError" || error.name === "TypeError") {
            //empty constraints object 
            getErrorPermissions({ 'error': error.name, status: 'CONSTRAINTS VACÍOS' })
        } else {
            //other errors 
            getErrorPermissions({ 'error': error.toString(), status: 'OTRO TIPO DE ERROR' })
        }
    }

    const cargarModelosFaceApi = async () => {
        try {
            await cargarModelos()
            setMostrarScreen(true)
            startVideo()
        } catch (error) {
            console.error('Falló la carga del modelo: ' + error)
            getResponse({ mensaje: 'Falló la carga del modelo', error: error.toString() })
        }
    }

    const reiniciar = () => {
        // console.log("Reiniciar proceso")
        setDeshabilitarBotonReiniciar(true)
        playVideo()
    }

    const detenerStreaming = () => {
        if (refVideo?.current?.srcObject) {
            refVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.readyState === 'live' && track.kind === 'video') {
                    track.stop()
                }
            })
        }
    }

    const reiniciarStreaming = async () => {
        let videoWidth = windowWidth
        let mediaStream;
        if (windowWidth >= 500) {
            videoWidth = 360
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: videoWidth,
                        height: videoWidth,
                        facingMode: 'user'
                    },
                    audio: false
                })

                setMostrarSpinner(false)

                if (refVideo.current) {
                    refVideo.current.srcObject = mediaStream
                }

                refVideo.current.style.display = 'initial'

            } catch (error) {
                handleErrorGeUserMedia(error)
                // throw error
            }

        } else {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: videoWidth,
                        height: videoWidth,
                        facingMode: 'user'
                    },
                    audio: false
                })

                setMostrarSpinner(false)

                if (refVideo.current) {
                    refVideo.current.srcObject = mediaStream
                }

                refVideo.current.style.display = 'initial'

            } catch (error) {
                handleErrorGeUserMedia(error)
                // throw error
            }
        }

    }

    return (
        <>
            <div className='main_container-liveness-interactivo-bimodel'>
                {mostrarScreen &&
                    <Screen
                        deshabilitarBotonReiniciar={deshabilitarBotonReiniciar}
                        deshabilitarBotonCancelar={deshabilitarBotonCancelar}
                        textoBotonCancelar={textCancelButton}
                        mostrarBotonCancelar={mostrarBotonCancelar}
                        mostrarBotonReiniciar={mostrarBotonReiniciar}
                        mostrarSpinner={mostrarSpinner}
                        refVideo={refVideo}
                        refInfo={refInfo}
                        refSvg={refSvg}
                        refScreen={refScreen}
                        refProgressBar={refProgressBar}
                        refCircle={refCircle}
                        refSpinner={refSpinner}
                        refMessage={refMessage}
                        cancelarProceso={cancelarProceso}
                        reiniciarProceso={reiniciar}
                    />}
                {/* <div ref={refDivCuadro} className='sprite-cuadro-liveness-interactivo-bimodel animado-liveness-interactivo-bimodel' /> */}
            </div>
        </>
    )
})

export default Index;
