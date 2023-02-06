import crypto from "isomorphic-webcrypto"
import { arrayBufferToHexString, hexStringToArrayBuffer, stringToArrayBuffer } from "./utils"

// https://blog.engelke.com/2015/02/14/deriving-keys-from-passwords-with-webcrypto/
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

// --

export const createNonce = () => {
  const nonce = crypto.getRandomValues(new Uint8Array(64))
  return arrayBufferToHexString(nonce)
}

export const generateKeyMaterial: (input: string) => Promise<CryptoKey> = (input) => {
  const props = {
    format: "raw" as const,
    keyData: stringToArrayBuffer(input),
    algorithm: "PBKDF2",
    extractable: false,
    keyUsages: ["deriveBits", "deriveKey"] as const,
  }

  return crypto.subtle.importKey(
    props.format,
    props.keyData,
    props.algorithm,
    props.extractable,
    props.keyUsages
  )
}

const keyAlgorithm = (iv: string) => ({
  name: "PBKDF2",
  salt: stringToArrayBuffer(iv),
  iterations: 100000,
  hash: "SHA-256",
})

const derivedKeyAlgorithm = {
  name: "ECDSA",
  namedCurve: "P-256",
}

export const generateKey = async (pin: string, iv: string) => {
  const keyMaterial = await generateKeyMaterial(pin)
  const algorithm = keyAlgorithm(iv)

  const props = {
    algorithm,
    baseKey: keyMaterial,
    derivedKeyType: derivedKeyAlgorithm,
    extractable: true,
    keyUsages: ["sign", "verify"] as const,
  }

  return await crypto.subtle.deriveKey(
    props.algorithm,
    props.baseKey,
    props.derivedKeyType,
    props.extractable,
    props.keyUsages
  )
}

export const exportPublicKey = async (key: CryptoKey) => {
  const props = {
    format: "raw" as const,
    key,
  }

  const publicKey = await crypto.subtle.exportKey(props.format, props.key)

  return arrayBufferToHexString(publicKey)
}

export const exportPrivateKey = async (key: CryptoKey) => {
  const props = {
    format: "pkcs8" as const,
    key,
  }

  const privateKey = await crypto.subtle.exportKey(props.format, props.key)

  return arrayBufferToHexString(privateKey)
}

export const importPublicKey = async (publicKey: string) => {
  const props = {
    format: "raw" as const,
    keyData: hexStringToArrayBuffer(publicKey),
    algorithm: derivedKeyAlgorithm,
    extractable: true,
    keyUsages: ["verify"] as const,
  }

  return await crypto.subtle.importKey(
    props.format,
    props.keyData,
    props.algorithm,
    props.extractable,
    props.keyUsages
  )
}

const signingAlgorithm = {
  name: "ECDSA",
  hash: "SHA-256",
}

export const sign = async (key: CryptoKey, challenge: string) => {
  const props = {
    algorithm: signingAlgorithm,
    key,
    data: hexStringToArrayBuffer(challenge),
  }

  const signature = await crypto.subtle.sign(props.algorithm, props.key, props.data)

  return arrayBufferToHexString(signature)
}

export const verify = async (key: CryptoKey, challenge: string, signature: string) => {
  const props = {
    algorithm: signingAlgorithm,
    key,
    signature: hexStringToArrayBuffer(signature),
    data: stringToArrayBuffer(challenge),
  }

  return await crypto.subtle.verify(props.algorithm, props.key, props.signature, props.data)
}
