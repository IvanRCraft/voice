/**
 * Voice Emulator
 *
 * Internal event publication mechanism.
 * Used ONLY inside the emulator — not part of Platform Core.
 */
export class EmulatorEventBus {
    listeners = new Set();
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    publish(event) {
        for (const listener of this.listeners) {
            listener(event);
        }
    }
}
//# sourceMappingURL=EmulatorEventBus.js.map