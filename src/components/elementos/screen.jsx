import React from 'react'
/* Componentes */
import ProgressBar from './progress_bar'
import Spinner from './spinner';

const Screen = ({
    // texto,
    // textresultado,
    // uuid,
    // mostrarInformacion,
    // deshabilitarBoton,
    deshabilitarBotonCancelar,
    // deshabilitarBotonReiniciar,
    mostrarBotonCancelar,
    // mostrarBotonReiniciar,
    mostrarSpinner,
    refSvg,
    refVideo,
    // refInfo,
    refScreen,
    refProgressBar,
    refCircle,
    refSpinner,
    refMessage,
    cancelarProceso,
    textoBotonCancelar,
    // reiniciarProceso,
}) => {

    return (
        <>
            <div ref={refScreen} className='container-flex-liveness-interactivo-bimodel'>
                <div className='instruction-container-liveness-interactivo-bimodel'>
                    <div className='instruction-liveness-interactivo-bimodel' ref={refMessage}>
                        {/* {texto} */}
                    </div>
                </div>
                <div className='mask-container-liveness-interactivo-bimodel'>
                    <video id='video-liveness-interactivo-bimodel' ref={refVideo} className='videoRef-liveness-interactivo-bimodel' style={{ display: 'none' }} autoPlay='1' playsInline='1' muted ></video>
                    <ProgressBar refProgressBar={refProgressBar} />
                    <svg className='background-svg-liveness-interactivo-bimodel' ref={refSvg} viewBox='0 0 100 100' width='100%'>
                        <defs>
                            <mask id='mask' x='0' y='0' width='180' height='180'>
                                <rect x='0' y='0' width='150' height='180' fill='#fff'></rect>
                                <circle ref={refCircle} cx='50' cy='50' r='32'></circle>
                            </mask>
                        </defs>
                        <rect x='0' y='0' width='100' height='102' mask='url(#mask)' fillOpacity={1}></rect>
                    </svg>
                    {mostrarSpinner && <Spinner refSpinner={refSpinner} />}
                </div>
                <div className='buttons-container-liveness-interactivo-bimodel'>
                    {mostrarBotonCancelar && <button type='button' className='button-cancelar-liveness-interactivo-bimodel' disabled={deshabilitarBotonCancelar} onClick={cancelarProceso}>{textoBotonCancelar}</button>}
                    {/* {mostrarBotonReiniciar && <button type='button' className='button-cancelar-liveness-interactivo-bimodel' disabled={deshabilitarBotonReiniciar} onClick={reiniciarProceso}>REINICIAR</button>} */}
                </div>
            </div>
        </>
    );
}

export default Screen;
