import type { VerificationExpectation } from "./VerificationExpectation"

export interface VerificationScenario {
    id: string
    name: string
    expectations: VerificationExpectation[]
    expectedFinalState?: Record<string, unknown>
    expectedResult?: string
}