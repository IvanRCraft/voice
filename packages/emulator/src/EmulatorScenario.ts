/**
 * Voice Emulator
 *
 * Holds pre-defined responses to incoming actions.
 *
 * Example mapping:
 *   "voice.recognized" -> "voice.response"
 *   (no text analysis -- purely action.type -> event.type lookup)
 */

import type { InteractionAction, InteractionEvent } from "../../interaction-contract/dist/index"

export type ScenarioHandler = (
    action: InteractionAction
) => Omit<InteractionEvent, "metadata">

export class EmulatorScenario {

    private readonly handlers =
        new Map<string, ScenarioHandler>()

    register(actionType: string, handler: ScenarioHandler): void {
        this.handlers.set(actionType, handler)
    }

    resolve(action: InteractionAction): Omit<InteractionEvent, "metadata"> {

        const handler = this.handlers.get(action.type)

        if (handler) {
            return handler(action)
        }

        // Generic fallback: the emulator implements InteractionContract
        // as a whole, not just the voice channel, so this event type
        // intentionally avoids the "voice." prefix.
        return {
            type: "interaction.unhandled-action",
            payload: { receivedType: action.type }
        }

    }

}