import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

// if (!process.env.REACT_APP_AWS_KEY_ID)  throw new Error('No defined REACT_APP_AWS_KEY_ID');
// if (!process.env.REACT_APP_AWS_ACCESS_KEY_ID)  throw new Error('No defined REACT_APP_AWS_ACCESS_KEY_ID');
// if (!process.env.REACT_APP_AWS_SECRET_ACCESS_KEY)  throw new Error('No defined REACT_APP_AWS_SECRET_ACCESS_KEY');
// if (!process.env.REACT_APP_AWS_REGION)  throw new Error('No defined REACT_APP_AWS_REGION');

// const keyId = 'arn:aws:kms:us-east-1:870998336239:key/b8c654d5-c146-4fdc-a465-e03ed40411e5';
// const accessKeyId = 'AKIA4VS4L4LXSKTIUH7X';
// const secretAccessKey = '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';
// const region = 'us-east-1';

let KMSkeyId, KMSaccessKeyId, KMSsecretAccessKey, KMSregion;

export const setVariablesKMS = (valor, variable) => {
  switch (variable) {
    case 'KMSkeyId':
        KMSkeyId = valor;
        break;
    case 'KMSaccessKeyId':
      KMSaccessKeyId = valor;
      break;
    case 'KMSsecretAccessKey':
      KMSsecretAccessKey = valor;
      break;
    case 'KMSregion':
      KMSregion = valor;
      console.log('switch KMSregion: ', KMSregion);
      break;
  
    default:
      break;
  }
}

export const instanceKMS = () => {
  if(KMSkeyId && KMSaccessKeyId && KMSsecretAccessKey && KMSregion){
    // Configuración de AWS
    AWS.config.update({
      accessKeyId: KMSaccessKeyId,
      secretAccessKey: KMSsecretAccessKey,
      region: KMSregion,
    });
    console.log('Finalizo la configuracion');
  }
}

export const encrypt = async (plainText) => {
  try {
    const kms = new AWS.KMS();

    const params = {
      KeyId: KMSkeyId,
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
  } catch (error) {
    console.log('error: ', error);
    throw Error('Ocurrio un error al encriptar con kms');
  }
};

export const decrypt = async (plainText) => {

  try {
    const kms = new AWS.KMS();

    const params = {
      CiphertextBlob: Buffer.from(plainText, 'base64')
    };

    return new Promise((resolve, reject) => {
      kms.decrypt(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data.Plaintext?.toString() || '');
        }
      });
    });
  } catch (error) {
    console.log('error: ', error);
    throw Error('Ocurrio un error al desencriptar con kms');
  }
};

