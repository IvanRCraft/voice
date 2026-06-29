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
import { RealTimeDelayProvider } from "./DelayProvider";
export class ScenarioEngine {
    registry;
    delayProvider;
    constructor(registry, delayProvider = new RealTimeDelayProvider()) {
        this.registry = registry;
        this.delayProvider = delayProvider;
    }
    async *run(action) {
        const scenario = this.registry.find(action.type);
        if (!scenario) {
            yield {
                type: "interaction.unhandled-action",
                payload: { receivedType: action.type }
            };
            return;
        }
        for (const step of scenario.steps) {
            switch (step.kind) {
                case "emit":
                    yield step.event;
                    break;
                case "delay":
                    await this.delayProvider.wait(step.ms);
                    break;
                case "end":
                    return;
            }
        }
    }
}
//# sourceMappingURL=ScenarioEngine.js.map