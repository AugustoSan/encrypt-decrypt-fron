import React from 'react';

const Spinner = ({ refSpinner }) => {
    return (
        <>
            <div ref={refSpinner} className='back-spinner-liveness-interactivo-bimodel'>
                <div className="ispinner-liveness-interactivo-bimodel ispinner-large">
                    <div className="ispinner-blade"></div>
                    <div className="ispinner-blade"></div>
                    <div className="ispinner-blade"></div>
                    <div className="ispinner-blade"></div>
                    <div className="ispinner-blade"></div>
                    <div className="ispinner-blade"></div>
                    <div className="ispinner-blade"></div>
                    <div className="ispinner-blade"></div>
                </div>

            </div>
        </>
    );
}

export default Spinner;
