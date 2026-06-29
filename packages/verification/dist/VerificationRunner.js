/**
 * Verification Harness
 *
 * Runs ScenarioVerifier against one, several, or all registered
 * scenarios and aggregates the results into a VerificationReport.
 */
import { ScenarioVerifier } from "./ScenarioVerifier";
export class VerificationRunner {
    verifier;
    constructor(log) {
        this.verifier = new ScenarioVerifier(log);
    }
    runOne(scenario) {
        return this.verifier.verify(scenario);
    }
    runMany(scenarios) {
        const results = scenarios.map((scenario) => this.verifier.verify(scenario));
        return this.buildReport(results);
    }
    runAll(scenarios) {
        return this.runMany(scenarios);
    }
    buildReport(results) {
        return {
            totalScenarios: results.length,
            passed: results.filter((r) => r.passed).length,
            failed: results.filter((r) => !r.passed).length,
            results,
            errors: results.flatMap((r) => r.errors.map((e) => e.message)),
            totalDurationMs: results.reduce((sum, r) => sum + r.durationMs, 0)
        };
    }
}
//# sourceMappingURL=VerificationRunner.js.map