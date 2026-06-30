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
import type { ExecutionLog } from "../../execution-log/dist/index";
import type { VerificationScenario } from "./VerificationScenario";
import type { VerificationResult } from "./VerificationResult";
export declare class ScenarioVerifier {
    private readonly log;
    constructor(log: ExecutionLog);
    verify(scenario: VerificationScenario): VerificationResult;
    /**
     * Partial match: every key present in `expected` must match in `actual`.
     * Extra keys in `actual` are ignored.
     */
    private payloadMatches;
    /**
     * Finds the next entry whose kind matches AND whose payload
     * matches (if expectation.payload is provided). This avoids
     * matching an entry of the right kind but wrong content,
     * which would otherwise consume the cursor incorrectly.
     */
    private findNextMatch;
}
//# sourceMappingURL=ScenarioVerifier.d.ts.map