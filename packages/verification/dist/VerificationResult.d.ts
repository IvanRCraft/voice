import type { VerificationScenario } from "./VerificationScenario";
export interface VerificationError {
    message: string;
    expected?: unknown;
    actual?: unknown;
    index?: number;
}
export interface VerificationResult {
    scenario: VerificationScenario;
    passed: boolean;
    durationMs: number;
    errors: VerificationError[];
}
//# sourceMappingURL=VerificationResult.d.ts.map