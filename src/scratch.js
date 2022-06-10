import crypto from 'isomorphic-webcrypto'

const createSalt = async () =>
	crypto.getRandomValues(new Uint8Array(16))

const saltToHexString = (salt) =>
	Array.prototype.map.call(new Uint8Array(salt), x => ('00' + x.toString(16)).slice(-2)).join('')

const hexStringToArrayBuffer = (hexString) =>
	new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

// export const bufferToBase64 = (buffer) =>
// 	Buffer.from(buffer).toString('base64')

// export const arrayBufferToHexString = (arrayBuffer) =>
// 	Array.prototype.map.call(new Uint8Array(arrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('')

// export const stringToArrayBuffer = (str) =>
// 	new Uint8Array(str.split('').map(c => c.charCodeAt(0)))


// const salt = await createSalt()
// const saltHex = arrayBufferToHexString(salt)
// const saltBase64 = bufferToBase64(salt)
// const saltDecoded = stringToArrayBuffer(saltBase64)
// const saltDecodedHex = stringToArrayBuffer(saltHex)

const salt = await createSalt()
const saltHex = saltToHexString(salt)
const saltDecoded = hexStringToArrayBuffer(saltHex)

console.log({
	salt,
	saltHex,
	saltDecoded,
})


