import { guardarArchivo, guardarImagenBase64 } from '../services/api'

export const guardarImagen = (
    uuidCliente,
    uuidTransaccion,
    uuidOtorgante,
    apikey,
    bucket,
    folder,
    imagen,
    nombreImagen,
    environment,
    urlEnvironment,
) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'apikey': apikey,
    };

    const formData = new FormData();

    formData.append('bucket', bucket);
    formData.append('folder', `${uuidOtorgante}/${uuidCliente}/${uuidTransaccion}/${folder}`);
    formData.append('uuid', uuidCliente);
    formData.append("file", imagen);
    formData.append("filename", nombreImagen);

    return guardarImagenBase64(headers, formData, environment, urlEnvironment);
}

export const guardarVideo = (
    uuidCliente,
    uuidTransaccion,
    uuidOtorgante,
    apikey,
    bucket,
    folder,
    video,
    nombreVideo,
    environment,
    urlEnvironment,
) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'apikey': apikey,
        'cliente': uuidCliente,
        'transaccion': uuidTransaccion
    };

    const formData = new FormData();

    formData.append('bucket', bucket);
    formData.append('folder', `${uuidOtorgante}/${uuidCliente}/${uuidTransaccion}/${folder}`);
    formData.append('uuid', uuidCliente);
    const fechaTime = new Date().getTime();
    formData.append("file", video, nombreVideo + "_" + uuidTransaccion + "_" + fechaTime + ".mp4");

    return guardarArchivo(headers, formData, environment, urlEnvironment);
}