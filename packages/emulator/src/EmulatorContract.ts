/**
 * Voice Emulator
 *
 * Full implementation of InteractionContract for standalone
 * testing of the voice stack, without Taxi/FSM/PHP/Python/backend.
 *
 * Scenario execution is delegated to ScenarioEngine (PR-8) — this
 * class no longer hardcodes any scenario logic of its own.
 */

import type {
    InteractionAction,
    InteractionContract,
    InteractionEvent,
    InteractionSnapshot,
    Unsubscribe
} from "../../interaction-contract/dist/index"

import { ScenarioEngine } from "../../scenario-engine/dist/index"
import type { ScenarioRegistry } from "../../scenario-engine/dist/index"

import { EmulatorState } from "./EmulatorState"
import { EmulatorEventBus } from "./EmulatorEventBus"

export class EmulatorContract implements InteractionContract {

    private state: EmulatorState = EmulatorState.Idle

    private revision = 0

    private readonly bus = new EmulatorEventBus()

    private readonly engine: ScenarioEngine

    constructor(registry: ScenarioRegistry) {
        this.engine = new ScenarioEngine(registry)
    }

    async dispatch<TPayload>(
        action: InteractionAction<TPayload>
    ): Promise<void> {

        this.state = EmulatorState.Processing
        this.revision += 1

        for await (const resolved of this.engine.run(action)) {

            const event: InteractionEvent = {
                ...resolved,
                metadata: {
                    source: "emulator",
                    timestamp: new Date().toISOString()
                }
            }

            this.state = EmulatorState.Responding
            this.bus.publish(event)

        }

        this.state = EmulatorState.Idle

    }

    subscribe(
        listener: (event: InteractionEvent) => void
    ): Unsubscribe {
        return this.bus.subscribe(listener)
    }

    async snapshot(): Promise<InteractionSnapshot> {
        return {
            revision: this.revision,
            state: {
                emulatorState: this.state,
                revision: this.revision
            }
        }
    }

}