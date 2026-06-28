/**
 * Verification Harness
 *
 * Runs ScenarioVerifier against one, several, or all registered
 * scenarios and aggregates the results into a VerificationReport.
 */

import type { ExecutionLog } from "../../execution-log/dist/index"
import { ScenarioVerifier } from "./ScenarioVerifier"
import type { VerificationScenario } from "./VerificationScenario"
import type { VerificationReport } from "./VerificationReport"
import type { VerificationResult } from "./VerificationResult"

export class VerificationRunner {

    private readonly verifier: ScenarioVerifier

    constructor(log: ExecutionLog) {
        this.verifier = new ScenarioVerifier(log)
    }

    runOne(scenario: VerificationScenario): VerificationResult {
        return this.verifier.verify(scenario)
    }

    runMany(scenarios: ReadonlyArray<VerificationScenario>): VerificationReport {

        const results: VerificationResult[] = scenarios.map(
            (scenario) => this.verifier.verify(scenario)
        )

        return this.buildReport(results)

    }

    runAll(scenarios: ReadonlyArray<VerificationScenario>): VerificationReport {
        return this.runMany(scenarios)
    }

    private buildReport(results: VerificationResult[]): VerificationReport {

        return {
            totalScenarios: results.length,
            passed: results.filter((r) => r.passed).length,
            failed: results.filter((r) => !r.passed).length,
            results,
            errors: results.flatMap((r) => r.errors.map((e) => e.message)),
            totalDurationMs: results.reduce((sum, r) => sum + r.durationMs, 0)
        }

    }

}