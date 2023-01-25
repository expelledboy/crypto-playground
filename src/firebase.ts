import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator, initializeFirestore } from "firebase/firestore"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"

// https://medium.com/swlh/how-to-properly-use-environment-variables-in-an-expo-react-native-app-7ab852590b30
import { FIREBASE_TOKEN, GCLOUD_PROJECT } from "@env"

// https://firebase.google.com/docs/emulator-suite/connect_auth#instrumentauth
const firebaseConfig = {
  apiKey: FIREBASE_TOKEN,
  authDomain: `${GCLOUD_PROJECT}.firebaseapp.com`,
  databaseURL: `https://${GCLOUD_PROJECT}.firebaseio.com`,
  projectId: GCLOUD_PROJECT,
  storageBucket: `${GCLOUD_PROJECT}.appspot.com`,
  messagingSenderId: "177212773011",
  appId: "1:177212773011:web:18bd45abd225239fd9f366",
  measurementId: "G-444KZRHPQP",
}

export const app = initializeApp(firebaseConfig)

initializeFirestore(app, { ignoreUndefinedProperties: true })

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)

if (process.env.NODE_ENV !== "production") {
  console.log("Installing emulators..")

  connectAuthEmulator(auth, "http://localhost:9099")
  connectFirestoreEmulator(db, "localhost", 8080)
  connectFunctionsEmulator(functions, "localhost", 5001)
}
