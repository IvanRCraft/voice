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
export class RealTimeDelayProvider {
    wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
export class InstantDelayProvider {
    async wait(_ms) {
        // Intentionally does nothing -- used for CI / fast test runs
        // where real-time delays would only slow down the suite.
    }
}
//# sourceMappingURL=DelayProvider.js.map