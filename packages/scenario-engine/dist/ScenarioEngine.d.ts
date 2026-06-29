/**
 * Scenario Engine
 *
 * Takes an InteractionAction and a ScenarioRegistry, and produces
 * a sequence of InteractionEvent according to the matching scenario.
 *
 * Does NOT know about:
 *  - Voice
 *  - Browser
 *  - Taxi
 *  - FSM
 *  - React
 *  - real time (delegated entirely to DelayProvider)
 *
 * If no scenario matches the action, a generic fallback event is
 * produced (mirrors the previous EmulatorScenario default).
 */
import type { InteractionAction } from "../../interaction-contract/dist/index";
import type { ScenarioEvent } from "./Scenario";
import type { ScenarioRegistry } from "./ScenarioRegistry";
import type { DelayProvider } from "./DelayProvider";
export declare class ScenarioEngine {
    private readonly registry;
    private readonly delayProvider;
    constructor(registry: ScenarioRegistry, delayProvider?: DelayProvider);
    run(action: InteractionAction): AsyncGenerator<ScenarioEvent>;
}
//# sourceMappingURL=ScenarioEngine.d.ts.map