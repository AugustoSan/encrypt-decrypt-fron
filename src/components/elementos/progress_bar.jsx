import React from 'react';

const ProgressBar = ({refProgressBar}) => {
    return (
        <>
            <div id='progressb' ref={refProgressBar} className='progressb-liveness-interactivo-bimodel'></div>
        </>
    );
}

export default ProgressBar;
