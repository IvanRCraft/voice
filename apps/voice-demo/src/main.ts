import { bootstrap } from "./Bootstrap"
import { mountApp } from "./App"

const app = bootstrap()
const root = document.querySelector<HTMLElement>("#app")!
mountApp(root, app)