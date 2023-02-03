type KeyPair = {
  privateKey: any
  publicKey: string
}

type HexString = string

type CryptoService = {
  createNonce: () => HexString
  generateKey: (pin: string, iv: HexString) => Promise<KeyPair>
  sign: (keyPair: KeyPair, challenge: HexString) => Promise<HexString>
  verify: (publicKey: string, challenge: HexString, signature: HexString) => Promise<boolean>
}
