import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

if (!process.env.REACT_APP_AWS_KEY_ID)  throw new Error('No defined REACT_APP_AWS_KEY_ID');
if (!process.env.REACT_APP_AWS_ACCESS_KEY_ID)  throw new Error('No defined REACT_APP_AWS_ACCESS_KEY_ID');
if (!process.env.REACT_APP_AWS_SECRET_ACCESS_KEY)  throw new Error('No defined REACT_APP_AWS_SECRET_ACCESS_KEY');
if (!process.env.REACT_APP_AWS_REGION)  throw new Error('No defined REACT_APP_AWS_REGION');


const keyId = process.env.REACT_APP_AWS_KEY_ID;
const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const region = process.env.REACT_APP_AWS_REGION;

// Configuración de AWS
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

export const encrypt = async (plainText: string): Promise<string> => {

  // console.log('keyId: ', keyId);
  // console.log('accessKeyId: ', accessKeyId);
  // console.log('secretAccessKey: ', secretAccessKey);
  // console.log('region: ', region);

  const kms = new AWS.KMS();

  const params = {
    KeyId: keyId,
    Plaintext: Buffer.from(plainText),
  };

  return new Promise((resolve, reject) => {
    kms.encrypt(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data.CiphertextBlob?.toString('base64') || '');
      }
    });
  });
};

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(arrayBuffer);
  const charArray = Array.from(byteArray).map(byte => String.fromCharCode(byte));
  const base64String = btoa(charArray.join(''));
  return base64String;
}

const encryptFile = async (file: File): Promise<Blob> => {

  // console.log('keyId: ', keyId);
  // console.log('accessKeyId: ', accessKeyId);
  // console.log('secretAccessKey: ', secretAccessKey);
  // console.log('region: ', region);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64String = arrayBufferToBase64(arrayBuffer);
      const encryptedData = await encrypt(base64String);
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      resolve(blob);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export { encryptFile };
