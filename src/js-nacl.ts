import naclFactory from "js-nacl"
import scrypt from "scrypt-js"

// https://github.com/ricmoo/scrypt-js
//

const NACL = naclFactory.instantiate(() => {})

// --

export const createNonce = async () => {
  const nacl = await NACL

  const nonce = nacl.random_bytes(32)
  return nacl.to_hex(nonce)
}

export const genSecretFromPassword = async (iv: string, password: string) => {
  const nacl = await NACL

  const N = 1024,
    r = 8,
    p = 1,
    dkLen = 32

  return await scrypt.scrypt(nacl.encode_utf8(password), nacl.from_hex(iv), N, r, p, dkLen)
}

type KeyPair = {
  publicKey: string
  privateKey: string
}

export const genMasterKeyPair = async (): Promise<KeyPair> => {
  const nacl = await NACL

  const keyPair = nacl.crypto_sign_keypair()

  return {
    publicKey: nacl.to_hex(keyPair.signPk),
    privateKey: nacl.to_hex(keyPair.signSk),
  }
}

type MasterSubKeyPair = KeyPair & {
  signature: string
}

export const genMasterSubKeyPair = async (masterPrivateKey: string): Promise<MasterSubKeyPair> => {
  const nacl = await NACL

  const keyPair = await genMasterKeyPair()
  const signature = nacl.crypto_sign_detached(
    nacl.from_hex(keyPair.publicKey),
    nacl.from_hex(masterPrivateKey)
  )

  return {
    ...keyPair,
    signature: nacl.to_hex(signature),
  }
}

// XXX: This only work between direct master/sub key pairs
export const verifySubKeyPair = async (
  subKeySignature: string,
  subKeyPublicKey: string,
  masterPublicKey: string
): Promise<boolean> => {
  const nacl = await NACL

  return nacl.crypto_sign_verify_detached(
    nacl.from_hex(subKeySignature),
    nacl.from_hex(subKeyPublicKey),
    nacl.from_hex(masterPublicKey)
  )
}

export const genAuthKeyPair = async (secret: Uint8Array): Promise<KeyPair> => {
  const nacl = await NACL

  const keyPair = nacl.crypto_sign_seed_keypair(secret)

  return {
    publicKey: nacl.to_hex(keyPair.signPk),
    privateKey: nacl.to_hex(keyPair.signSk),
  }
}

export const sign = async (message: string, privateKey: string): Promise<string> => {
  const nacl = await NACL

  const signature = nacl.crypto_sign_detached(nacl.encode_utf8(message), nacl.from_hex(privateKey))

  return nacl.to_hex(signature)
}

export const verify = async (
  signature: string,
  message: string,
  publicKey: string
): Promise<boolean> => {
  const nacl = await NACL

  const verified = nacl.crypto_sign_verify_detached(
    nacl.from_hex(signature),
    nacl.encode_utf8(message),
    nacl.from_hex(publicKey)
  )

  return verified
}

type Session = {
  data: {
    userPublicKey: string
    systemPublicKey: string
    validUntil: Date
  }
  signature: string
}

export const genSession = async (
  systemKeyPair: KeyPair,
  userPublicKey: string
): Promise<Session> => {
  const nacl = await NACL

  // 24 hours
  const validUntil = new Date()
  validUntil.setHours(validUntil.getHours() + 24)

  const data = {
    userPublicKey,
    systemPublicKey: systemKeyPair.publicKey,
    validUntil,
  }

  const signature = await sign(JSON.stringify(data), systemKeyPair.privateKey)

  return {
    data,
    signature,
  }
}

export const verifySession = async (
  session: Session,
  systemPublicKey: string
): Promise<boolean> => {
  const nacl = await NACL

  return await verify(session.signature, JSON.stringify(session.data), systemPublicKey)
}

type Voucher = {
  data: {
    session: Session
    amount: number
  }
  signature: string
}

export const mintVoucher = async (
  userKeyPair: KeyPair,
  session: Session,
  amount: number
): Promise<Voucher> => {
  const nacl = await NACL

  const data = {
    session,
    amount,
  }

  const signature = await sign(JSON.stringify(data), userKeyPair.privateKey)

  return {
    data,
    signature,
  }
}

export const verifyVoucher = async (voucher: Voucher): Promise<boolean> => {
  const nacl = await NACL

  return await verify(
    voucher.signature,
    JSON.stringify(voucher.data),
    voucher.data.session.data.userPublicKey
  )
}



