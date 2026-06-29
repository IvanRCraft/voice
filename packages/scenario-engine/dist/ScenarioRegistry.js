/**
 * Scenario Engine
 *
 * Holds registered scenarios, keyed by their trigger action type.
 *
 * Contains no execution logic — only storage and lookup.
 * Execution is the responsibility of ScenarioEngine.
 */
export class ScenarioRegistry {
    scenarios = new Map();
    register(scenario) {
        this.scenarios.set(scenario.trigger, scenario);
    }
    unregister(trigger) {
        this.scenarios.delete(trigger);
    }
    find(trigger) {
        return this.scenarios.get(trigger);
    }
    list() {
        return Array.from(this.scenarios.values());
    }
}
//# sourceMappingURL=ScenarioRegistry.js.map