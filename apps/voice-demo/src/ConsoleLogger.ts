/**
 * Voice Demo
 *
 * Outputs the Action/Event stream for debugging.
 * Pure debugging aid -- contains no business logic.
 */

import type {
    InteractionAction,
    InteractionEvent
} from "../../../packages/interaction-contract/dist/index"

export class ConsoleLogger {

    logAction(action: InteractionAction): void {
        console.log(`ACTION\n${action.type}`)
    }

    logEvent(event: InteractionEvent): void {
        console.log(`EVENT\n${event.type}`)
    }

    logSpeak(text: string): void {
        console.log(`SPEAK\n${text}`)
    }

}