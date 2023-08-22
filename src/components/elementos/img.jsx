import React from 'react';

const ImgProcess = ({src, className='', refImgProcess=null}) => {
    return (
        <>
            <img ref={refImgProcess} src={src} className={className} alt=''/>
        </>
    );
}

export default ImgProcess;
