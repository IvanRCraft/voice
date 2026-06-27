/**
 * Voice Emulator
 *
 * Internal event publication mechanism.
 * Used ONLY inside the emulator — not part of Platform Core.
 */

import type { InteractionEvent } from "../../interaction-contract/dist/index"

export type EmulatorEventListener = (event: InteractionEvent) => void

export class EmulatorEventBus {

    private readonly listeners = new Set<EmulatorEventListener>()

    subscribe(listener: EmulatorEventListener): () => void {

        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }

    }

    publish(event: InteractionEvent): void {

        for (const listener of this.listeners) {
            listener(event)
        }

    }

}