import { CryptoService } from "./crypto-service"

describe("CryptoService", () => {
  it("create a nonce", () => {
    const nonce = CryptoService.createNonce()

    expect(nonce).toBeTruthy()
    expect(nonce.length).toBe(128)
  })

  it("generate a key pair from a pin and an iv", async () => {
    const pin = "1234"
    const iv = CryptoService.createNonce()

    const { privateKey, publicKey } = await CryptoService.generateKey(pin, iv)

    expect(privateKey).toBeTruthy()
    expect(publicKey).toHaveLength(128)
  })

  it("key pair is deterministic", async () => {
    const pin = "1234"
    const iv = CryptoService.createNonce()

    const keyPairOne = await CryptoService.generateKey(pin, iv)
    const keyPairTwo = await CryptoService.generateKey(pin, iv)

    expect(keyPairOne.publicKey).toBe(keyPairTwo.publicKey)
  })

  it.skip("sign and verify a message", async () => {
    const pin = "1234"
    const iv = CryptoService.createNonce()
    const keyPair = await CryptoService.generateKey(pin, iv)

    const message = "secret message"
    const signature = await CryptoService.sign(keyPair, message)
    const verified = await CryptoService.verify(keyPair.publicKey, message, signature)

    expect(verified).toBe(true)
  })
})
