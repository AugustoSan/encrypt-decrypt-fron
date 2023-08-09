// api.tsx

import axios from 'axios';
import { encryptFile } from '../cifrado/cipher';

if (!process.env.REACT_APP_AWS_KEY_ID)  throw new Error('No defined REACT_APP_AWS_KEY_ID');

const keyId = process.env.REACT_APP_AWS_KEY_ID;
const baseURL = process.env.URL_API ?? 'http://localhost:4000/';
console.log("🚀 ~ file: axios.ts:10 ~ baseURL:", baseURL)

const axiosInstance = axios.create({
  baseURL  // Reemplaza esto con tu propia URL de API
});

axiosInstance.interceptors.request.use(async (config) => {
  console.log('Entro en el middlaware');
  
  if (config.method === 'post' && config.data instanceof FormData) {
    const file = config.data.get('image') as File;
    const encryptedFileBlob = await encryptFile(file, keyId);

    // Crear una nueva FormData con la imagen encriptada
    let newFormData = new FormData();
    newFormData.append('hash', config.data.get('hash') as string);
    newFormData.append('image', encryptedFileBlob, file.name);

    // Actualizar la configuración con la nueva FormData
    config.data = newFormData;
  }
  return Promise.resolve(config);
}, (error) => {
  return Promise.reject(error);
});


export default axiosInstance;
