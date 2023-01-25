import { createStore } from "effector"

type Route = "login"

export const $route = createStore<Route>("login")
