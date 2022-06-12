import crypto from 'isomorphic-webcrypto'
import * as assert from 'assert'

export { crypto }

// https://blog.engelke.com/2015/02/14/deriving-keys-from-passwords-with-webcrypto/
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#supported_algorithms

// --

export const createRandomArrayBuffer = () =>
  crypto.getRandomValues(new Uint8Array(16))

export const arrayBufferToHexString = (salt) =>
  Array.prototype.map.call(new Uint8Array(salt), x => ('00' + x.toString(16)).slice(-2)).join('')

export const hexStringToArrayBuffer = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

const salt = createRandomArrayBuffer()
const hexedSalt = arrayBufferToHexString(salt)
const decodedSalt = hexStringToArrayBuffer(hexedSalt)

console.log({ salt, hexedSalt, decodedSalt })
assert.deepEqual(decodedSalt, salt)

// --

const stringToArrayBuffer = (str) => {
  const textEncoder = new TextEncoder()
  return textEncoder.encode(str)
}

export const createCryptoKey = (secret) => crypto.subtle
  .importKey(
    "raw",
    stringToArrayBuffer(secret),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  )

export const createKeyPair = async (cryptoKey, salt) => {
  const keyPair = await crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      "salt": hexStringToArrayBuffer(salt),
      "iterations": 100000,
      "hash": "SHA-256"
    },
    cryptoKey,
    { "name": "AES-GCM", "length": 256 },
    true,
    ["encrypt", "decrypt"]
  );

  return {
    cryptoKey: keyPair,
    publicKey: arrayBufferToHexString(await crypto.subtle.exportKey("raw", keyPair)),
    privateKey: await crypto.subtle.exportKey("jwk", keyPair),
  }
}


const userSecret = '123456'
const existingSalt = '8b8b6730f1d27162869c6346ae1ec67f' // arrayBufferToHexString(createRandomArrayBuffer())
const expectedPrivateKey = {
  ext: true,
  key_ops: ['encrypt', 'decrypt'],
  kty: 'oct',
  alg: 'A256GCM',
  k: 'Z3OcQt_zqlXabsd2wsYXlVaKDKyQAC3aI2-RTw_1FO0'
}

const cryptoKey = await createCryptoKey(userSecret)
const keyPair = await createKeyPair(cryptoKey, existingSalt)

console.log({
  userSecret,
  existingSalt,
  publicKey: arrayBufferToHexString(keyPair.publicKey),
  privateKey: keyPair.privateKey,
})

assert.deepEqual(keyPair.privateKey, expectedPrivateKey)

// --


export const encrypt = async (cryptoKey, plaintext) => {
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const cypherText = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    cryptoKey,
    stringToArrayBuffer(plaintext)
  );

  return {
    iv,
    cypherText,
  }
}

