/**
 * Voice Emulator
 *
 * Full implementation of InteractionContract for standalone
 * testing of the voice stack, without Taxi/FSM/PHP/Python/backend.
 */

import type {
    InteractionAction,
    InteractionContract,
    InteractionEvent,
    InteractionSnapshot,
    Unsubscribe
} from "../../interaction-contract/dist/index"

import { EmulatorState } from "./EmulatorState"
import { EmulatorScenario } from "./EmulatorScenario"
import { EmulatorEventBus } from "./EmulatorEventBus"

export class EmulatorContract implements InteractionContract {

    private state: EmulatorState = EmulatorState.Idle

    private revision = 0

    private readonly bus = new EmulatorEventBus()

    private readonly scenario: EmulatorScenario

    constructor(scenario: EmulatorScenario = new EmulatorScenario()) {
        this.scenario = scenario
    }

    async dispatch<TPayload>(
        action: InteractionAction<TPayload>
    ): Promise<void> {

        this.state = EmulatorState.Processing
        this.revision += 1

        const resolved = this.scenario.resolve(action)

        const event: InteractionEvent = {
            ...resolved,
            metadata: {
                source: "emulator",
                timestamp: new Date().toISOString()
            }
        }

        this.state = EmulatorState.Responding
        this.bus.publish(event)
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
                emulatorState: this.state
            }
        }
    }

}