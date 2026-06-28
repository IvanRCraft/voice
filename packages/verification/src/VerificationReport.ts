import type { VerificationResult } from "./VerificationResult"

export interface VerificationReport {
    totalScenarios: number
    passed: number
    failed: number
    results: VerificationResult[]
    errors: string[]
    totalDurationMs: number
}