/**
 * Verification Harness
 *
 * Verifies a VerificationScenario by checking the sequence of
 * entries in an ExecutionLog against the scenario's expectations.
 *
 * Never writes to ExecutionLog -- only reads it.
 */
import type { ExecutionLog } from "../../execution-log/dist/index";
import type { VerificationScenario } from "./VerificationScenario";
import type { VerificationResult } from "./VerificationResult";
export declare class ScenarioVerifier {
    private readonly log;
    constructor(log: ExecutionLog);
    verify(scenario: VerificationScenario): VerificationResult;
    private findNextMatch;
}
//# sourceMappingURL=ScenarioVerifier.d.ts.map