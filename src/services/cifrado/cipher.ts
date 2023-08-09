import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

// Configuración de AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  region: process.env.AWS_REGION ?? 'us-east-1',
});

const encrypt = async (plainText: string, keyId: string): Promise<string> => {
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

const encryptFile = async (file: File, keyId: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64String = arrayBufferToBase64(arrayBuffer);
      const encryptedData = await encrypt(base64String, keyId);
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      resolve(blob);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export { encryptFile };
