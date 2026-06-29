/**
 * Scenario Engine
 *
 * A small set of built-in scenarios, used only to verify the
 * infrastructure works end to end. These are examples and can be
 * freely replaced or extended by consumers via ScenarioRegistry.
 */
import type { Scenario } from "./Scenario";
import type { ScenarioRegistry } from "./ScenarioRegistry";
export declare const builtinScenarios: ReadonlyArray<Scenario>;
/**
 * Convenience helper: registers all built-in scenarios into the
 * given registry. Consumers that don't want the examples can
 * simply skip calling this and register their own scenarios instead.
 */
export declare function registerBuiltinScenarios(registry: ScenarioRegistry): void;
//# sourceMappingURL=BuiltinScenarios.d.ts.map