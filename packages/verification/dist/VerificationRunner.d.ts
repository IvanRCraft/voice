/**
 * Verification Harness
 *
 * Runs ScenarioVerifier against one, several, or all registered
 * scenarios and aggregates the results into a VerificationReport.
 */
import type { ExecutionLog } from "../../execution-log/dist/index";
import type { VerificationScenario } from "./VerificationScenario";
import type { VerificationReport } from "./VerificationReport";
import type { VerificationResult } from "./VerificationResult";
export declare class VerificationRunner {
    private readonly verifier;
    constructor(log: ExecutionLog);
    runOne(scenario: VerificationScenario): VerificationResult;
    runMany(scenarios: ReadonlyArray<VerificationScenario>): VerificationReport;
    runAll(scenarios: ReadonlyArray<VerificationScenario>): VerificationReport;
    private buildReport;
}
//# sourceMappingURL=VerificationRunner.d.ts.map