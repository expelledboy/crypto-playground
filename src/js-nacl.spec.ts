import {
  createNonce,
  genAuthKeyPair,
  genMasterKeyPair,
  genMasterSubKeyPair,
  genSecretFromPassword,
  sign,
  verify,
  verifySubKeyPair,
} from "./js-nacl"

const fixture = {
  iv: Uint8Array.from(
    "a"
      .repeat(64)
      .split("")
      .map((c) => c.charCodeAt(0))
  ),
  password: "password",
}

test("createNonce", async () => {
  const nonce = await createNonce()
  expect(nonce.length).toBe(32)
})

describe("genSecretFromPassword", () => {
  it("generates a key", async () => {
    const iv = await createNonce()
    const secret = await genSecretFromPassword(iv, fixture.password)
    expect(secret.length).toBe(32)
  })

  it("is deterministic", async () => {
    const secret1 = await genSecretFromPassword(fixture.iv, fixture.password)
    const secret2 = await genSecretFromPassword(fixture.iv, fixture.password)
    expect(secret1).toStrictEqual(secret2)
  })
})

describe("genAuthKeyPair", () => {
  it("generates a key", async () => {
    const iv = await createNonce()
    const secret = await genSecretFromPassword(iv, fixture.password)
    const keyPair = await genAuthKeyPair(secret)
    expect(keyPair.publicKey.length).toBe(32)
    expect(keyPair.privateKey.length).toBe(64)
  })

  it("is deterministic", async () => {
    const secret = await genSecretFromPassword(fixture.iv, fixture.password)
    const keyPair1 = await genAuthKeyPair(secret)
    const keyPair2 = await genAuthKeyPair(secret)
    expect(keyPair1.publicKey).toStrictEqual(keyPair2.publicKey)
    expect(keyPair1.privateKey).toStrictEqual(keyPair2.privateKey)
  })
})

describe("genMasterKeyPair", () => {
  it("generates a key", async () => {
    const keyPair = await genMasterKeyPair()
    expect(keyPair.publicKey.length).toBe(32)
    expect(keyPair.privateKey.length).toBe(64)
  })

  it("is not deterministic", async () => {
    const keyPair1 = await genMasterKeyPair()
    const keyPair2 = await genMasterKeyPair()
    expect(keyPair1.publicKey).not.toStrictEqual(keyPair2.publicKey)
    expect(keyPair1.privateKey).not.toStrictEqual(keyPair2.privateKey)
  })

  describe("genMasterSubKeyPair", () => {
    it("generates a key", async () => {
      const keyPair = await genMasterKeyPair()
      expect(keyPair.privateKey.length).toBe(64)
      const subKeyPair = await genMasterSubKeyPair(keyPair.privateKey)
      expect(subKeyPair.publicKey.length).toBe(32)
      expect(subKeyPair.privateKey.length).toBe(64)
    })

    it("is not deterministic", async () => {
      const keyPair = await genMasterKeyPair()
      const subKeyPair1 = await genMasterSubKeyPair(keyPair.privateKey)
      const subKeyPair2 = await genMasterSubKeyPair(keyPair.privateKey)
      expect(subKeyPair1.publicKey).not.toStrictEqual(subKeyPair2.publicKey)
      expect(subKeyPair1.privateKey).not.toStrictEqual(subKeyPair2.privateKey)
    })

    describe("verifySubKeyPair", () => {
      it("verifies a sub key pair", async () => {
        const keyPair = await genMasterKeyPair()
        const subKeyPair = await genMasterSubKeyPair(keyPair.privateKey)
        const verified = await verifySubKeyPair(
          subKeyPair.signature,
          subKeyPair.publicKey,
          keyPair.publicKey
        )
        expect(verified).toBe(true)
      })
    })
  })
})

test("sign and verify", async () => {
  const iv = await createNonce()
  const secret = await genSecretFromPassword(iv, fixture.password)
  const keyPair = await genAuthKeyPair(secret)

  const message = "hello world"
  const signature = await sign(message, keyPair.privateKey)
  const verified = await verify(signature, message, keyPair.publicKey)

  expect(verified).toBe(true)
})
