import * as crypto from "./crypto.js"

let authIndex = 2

const auths = {
  "+27745000000": { authId: 1 }
}

const pins = {
  1: {
    salt: '1a52aeed4bf6416b9d6a0d59', // arrayBufferToHexString(await createSalt())
    publicKey: 'b0ff594393ff05b44441845cc5df0c1ac42e1deb67ba0a9cc6b6d2d86f9510f5' // arrayBufferToHexString((await createKeyPair(cryptoKey, salt)).publicKey)
  }
}

export const sendOtp = (mobileNumber) => {
  console.log("sending otp to mobile number", mobileNumber)

  return {
    ref: mobileNumber,
    otp: "123456"
  }
}

export const _getOtpFor = (otpRef) => {
  return otpRef.otp
}

export const verifyOtp = (otp, otpRef) => {
  if (otpRef.otp === otp) {
    console.log("user entered correct otp")
  } else {
    console.log("otp verification failed")
    return
  }

  let auth = auths[otpRef.ref]

  if (auth) {
    console.log("user identified by mobile number", auth)
  } else {
    auth = { authId: authIndex }
    auths[otpRef.mobileNumber] = auth
    authIndex += 1

    console.log("new auth id created for mobile number", auth)
  }

  return auth.authId
}

export const getSalt = (authId) => {
  const authPinSalt = pins[authId]?.salt

  if (authPinSalt) {
    console.log("salt found", { authId })
    return authPinSalt
  } else {
    console.log("no salt found, creating new salt for", { authId })
    pins[authId] = {
      salt: crypto.arrayBufferToHexString(crypto.createSalt()),
    }
  }
}
