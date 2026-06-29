/**
 * Voice Emulator
 *
 * Internal event publication mechanism.
 * Used ONLY inside the emulator — not part of Platform Core.
 */
import type { InteractionEvent } from "../../interaction-contract/dist/index";
export type EmulatorEventListener = (event: InteractionEvent) => void;
export declare class EmulatorEventBus {
    private readonly listeners;
    subscribe(listener: EmulatorEventListener): () => void;
    publish(event: InteractionEvent): void;
}
//# sourceMappingURL=EmulatorEventBus.d.ts.map