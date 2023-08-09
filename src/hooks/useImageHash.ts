// useImageHash.ts

import { useState } from 'react';
import CryptoJS from 'crypto-js';
// import { KMS } from 'aws-sdk';

const useImageHash = () => {
  const [hash, setHash] = useState<string | null>(null);
  // const [signedHash, setSignedHash] = useState<Buffer | null>(null);

  const generateHashAndSign = async (image: File) => {
    // Leer la imagen como un ArrayBuffer
    const arrayBuffer = await new Response(image).arrayBuffer();

    // Convertir el ArrayBuffer a WordArray que es aceptado por CryptoJS
    let wordArray = CryptoJS.lib.WordArray.create();
    let uint8Array = new Uint8Array(arrayBuffer);
    for(let i = 0; i < uint8Array.length; i++) {
        wordArray.words[i >>> 2] |= uint8Array[i] << (24 - (i % 4) * 8);
    }
    wordArray.sigBytes = uint8Array.length;

    // Generar el hash de la imagen
    const hash = CryptoJS.SHA256(wordArray).toString();
    setHash(hash);
    // setSignedHash(Buffer.from('aqui va a ir la firma'));

    // Obtener la llave privada del servicio de llaveros de Amazon
    // Nota: Debes configurar tu SDK de AWS con las credenciales y la región correctas.
    // const kms = new KMS();
    // const keyId = 'your-key-id';  // Reemplaza esto con tu propio ID de llave.

    // try {
    //   const signResult = await kms.sign({
    //     KeyId: keyId,
    //     Message: Buffer.from(hash),
    //     MessageType: 'RAW',
    //     SigningAlgorithm: 'ECDSA_SHA_256',
    //   }).promise();

    //   setSignedHash(signResult.Signature as Buffer);

    // } catch (error) {
    //   console.error('Failed to sign the hash', error);
    // }
  };

  // return { hash, signedHash, generateHashAndSign };
  return { hash, generateHashAndSign };
};

export default useImageHash;
