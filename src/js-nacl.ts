import naclFactory from "js-nacl"
import scrypt from "scrypt-js"

// https://github.com/ricmoo/scrypt-js
//

const NACL = naclFactory.instantiate(() => {})

// --

export const createNonce = async () => {
  const nacl = await NACL

  return nacl.random_bytes(32)
}

export const genSecretFromPassword = async (iv: Uint8Array, password: string) => {
  const nacl = await NACL

  const N = 1024,
    r = 8,
    p = 1,
    dkLen = 32

  return await scrypt.scrypt(nacl.encode_utf8(password), iv, N, r, p, dkLen)
}

export const genMasterKeyPair = async () => {
  const nacl = await NACL

  const keyPair = nacl.crypto_sign_keypair()

  return {
    publicKey: keyPair.signPk,
    privateKey: keyPair.signSk,
  }
}

export const genMasterSubKeyPair = async (masterPrivateKey: Uint8Array) => {
  const nacl = await NACL

  const keyPair = await genMasterKeyPair()
  const signature = nacl.crypto_sign_detached(keyPair.publicKey, masterPrivateKey)

  return {
    ...keyPair,
    signature,
  }
}

// XXX: This only work between direct master/sub key pairs
export const verifySubKeyPair = async (
  subKeySignature: Uint8Array,
  subKeyPublicKey: Uint8Array,
  masterPublicKey: Uint8Array
) => {
  const nacl = await NACL

  return nacl.crypto_sign_verify_detached(subKeySignature, subKeyPublicKey, masterPublicKey)
}

export const genAuthKeyPair = async (secret: Uint8Array) => {
  const nacl = await NACL

  const keyPair = nacl.crypto_sign_seed_keypair(secret)

  return {
    publicKey: keyPair.signPk,
    privateKey: keyPair.signSk,
  }
}

export const sign = async (message: string, privateKey: Uint8Array) => {
  const nacl = await NACL

  const signature = nacl.crypto_sign_detached(nacl.encode_utf8(message), privateKey)

  return nacl.to_hex(signature)
}

export const verify = async (signature: string, message: string, publicKey: Uint8Array) => {
  const nacl = await NACL

  const verified = nacl.crypto_sign_verify_detached(
    nacl.from_hex(signature),
    nacl.encode_utf8(message),
    publicKey
  )

  return verified
}
