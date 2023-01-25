type KeyPair = {
  privateKey: any
  publicKey: string
}

type CryptoService = {
  createNonce: () => string
  generateKey: (pin: string, iv: string) => KeyPair
  sign: (keyPair: KeyPair, message: string) => string
  verify: (publicKey: string, message: string, signature: string) => boolean
}
