import * as server from "./server.js"
import * as crypto from "./crypto.js"

const anthony = {
	knowledge: {
		name: "Anthony",
		pin: "1234"
	},
	device: {
		mobileNumber: "+27745000000",
		localStorage: {},
	},
}

const rvg = {
	knowledge: {
		name: "Rudolf",
		pin: "1212"
	},
	device: {
		mobileNumber: "+27745000001",
		localStorage: {},
	},
}

// --

const loginToFirestoreWithMobile = (mobileNumber) => {
	const otpRef = server.sendOtp(mobileNumber)
	const otp = server._getOtpFor(otpRef)
	const authId = server.verifyOtp(otp, otpRef)

	return authId
}


const createKeyPairForAuthId = async (pin, authId) => {
	const cryptoKey = await crypto.createCryptoKey(pin)
	const salt = server.getSalt(authId)

	console.log("creating keypair", { pin, salt })
	return await crypto.createKeyPair(cryptoKey, salt)
}


// --

console.log("first anthony logs in")

anthony.device.localStorage["authId"] = loginToFirestoreWithMobile(anthony.device.mobileNumber)

anthony.device.localStorage["keyPair"] = await createKeyPairForAuthId(
	anthony.knowledge.pin,
	anthony.device.localStorage["authId"]
)

console.log("anthony's publickey", anthony.device.localStorage["keyPair"]?.publicKey)
