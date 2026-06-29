/**
 * Verification Harness
 *
 * Verifies a VerificationScenario by checking the sequence of
 * entries in an ExecutionLog against the scenario's expectations.
 *
 * Never writes to ExecutionLog -- only reads it.
 */
export class ScenarioVerifier {
    log;
    constructor(log) {
        this.log = log;
    }
    verify(scenario) {
        const start = Date.now();
        const errors = [];
        const entries = this.log.getEntries();
        let cursor = 0;
        for (let i = 0; i < scenario.expectations.length; i++) {
            const expectation = scenario.expectations[i];
            const matchIndex = this.findNextMatch(entries, cursor, expectation);
            if (matchIndex === -1) {
                if (!expectation.optional) {
                    errors.push({
                        message: `Expected entry of kind "${expectation.type}" not found`,
                        expected: expectation,
                        index: i
                    });
                }
                continue;
            }
            cursor = matchIndex + 1;
        }
        return {
            scenario,
            passed: errors.length === 0,
            durationMs: Date.now() - start,
            errors
        };
    }
    findNextMatch(entries, fromIndex, expectation) {
        for (let i = fromIndex; i < entries.length; i++) {
            if (entries[i].kind === expectation.type) {
                return i;
            }
        }
        return -1;
    }
}
//# sourceMappingURL=ScenarioVerifier.js.map