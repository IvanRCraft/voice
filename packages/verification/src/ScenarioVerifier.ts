/**
 * Verification Harness
 *
 * Verifies a VerificationScenario by checking the sequence of
 * entries in an ExecutionLog against the scenario's expectations.
 *
 * Never writes to ExecutionLog -- only reads it.
 */

import type { ExecutionLog } from "../../execution-log/dist/index"
import type { VerificationScenario } from "./VerificationScenario"
import type { VerificationExpectation } from "./VerificationExpectation"
import type { VerificationResult, VerificationError } from "./VerificationResult"

export class ScenarioVerifier {

    constructor(private readonly log: ExecutionLog) {}

    verify(scenario: VerificationScenario): VerificationResult {

        const start = Date.now()
        const errors: VerificationError[] = []

        const entries = this.log.getEntries()

        let cursor = 0

        for (let i = 0; i < scenario.expectations.length; i++) {
            const expectation: VerificationExpectation = scenario.expectations[i]

            const matchIndex = this.findNextMatch(entries, cursor, expectation)

            if (matchIndex === -1) {
                if (!expectation.optional) {
                    errors.push({
                        message: `Expected entry of kind "${expectation.type}" not found`,
                        expected: expectation,
                        index: i
                    })
                }
                continue
            }

            cursor = matchIndex + 1
        }

        return {
            scenario,
            passed: errors.length === 0,
            durationMs: Date.now() - start,
            errors
        }

    }

    private findNextMatch(
        entries: ReadonlyArray<{ kind: string; payload: unknown }>,
        fromIndex: number,
        expectation: VerificationExpectation
    ): number {

        for (let i = fromIndex; i < entries.length; i++) {
            if (entries[i].kind === expectation.type) {
                return i
            }
        }

        return -1

    }

}