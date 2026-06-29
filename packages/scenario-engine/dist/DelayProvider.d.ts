/**
 * Scenario Engine
 *
 * Strategy for how "delay" steps wait. ScenarioEngine itself
 * has no knowledge of timing -- it only asks this provider to wait.
 *
 * This allows swapping behaviour without touching ScenarioEngine:
 *  - RealTimeDelayProvider: actual setTimeout-based delays.
 *  - InstantDelayProvider: resolves immediately (CI / fast tests).
 *  - Future: virtual clocks, step-by-step execution, etc.
 */
export interface DelayProvider {
    wait(ms: number): Promise<void>;
}
export declare class RealTimeDelayProvider implements DelayProvider {
    wait(ms: number): Promise<void>;
}
export declare class InstantDelayProvider implements DelayProvider {
    wait(_ms: number): Promise<void>;
}
//# sourceMappingURL=DelayProvider.d.ts.map