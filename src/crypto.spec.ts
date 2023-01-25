import { CryptoService } from "./crypto"

describe("CryptoService", () => {
  it("create a nonce", () => {
    const nonce = CryptoService.createNonce()

    expect(nonce).toBeTruthy()
    expect(nonce.length).toBe(64)
  })

  it.skip("generate a key pair from a pin and an iv", () => {
    const pin = "1234"
    const iv = CryptoService.createNonce()

    const { privateKey, publicKey } = CryptoService.generateKey(pin, iv)

    expect(privateKey).toBeTruthy()
    expect(publicKey).toContain("PUBLIC KEY")
  })

  it.skip("key pair is deterministic", () => {
    const pin = "1234"
    const iv = CryptoService.createNonce()

    const keyPairOne = CryptoService.generateKey(pin, iv)
    const keyPairTwo = CryptoService.generateKey(pin, iv)

    expect(keyPairOne.publicKey).toBe(keyPairTwo.publicKey)
  })

  it.skip("sign and verify a message", () => {
    const pin = "1234"
    const iv = CryptoService.createNonce()
    const keyPair = CryptoService.generateKey(pin, iv)

    const message = "secret message"
    const signature = CryptoService.sign(keyPair, message)
    const verified = CryptoService.verify(keyPair.publicKey, message, signature)

    expect(verified).toBe(true)
  })
})
