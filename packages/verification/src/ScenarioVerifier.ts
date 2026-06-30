/**
 * Verification Harness
 *
 * Verifies a VerificationScenario by checking the sequence of
 * entries in an ExecutionLog against the scenario's expectations.
 *
 * Checks both kind and payload (if provided) when searching for a
 * match -- this prevents an expectation matching the wrong entry of
 * the same kind earlier in the log (e.g. a different scenario's
 * Action with the same kind "Action" but a different type).
 *
 * Measures duration from first matched entry to last matched entry,
 * not from verification start.
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

        const errors: VerificationError[] = []
        const entries = this.log.getEntries()
        let cursor = 0

        let firstTimestamp: string | null = null
        let lastTimestamp: string | null = null

        for (let i = 0; i < scenario.expectations.length; i++) {
            const expectation: VerificationExpectation = scenario.expectations[i]
            const matchIndex = this.findNextMatch(entries, cursor, expectation)

            if (matchIndex === -1) {
                if (!expectation.optional) {
                    errors.push({
                        message: `Expected entry of kind "${expectation.kind}" not found`,
                        expected: expectation,
                        index: i
                    })
                }
                continue
            }

            const entry = entries[matchIndex]

            if (!firstTimestamp) firstTimestamp = entry.timestamp
            lastTimestamp = entry.timestamp

            cursor = matchIndex + 1
        }

        const durationMs = (firstTimestamp && lastTimestamp)
            ? new Date(lastTimestamp).getTime() - new Date(firstTimestamp).getTime()
            : 0

        return {
            scenario,
            passed: errors.length === 0,
            durationMs,
            errors
        }

    }

    /**
     * Partial match: every key present in `expected` must match in `actual`.
     * Extra keys in `actual` are ignored.
     */
    private payloadMatches(actual: unknown, expected: unknown): boolean {
        if (typeof expected !== "object" || expected === null) {
            return actual === expected
        }
        if (typeof actual !== "object" || actual === null) {
            return false
        }
        const expectedObj = expected as Record<string, unknown>
        const actualObj = actual as Record<string, unknown>
        return Object.keys(expectedObj).every(key =>
            JSON.stringify(actualObj[key]) === JSON.stringify(expectedObj[key])
        )
    }

    /**
     * Finds the next entry whose kind matches AND whose payload
     * matches (if expectation.payload is provided). This avoids
     * matching an entry of the right kind but wrong content,
     * which would otherwise consume the cursor incorrectly.
     */
    private findNextMatch(
        entries: ReadonlyArray<{ kind: string; payload: unknown; timestamp: string }>,
        fromIndex: number,
        expectation: VerificationExpectation
    ): number {
        for (let i = fromIndex; i < entries.length; i++) {
            if (entries[i].kind !== expectation.kind) continue
            if (expectation.payload !== undefined && !this.payloadMatches(entries[i].payload, expectation.payload)) {
                continue
            }
            return i
        }
        return -1
    }

}