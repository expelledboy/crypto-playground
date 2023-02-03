import * as crypto from "./crypto"

const createNonce: CryptoService["createNonce"] = crypto.createNonce

const generateKey: CryptoService["generateKey"] = async (pin, iv) => {
  const privateKey = await crypto.generateKey(pin, iv)
  const publicKey = await crypto.exportPublicKey(privateKey)

  return { privateKey, publicKey }
}

const sign: CryptoService["sign"] = (keyPair, message) => {
  return crypto.sign(keyPair.privateKey, message)
}

const verify: CryptoService["verify"] = async (publicKey, message, signature) => {
  const key = await crypto.importPublicKey(publicKey)

  return crypto.verify(key, message, signature)
}

export const CryptoService: CryptoService = {
  createNonce,
  generateKey,
  sign,
  verify,
}
