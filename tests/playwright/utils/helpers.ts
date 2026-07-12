import { expect, type Page } from "@playwright/test"
import fs from "node:fs/promises"

/**
 * Shared Playwright helpers for Validation Bench specs.
 * Tests interact only through the public UI and JSON report surface.
 */

export interface SessionConfig {
    tester: string
    language: string
    recognitionProvider: string
    speechProvider: string
    scenarioSet: string
    validationMode: string
}

export interface ValidationReportJson {
    Session: {
        tester: string
        language: string
        startedAt: string
    }
    TestConfiguration: {
        recognitionProvider: string
        speechProvider: string
        scenarioSet: string
        inputSource: string
    }
    ValidationMode: string
    Verification: {
        totalScenarios: number
        passed: number
        failed: number
        errors: unknown[]
    }
    ExecutionLog: Array<{ kind: string; payload: unknown }>
    Summary: {
        status: string
        totalScenarios: number
        passed: number
        failed: number
        skippedSteps: number
        durationMs: number
    }
}

const SCENARIO_TRIGGERS = ["voice.recognized", "interaction.echo", "interaction.delayed"]

/** Switches the top-level Validation Mode dropdown. */
export async function setValidationMode(page: Page, mode: "automatic" | "interactive") {
    await page.locator("#mode-select").selectOption(mode)
}

/** Switches Input Source (only visible in Interactive mode). */
export async function setInputSource(page: Page, source: "mic" | "inject") {
    await page.locator("#input-source-select").selectOption(source)
}

/** Reads the current Session Panel configuration from the UI. */
export async function readSessionConfig(page: Page): Promise<SessionConfig> {
    return {
        tester: await page.locator("#s-tester").inputValue(),
        language: await page.locator("#s-language").inputValue(),
        recognitionProvider: await page.locator("#s-recognition").inputValue(),
        speechProvider: await page.locator("#s-speech").inputValue(),
        scenarioSet: await page.locator("#s-scenario-set").inputValue(),
        validationMode: await page.locator("#mode-select").inputValue()
    }
}

/** Parses Automatic-mode progress text into an approximate completion percentage. */
export function parseAutomaticProgress(text: string): number {
    if (text === "—") return 0
    if (text === "Done") return 100

    const match = text.match(/Running scenario (\d+) of (\d+)/)
    if (!match) return 0

    const current = Number(match[1])
    const total = Number(match[2])
    if (total <= 0) return 0

    return Math.round(((current - 1) / total) * 100)
}

/** Runs Automatic "Run All" and waits until verification completes. */
export async function runAll(page: Page) {
    await page.locator("#btn-run-all").click()
    await page.locator("#verification-result").getByText(/PASS|FAIL/).waitFor()
}

/**
 * Runs "Run All" while recording Automatic-mode progress snapshots.
 * Automatic mode exposes progress as text in #obs-progress, not as a
 * percentage label — we derive percentages from that public text.
 */
export async function runAllWithProgressTracking(page: Page) {
    const snapshots: Array<{ text: string; percent: number }> = []

    const record = async () => {
        const text = await page.locator("#obs-progress").innerText()
        const percent = parseAutomaticProgress(text)
        const last = snapshots[snapshots.length - 1]
        if (!last || last.text !== text) {
            snapshots.push({ text, percent })
        }
    }

    await record()
    await page.locator("#btn-run-all").click()

    await expect.poll(async () => {
        await record()
        return await page.locator("#obs-progress").innerText()
    }, { timeout: 30_000 }).toBe("Done")

    await record()
    return snapshots
}

/** Reads the structured JSON report rendered in the public report panel. */
export async function readJsonReport(page: Page): Promise<ValidationReportJson> {
    const text = await page.locator("#json-report").innerText()
    expect(text.trim().length).toBeGreaterThan(0)
    return JSON.parse(text) as ValidationReportJson
}

/** Downloads the JSON report through the public Download button. */
export async function downloadJsonReport(page: Page): Promise<ValidationReportJson> {
    const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.locator("#btn-download").click()
    ])
    expect(download.suggestedFilename()).toMatch(/validation-report-.*\.json$/)
    const filePath = await download.path()
    expect(filePath).toBeTruthy()
    const content = await fs.readFile(filePath!, "utf-8")
    return JSON.parse(content) as ValidationReportJson
}

/** Registers a one-shot handler that dismisses the next browser dialog. */
export function dismissNextDialog(page: Page): Promise<string | null> {
    return new Promise((resolve) => {
        page.once("dialog", async (dialog) => {
            const type = dialog.type()
            await dialog.dismiss()
            resolve(type)
        })
    })
}

/**
 * Mocks backend endpoints so Send Report can be exercised in CI without
 * real network credentials. Captures the report payload from the send call.
 */
export async function setupBackendMocks(page: Page, capture: { sentReport?: ValidationReportJson }) {
    await page.route("**/api/v1/auth", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ auth_hash: "test-auth-hash" })
        })
    })

    await page.route("**/api/v1/token", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { token: "test-token", u_hash: "test-u-hash" } })
        })
    })

    await page.route("**/api/v1/data/**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { data: { site_emails: { "email-1": {} } } } })
        })
    })

    await page.route("**/api/v1/mail/**/send/**", async (route) => {
        const postData = route.request().postData() ?? ""
        const params = new URLSearchParams(postData)
        const fileParam = params.get("file")

        if (fileParam) {
            const files = JSON.parse(fileParam) as Array<{ base64: string; name: string }>
            const base64 = files[0]?.base64?.replace(/^data:.*?;base64,/, "")
            if (base64) {
                capture.sentReport = JSON.parse(
                    Buffer.from(base64, "base64").toString("utf-8")
                ) as ValidationReportJson
            }
        }

        await route.fulfill({ status: 200, body: "{}" })
    })
}

/** Asserts the canonical report sections required by the PR-9e.2 spec. */
export function assertRequiredReportSections(report: ValidationReportJson) {
    expect(report.Session).toBeTruthy()
    expect(report.TestConfiguration).toBeTruthy()
    expect(report.Summary).toBeTruthy()
    expect(report.Verification).toBeTruthy()
    expect(Array.isArray(report.ExecutionLog)).toBe(true)
}

/** Asserts Summary and Verification numbers are internally consistent. */
export function assertSummaryConsistency(report: ValidationReportJson) {
    const { Summary, Verification } = report

    expect(Summary.totalScenarios).toBe(Verification.totalScenarios)
    expect(Summary.passed).toBe(Verification.passed)
    expect(Summary.failed).toBe(Verification.failed)
    expect(Summary.passed + Summary.failed + Summary.skippedSteps).toBe(Summary.totalScenarios)
    expect(Summary.durationMs).toBeGreaterThanOrEqual(0)
    expect(typeof Summary.status).toBe("string")
    expect(Summary.status.length).toBeGreaterThan(0)
}

/** Asserts Session configuration values were copied into the report. */
export function assertConfigurationMatchesSession(
    report: ValidationReportJson,
    config: SessionConfig
) {
    expect(report.Session.language).toBe(config.language)
    expect(report.TestConfiguration.recognitionProvider).toBe(config.recognitionProvider)
    expect(report.TestConfiguration.speechProvider).toBe(config.speechProvider)
    expect(report.TestConfiguration.scenarioSet).toBe(config.scenarioSet)
    expect(report.ValidationMode.toLowerCase()).toBe(config.validationMode)
    expect(report.TestConfiguration.inputSource).toBe("inject")
}

/** Asserts Execution Log ordering and cardinality for Automatic mode. */
export function assertExecutionLog(report: ValidationReportJson, logText: string) {
    expect(report.ExecutionLog.length).toBeGreaterThan(0)

    const actionCount = (logText.match(/\[Action\]/g) ?? []).length
    expect(actionCount).toBe(report.Summary.totalScenarios)

    for (const trigger of SCENARIO_TRIGGERS.slice(0, report.Summary.totalScenarios)) {
        expect(logText).toContain(trigger)
    }

    const lines = logText.split("\n").filter((line) => line.trim().length > 0)
    const uniqueLines = new Set(lines)
    expect(uniqueLines.size).toBe(lines.length)

    let lastActionIndex = -1
    for (const trigger of SCENARIO_TRIGGERS.slice(0, report.Summary.totalScenarios)) {
        const actionIndex = lines.findIndex((line) => line.includes("[Action]") && line.includes(trigger))
        expect(actionIndex).toBeGreaterThan(lastActionIndex)
        lastActionIndex = actionIndex

        const eventIndex = lines.findIndex(
            (line, index) => index > actionIndex && line.includes("[Event]")
        )
        expect(eventIndex).toBeGreaterThan(actionIndex)

        const speakIndex = lines.findIndex(
            (line, index) => index > eventIndex && line.includes("[Speak]")
        )
        expect(speakIndex).toBeGreaterThan(eventIndex)
    }
}

/**
 * Drives an entire Interactive session (Input Source = Inject Action)
 * with the correct click pattern for the Runner state machine.
 */
export async function completeInteractiveSessionWithInject(page: Page, steps = 3) {
    await page.locator("#int-btn-next").click()

    for (let i = 0; i < steps; i++) {
        await page.locator("#int-btn-recognized-yes").waitFor()
        await page.locator("#int-btn-recognized-yes").click()
        await page.locator("#int-btn-heard-yes").click()
        await page.locator("#int-btn-next").click()
    }
}
