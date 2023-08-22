/* eslint-disable no-unused-vars */
import axios from 'axios';
import { decrypt, encrypt } from './cipher';
import generateHashAndSign from '../utilities/imageHash';

// Aqui requerimos que nos pasen los valores de las variables
// const protocol = 'https';
// const host = 'api.devdicio.net';
// const host = 'api.qadicio.net';


// El siguiente objeto lo comente porque marca error no se usa
// const endpoints = {
//     // base64File: `${host}/v1/${servicio}webhook_workflows/webhook/base64_file`,
// };

// Funciones para Interceptor de solicitudes
const interceptorRequest = async (config) => {     
  console.log("Entre al middleware de salida.");
  
  const formData = new FormData();  
  const formDataEntries = [
    ...config.data.entries()
  ];
  
  for (const [, value] of Object.entries(formDataEntries)) {        
    const [param, valor] = [...value];
    
    // Asegurarse de que el valor sea una cadena antes de encriptar
    if(['face','eyes', 'file'].includes(param)){      
      
      const hash = await generateHashAndSign(valor);
            
      const hashEncrypt = await encrypt(String(hash));
      
      formData.append(param, valor);
      formData.append(`${param}Hash`, hashEncrypt);      
    }
    else{
      formData.append(param, await encrypt(String(valor)));
    }
  }

  config.data = formData;
  return Promise.resolve(config);
};

const interceptorResponse = async (response) => {

  //TODO:  Recorrer respuesta y decriptar todo 
  try {
    console.log("entre al middleware de entrada.")
    const data = response.data;
    const decryptedData = await decrypt(data);
    console.log('decryptedData: ', decryptedData);
    response.data = JSON.parse(decryptedData);
    return Promise.resolve(response);
  } catch (error) {
    console.log('error: ', error);
    return Promise.resolve(response);
  }
};

// Funciones para errores en interceptores
const interceptorError = (error) => {
  // Manejar los errores en la solicitud aquí
  return Promise.reject(error);
}

/* Guardar imagen base64 */
export const guardarImagenBase64 = (baseURL, headers, data) => {
  const instance = axios.create({ baseURL});
  // Aqui van los middlawares
  instance.interceptors.request.use(interceptorRequest, interceptorError);
  instance.interceptors.response.use(interceptorResponse, interceptorError);
  return instance({
        method: 'POST',
        headers: headers,
        data: data
    });
}

/* Guardar imagen base64 */
export const predictionClient = (baseURL, headers, data) => {
  const instance = axios.create({ baseURL});
  // Aqui van los middlawares
  instance.interceptors.request.use(interceptorRequest, interceptorError);
  instance.interceptors.response.use(interceptorResponse, interceptorError);
  return instance({
        method: 'POST',
        headers: headers,
        data: data
    });
}