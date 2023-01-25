import crypto from "isomorphic-webcrypto"

// https://blog.engelke.com/2015/02/14/deriving-keys-from-passwords-with-webcrypto/
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#supported_algorithms

export const arrayBufferToHexString = (arrayBuffer: ArrayBuffer) =>
  Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("")

export const CryptoService: CryptoService = {
  createNonce: () => {
    const nonce = crypto.getRandomValues(new Uint8Array(32))
    return arrayBufferToHexString(nonce)
  },
} as CryptoService
