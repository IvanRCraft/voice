/**
 * Voice Contracts — Browser Implementation
 *
 * Implements SpeechProvider using Browser Speech Synthesis API.
 *
 * Does NOT know about:
 *  - events
 *  - FSM
 *  - templates
 *  - business logic
 */
import type { SpeechProvider } from "../provider/SpeechProvider";
import type { SpeechOptions } from "../types/SpeechOptions";
export declare class BrowserSpeechProvider implements SpeechProvider {
    speak(options: SpeechOptions): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=BrowserSpeechProvider.d.ts.map