/**
 * Voice Demo
 *
 * Minimal UI: Start, Stop, list of available scenarios, event log.
 * No domain-specific components -- pure demo/test harness.
 */

import type { DemoApp } from "./Bootstrap"

export function mountApp(root: HTMLElement, app: DemoApp): void {

    root.innerHTML = `
        <div style="font-family: sans-serif; padding: 1rem;">
            <h1>Voice Demo</h1>
            <button id="start-btn">Start</button>
            <button id="stop-btn">Stop</button>
            <p>Status: <span id="status">idle</span></p>
            <h3>Log</h3>
            <pre id="log" style="background:#111;color:#0f0;padding:1rem;height:300px;overflow:auto;"></pre>
        </div>
    `

    const startBtn = root.querySelector<HTMLButtonElement>("#start-btn")!
    const stopBtn = root.querySelector<HTMLButtonElement>("#stop-btn")!
    const statusEl = root.querySelector<HTMLSpanElement>("#status")!
    const logEl = root.querySelector<HTMLPreElement>("#log")!

    function appendLog(line: string): void {
        logEl.textContent += line + "\n"
        logEl.scrollTop = logEl.scrollHeight
    }

    const originalLog = console.log
    console.log = (...args: unknown[]) => {
        appendLog(args.join(" "))
        originalLog(...args)
    }

    startBtn.addEventListener("click", async () => {
        await app.channel.start()
        statusEl.textContent = app.channel.getState()
    })

    stopBtn.addEventListener("click", async () => {
        await app.channel.stop()
        statusEl.textContent = app.channel.getState()
    })

}