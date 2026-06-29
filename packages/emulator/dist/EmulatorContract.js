/**
 * Voice Emulator
 *
 * Full implementation of InteractionContract for standalone
 * testing of the voice stack, without Taxi/FSM/PHP/Python/backend.
 *
 * Scenario execution is delegated to ScenarioEngine (PR-8) — this
 * class no longer hardcodes any scenario logic of its own.
 */
import { ScenarioEngine } from "../../scenario-engine/dist/index";
import { EmulatorState } from "./EmulatorState";
import { EmulatorEventBus } from "./EmulatorEventBus";
export class EmulatorContract {
    state = EmulatorState.Idle;
    revision = 0;
    bus = new EmulatorEventBus();
    engine;
    constructor(registry) {
        this.engine = new ScenarioEngine(registry);
    }
    async dispatch(action) {
        this.state = EmulatorState.Processing;
        this.revision += 1;
        for await (const resolved of this.engine.run(action)) {
            const event = {
                ...resolved,
                metadata: {
                    source: "emulator",
                    timestamp: new Date().toISOString()
                }
            };
            this.state = EmulatorState.Responding;
            this.bus.publish(event);
        }
        this.state = EmulatorState.Idle;
    }
    subscribe(listener) {
        return this.bus.subscribe(listener);
    }
    async snapshot() {
        return {
            revision: this.revision,
            state: {
                emulatorState: this.state,
                revision: this.revision
            }
        };
    }
}
//# sourceMappingURL=EmulatorContract.js.map