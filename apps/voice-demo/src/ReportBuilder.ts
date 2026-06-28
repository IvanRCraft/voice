/**
 * Validation Bench
 *
 * Builds the canonical JSON Validation Report.
 */

import type { SessionMeta } from "./SessionPanel"
import type { VerificationReport } from "../../../packages/verification/dist/index"
import type { LogEntry } from "../../../packages/execution-log/dist/index"

export interface ValidationReport {
    tester: string
    language: string
    build: string
    commit: string
    browser: string
    operatingSystem: string
    scenarioSet: string
    environment: string
    startedAt: string
    finishedAt: string
    durationMs: number
    verification: VerificationReport
    executionLog: ReadonlyArray<LogEntry>
}

export function buildReport(
    meta: SessionMeta,
    startedAt: string,
    verification: VerificationReport,
    executionLog: ReadonlyArray<LogEntry>
): ValidationReport {

    const finishedAt = new Date().toISOString()

    return {
        tester: meta.tester,
        language: meta.language,
        build: meta.build,
        commit: meta.commit,
        browser: navigator.userAgent,
        operatingSystem: navigator.platform,
        scenarioSet: meta.scenarioSet,
        environment: meta.environment,
        startedAt,
        finishedAt,
        durationMs: Date.now() - new Date(startedAt).getTime(),
        verification,
        executionLog
    }

}