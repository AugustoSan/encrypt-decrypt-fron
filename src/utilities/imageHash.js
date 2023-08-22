// imageHash.js
import CryptoJS from 'crypto-js';

const generateHashAndSign = async (image) => {
  const arrayBuffer = await new Response(image).arrayBuffer();
  let wordArray = CryptoJS.lib.WordArray.create();
  let uint8Array = new Uint8Array(arrayBuffer);
  for(let i = 0; i < uint8Array.length; i++) {
      wordArray.words[i >>> 2] |= uint8Array[i] << (24 - (i % 4) * 8);
  }
  wordArray.sigBytes = uint8Array.length;

  const hash = CryptoJS.SHA256(wordArray).toString();  
  return hash;
};

export default generateHashAndSign;
