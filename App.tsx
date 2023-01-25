import { useStore } from "effector-react"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"

import { $route } from "./src/stores/route"
import Login from "./src/pages/login/page"

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Crypto Playground</Text>
      <Route />
      <StatusBar style="auto" />
    </View>
  )
}

export function Route() {
  const route = useStore($route)

  const routes = {
    login: Login,
  }

  const Component = routes[route] || <Text>404</Text>

  return <Component />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
