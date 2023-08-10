// api.tsx

import axios from 'axios';
import { encrypt } from '../cifrado/cipher';

// if (!process.env.REACT_APP_AWS_KEY_ID)  throw new Error('No defined REACT_APP_AWS_KEY_ID');

// const keyId = process.env.REACT_APP_AWS_KEY_ID;
const baseURL = process.env.REACT_APP_URL_API ?? 'http://localhost:4000/';
console.log("🚀 ~ file: axios.ts:10 ~ baseURL:", baseURL)

const axiosInstance = axios.create({
  baseURL  // Reemplaza esto con tu propia URL de API
});

axiosInstance.interceptors.request.use(async (config) => {
  console.log('Entro en el middlaware');
  // console.log('config data: ', typeof config.data);
  // console.log('config data: ', config.data instanceof FormData);
  
  // if (config.method === 'post' && config.data instanceof FormData) {
  if (config.method === 'post') {
    const hash = config.data.hash as string;
    const encryptedHash = await encrypt(hash);
    config.data.hash = encryptedHash;

    // const hash = config.data.get('hash') as string;
    // const encryptedHash = await encrypt(hash);

    // const image = config.data.get('image') as File;

    // // Crear una nueva FormData con la imagen encriptada
    // // let newFormData = new FormData();
    // // newFormData.append('hash', encryptedHash);
    // // newFormData.append('image', image, image.name);

    // // Actualizar la configuración con la nueva FormData
    // config.data.set('hash', encryptedHash);
    // config.data.set('image', image);
  }
  return Promise.resolve(config);
}, (error) => {
  return Promise.reject(error);
});


export default axiosInstance;
