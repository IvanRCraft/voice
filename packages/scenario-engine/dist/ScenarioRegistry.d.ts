/**
 * Scenario Engine
 *
 * Holds registered scenarios, keyed by their trigger action type.
 *
 * Contains no execution logic — only storage and lookup.
 * Execution is the responsibility of ScenarioEngine.
 */
import type { Scenario } from "./Scenario";
export declare class ScenarioRegistry {
    private readonly scenarios;
    register(scenario: Scenario): void;
    unregister(trigger: string): void;
    find(trigger: string): Scenario | undefined;
    list(): ReadonlyArray<Scenario>;
}
//# sourceMappingURL=ScenarioRegistry.d.ts.map