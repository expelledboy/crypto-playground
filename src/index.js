import { createCryptoKey, createRandomArrayBuffer, createKeyPair, encrypt, arrayBufferToHexString } from './crypto.js'

const user = {
  id: 1,
  pin: "1234"
}

// const cryptoKey = await createCryptoKey(user.pin)
// const salt = createRandomArrayBuffer()
// const keyPair = await createKeyPair(cryptoKey, salt)

// console.log({
// 	salt: arrayBufferToHexString(salt),
// 	keyPair,
// 	publicKey: arrayBufferToHexString(keyPair.publicKey),
// })

// const { cypherText, iv } = await encrypt(keyPair.cryptoKey, "Hello World")

// console.log({
// 	cypherText: arrayBufferToHexString(cypherText),
// 	iv: arrayBufferToHexString(iv),
// })
