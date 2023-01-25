import phone from "phone"
import { PhoneAuthProvider } from "firebase/auth"
import { createEffect, createEvent, createStore, sample } from "effector"
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha"
import { RefObject } from "react"

import * as firebase from "../../firebase"

// https://docs.expo.dev/versions/latest/sdk/firebase-recaptcha/
export type RecaptchaRef = RefObject<FirebaseRecaptchaVerifierModal>

export const $recaptchaVerifier = createStore<RecaptchaRef | null>(null)
export const $phoneNumber = createStore<string>("")
export const $verificationId = createStore<string | null>(null)
export const $verificationCode = createStore<string | null>(null)
export const $message = createStore<string | null>(null)

export const setRecaptchaVerifier = createEvent<RecaptchaRef>()
export const setPhoneNumber = createEvent<string>()
export const sendVerificationCode = createEvent<void>()
export const setVerificationCode = createEvent<string>()
export const confirmVerificationCode = createEvent<void>()

// --

type SendVerificationCode = {
  phoneNumber: string
  recaptchaVerifier: RecaptchaRef
}

const sendVerificationCodeFx = createEffect({
  handler: async ({ phoneNumber, recaptchaVerifier }: SendVerificationCode) => {
    const applicationVerifier = recaptchaVerifier?.current
    if (!applicationVerifier) throw new Error("RecaptchaVerifier is not initialized")

    const phoneProvider = new PhoneAuthProvider(firebase.auth)
    console.log("Sending SMS")
    const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, applicationVerifier)
    console.log("SMS sent", verificationId)

    return verificationId
  },
})

$recaptchaVerifier.on(setRecaptchaVerifier, (_, recaptchaVerifier) => recaptchaVerifier)

$phoneNumber.on(setPhoneNumber, (_, phoneNumber) => phoneNumber)

$message.on(sendVerificationCodeFx.failData, (_, error) => {
  console.error(error)
  return error?.message
})

$verificationId.on(sendVerificationCodeFx.doneData, (_, verificationId) => {
  console.log("Verification ID:", verificationId)
  return verificationId
})

sample({
  clock: sendVerificationCode,
  source: {
    phoneNumber: $phoneNumber,
    recaptchaVerifier: $recaptchaVerifier,
  },
  filter: (source): source is SendVerificationCode =>
    !!source.phoneNumber && !!source.recaptchaVerifier,
  target: sendVerificationCodeFx,
})

// --

export const $validPhoneNumber = $phoneNumber.map((phoneNumber) => phone(phoneNumber).isValid)
