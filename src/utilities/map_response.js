export const mapearRespuesta = (status, data) => {
    let objetoRespuesta = {};
    objetoRespuesta.status = status;
    objetoRespuesta.data = data;
    return objetoRespuesta;
}

export const mapearError = (error) => {
    let objetoError = {};
    if (error.response) {
        const { data, status } = error.response;
        objetoError.status = status;
        objetoError.data = data;
        objetoError.tipo = 'RESPONSE';
    } else if (error.request) {
        objetoError.error = error.message ? error.message : error.toString();
        objetoError.tipo = 'REQUEST';
    } else {
        objetoError.error = error.message;
        objetoError.tipo = 'EXCEPTION';
    }
    return objetoError;
}