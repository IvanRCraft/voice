/**
 * Voice Contracts
 *
 * Speaks text aloud.
 *
 * Does NOT know about:
 *  - events
 *  - FSM
 *  - templates
 *  - commands
 */
import type { SpeechOptions } from "../types/SpeechOptions";
export interface SpeechProvider {
    speak(options: SpeechOptions): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=SpeechProvider.d.ts.map