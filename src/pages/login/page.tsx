import React from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from "expo-firebase-recaptcha"
import { useStore } from "effector-react"

import * as firebase from "../../firebase"
import * as model from "./model"

export default function Login() {
  const recaptchaVerifier = React.createRef<FirebaseRecaptchaVerifierModal>()
  const phoneNumber = useStore(model.$phoneNumber)
  const verificationId = useStore(model.$verificationId)
  const message = useStore(model.$message)
  const validPhoneNumber = useStore(model.$validPhoneNumber)

  const firebaseConfig = firebase.app ? firebase.app.options : undefined
  const attemptInvisibleVerification = true

  React.useEffect(() => {
    model.setRecaptchaVerifier(recaptchaVerifier)
  }, [recaptchaVerifier])

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
      <Text style={{ marginTop: 20 }}>Enter phone number</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        placeholder="+16505550000"
        autoFocus
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        value={phoneNumber}
        onChangeText={model.setPhoneNumber}
      />
      <Button
        title="Send Verification Code"
        disabled={!validPhoneNumber}
        onPress={() => model.sendVerificationCode()}
      />
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        editable={!!verificationId}
        placeholder="123456"
        onChangeText={model.setVerificationCode}
      />
      <Button
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={() => model.confirmVerificationCode()}
      />
      {message && <Text style={styles.message}>{message}</Text>}
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  )
}

const styles = StyleSheet.create({
  message: {
    color: "blue",
    fontSize: 17,
    textAlign: "center",
    margin: 20,
  },
})
