import {
  createNonce,
  exportPrivateKey,
  exportPublicKey,
  generateKey,
  generateKeyMaterial,
  importPublicKey,
  sign,
  verify,
} from "./isomorphic-webcrypto"

describe("createNonce", () => {
  const nonce = createNonce()

  it("creates a nonce with high entropy", () => {
    expect(nonce.length).toBe(128)
  })
})

describe("generateKeyMaterial", () => {
  const nonce = createNonce()

  it("creates a CryptoKey", async () => {
    const keyData = await generateKeyMaterial(nonce)

    expect(keyData).toMatchObject({
      type: "secret",
      algorithm: { name: "PBKDF2" },
    })
  })
})

describe("generateKey", () => {
  const pin = "1234"
  const iv = createNonce()

  it("creates a private key", async () => {
    const privateKey = await generateKey(pin, iv)

    expect(privateKey).toMatchObject({
      type: "public",
      algorithm: { name: "ECDSA", namedCurve: "P-256" },
    })
  })

  it("can sign messages", async () => {
    const privateKey = await generateKey(pin, iv)

    expect(privateKey).toMatchObject({
      usages: expect.arrayContaining(["sign"]),
    })
  })

  it("is deterministic", async () => {
    const genKey = async () => await exportPrivateKey(await generateKey(pin, iv))

    expect(await genKey()).toBe(await genKey())
  })

  describe("exportPublicKey", () => {
    it("exports a public key", async () => {
      const privateKey = await generateKey(pin, iv)
      const publicKey = await exportPublicKey(privateKey)

      expect(publicKey).toHaveLength(128)
    })

    describe("importPublicKey", () => {
      it("codec is complete", async () => {
        const privateKey = await generateKey(pin, iv)
        const publicKey = await exportPublicKey(privateKey)
        const importedKey = await importPublicKey(publicKey)

        expect(await exportPublicKey(importedKey)).toBe(publicKey)
      })
    })
  })
})

describe("sign", () => {
  const pin = "1234"
  const iv = createNonce()
  const challenge = createNonce()

  it.skip("signs a message", async () => {
    const privateKey = await generateKey(pin, iv)
    const signature = await sign(privateKey, challenge)

    expect(signature).toHaveLength(128)
  })

  it.skip("is deterministic", async () => {
    const privateKey = await generateKey(pin, iv)

    const signChallenge = async () => await sign(privateKey, challenge)

    expect(await signChallenge()).toBe(await signChallenge())
  })

  describe.skip("verify", () => {
    it("verifies a signature", async () => {
      const privateKey = await generateKey(pin, iv)
      const publicKey = await exportPublicKey(privateKey)
      const importedKey = await importPublicKey(publicKey)
      const signature = await sign(privateKey, challenge)
      const verified = await verify(importedKey, challenge, signature)

      expect(verified).toBe(true)
    })
  })
})
