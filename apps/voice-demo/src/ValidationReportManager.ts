import type { SessionMeta } from "./SessionPanel"
import type { VerificationReport } from "../../../packages/verification/dist/index"
import type { LogEntry } from "../../../packages/execution-log/dist/index"

export interface Summary {
    status: "PASS" | "PASS WITH WARNINGS" | "FAIL"
    totalScenarios: number
    passed: number
    failed: number
    manualWarnings: number
    repeatedSteps: number
    skippedSteps: number
    durationMs: number
}

export interface ValidationReport {
    session: SessionMeta & { startedAt: string; finishedAt: string }
    environment: { browser: string; operatingSystem: string; language: string }
    scenarioStatistics: { total: number; passed: number; failed: number; durationMs: number }
    verification: VerificationReport
    executionLog: ReadonlyArray<LogEntry>
    summary: Summary
}

export function buildValidationReport(
    meta: SessionMeta,
    startedAt: string,
    verification: VerificationReport,
    executionLog: ReadonlyArray<LogEntry>
): ValidationReport {
    const finishedAt = new Date().toISOString()
    const durationMs = Date.now() - new Date(startedAt).getTime()
    let status: Summary["status"] = "PASS"
    if (verification.failed > 0) status = "FAIL"
    return {
        session: { ...meta, startedAt, finishedAt },
        environment: {
            browser: navigator.userAgent,
            operatingSystem: navigator.platform,
            language: navigator.language
        },
        scenarioStatistics: {
            total: verification.totalScenarios,
            passed: verification.passed,
            failed: verification.failed,
            durationMs: verification.totalDurationMs
        },
        verification,
        executionLog,
        summary: {
            status,
            totalScenarios: verification.totalScenarios,
            passed: verification.passed,
            failed: verification.failed,
            manualWarnings: 0,
            repeatedSteps: 0,
            skippedSteps: 0,
            durationMs
        }
    }
}

export function generateReportFilename(meta: SessionMeta): string {
    const date = new Date().toISOString().split("T")[0]
    const tester = meta.tester.replace(/[^a-zA-Z0-9]/g, "-")
    return `validation-report-${date}-${tester}.json`
}