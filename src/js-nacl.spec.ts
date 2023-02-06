import {
  createNonce,
  genAuthKeyPair,
  genMasterKeyPair,
  genMasterSubKeyPair,
  genSecretFromPassword,
  genSession,
  mintVoucher,
  sign,
  verify,
  verifySession,
  verifySubKeyPair,
  verifyVoucher,
} from "./js-nacl"

const fixture = {
  iv: "a".repeat(64),
  password: "password",
}

test("createNonce", async () => {
  const nonce = await createNonce()
  expect(nonce.length).toBe(64)
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
    expect(keyPair.publicKey.length).toBe(64)
    expect(keyPair.privateKey.length).toBe(128)
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
    expect(keyPair.publicKey.length).toBe(64)
    expect(keyPair.privateKey.length).toBe(128)
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
      expect(keyPair.privateKey.length).toBe(128)
      const subKeyPair = await genMasterSubKeyPair(keyPair.privateKey)
      expect(subKeyPair.publicKey.length).toBe(64)
      expect(subKeyPair.privateKey.length).toBe(128)
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

describe("genSession", () => {
  it("generates a session", async () => {
    const userSecret = await genSecretFromPassword(fixture.iv, fixture.password)
    const userKeyPair = await genAuthKeyPair(userSecret)
    const keyPair = await genMasterKeyPair()
    const subKeyPair = await genMasterSubKeyPair(keyPair.privateKey)
    const session = await genSession(subKeyPair, userKeyPair.publicKey)

    expect(session).toStrictEqual({
      data: {
        userPublicKey: userKeyPair.publicKey,
        systemPublicKey: subKeyPair.publicKey,
        validUntil: expect.any(Date),
      },
      signature: expect.any(String),
    })
  })

  test("verifySession", async () => {
    const userSecret = await genSecretFromPassword(fixture.iv, fixture.password)
    const userKeyPair = await genAuthKeyPair(userSecret)
    const keyPair = await genMasterKeyPair()
    const subKeyPair = await genMasterSubKeyPair(keyPair.privateKey)
    const session = await genSession(subKeyPair, userKeyPair.publicKey)

    const verified = await verifySession(session, subKeyPair.publicKey)

    expect(verified).toBe(true)
  })
})

test("mint and verify voucher", async () => {
  const userSecret = await genSecretFromPassword(fixture.iv, fixture.password)
  const userKeyPair = await genAuthKeyPair(userSecret)
  const keyPair = await genMasterKeyPair()
  const subKeyPair = await genMasterSubKeyPair(keyPair.privateKey)
  const session = await genSession(subKeyPair, userKeyPair.publicKey)

  const voucher = await mintVoucher(userKeyPair, session, 1000)
  const verified = await verifyVoucher(voucher)
  expect(verified).toBe(true)
})


