/**
 * Voice Demo
 *
 * Entry point: bootstraps the app and mounts the minimal UI.
 */

import { bootstrap } from "./Bootstrap"
import { mountApp } from "./App"

const root = document.getElementById("app")

if (!root) {
    throw new Error("Root element #app not found.")
}

const app = bootstrap()

mountApp(root, app)