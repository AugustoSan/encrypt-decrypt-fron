import React from 'react'
/* Componentes */
import Img from '../elementos/img'
/* Imágenes */
import Warnign from '../../assets/warning.png'

const Imcompatible = ({ texto = '' }) => {
    return (
        <>
            <div id='device'>
                <h3 id='textDevice'>{texto}</h3>
                <br /><br />
                <Img src={Warnign} className='img-alert-liveness-interactivo-bimodel' alt='' />
            </div>
        </>
    );
}

export default Imcompatible;
