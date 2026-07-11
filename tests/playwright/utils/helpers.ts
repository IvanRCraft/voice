import type { Page } from "@playwright/test"

/**
 * PR-10 test utils: shared helpers used across Validation Bench
 * Playwright specs, so individual test files stay short and readable.
 */

/** Switches the top-level Validation Mode dropdown. */
export async function setValidationMode(page: Page, mode: "automatic" | "interactive") {
    await page.locator("#mode-select").selectOption(mode)
}

/** Switches Input Source (only visible in Interactive mode). */
export async function setInputSource(page: Page, source: "mic" | "inject") {
    await page.locator("#input-source-select").selectOption(source)
}

/** Runs the Automatic "Run All" flow and waits for it to complete. */
export async function runAll(page: Page) {
    await page.locator("#btn-run-all").click()
    await page.locator("#verification-result").getByText(/PASS|FAIL/).waitFor()
}

/**
 * PR-10 fix: this originally clicked Next Step to START every step,
 * assuming a manual "Start Step, then confirm" pattern per step. But
 * per the "Variant A" fix in App.ts, only the FIRST step of a session
 * needs an explicit Start click — clicking "Next Step" to confirm a
 * step ALSO auto-starts the next one. Calling the old per-step helper
 * in a loop double-clicked "Next"/"Start" out of sync with the real
 * state machine, causing flaky/failing CI runs. This drives an entire
 * Interactive session (using Inject Action) with the correct number
 * of clicks: one to start, then one confirm+advance per step.
 */
export async function completeInteractiveSessionWithInject(page: Page, steps = 3) {
    // Starts step 1 (only step that needs an explicit "start" click).
    await page.locator("#int-btn-next").click()

    for (let i = 0; i < steps; i++) {
        await page.locator("#int-btn-recognized-yes").waitFor()
        await page.locator("#int-btn-recognized-yes").click()
        await page.locator("#int-btn-heard-yes").click()
        // Commits the current step AND auto-starts the next one
        // (or finishes the session, on the last iteration).
        await page.locator("#int-btn-next").click()
    }
}