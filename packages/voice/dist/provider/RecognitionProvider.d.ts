/**
 * Voice Contracts
 *
 * Converts an audio stream into recognized text.
 *
 * Does NOT know about:
 *  - Driver
 *  - Taxi
 *  - FSM
 *  - InteractionAction
 */
import type { RecognitionResult } from "../types/RecognitionResult";
export type Unsubscribe = () => void;
export interface RecognitionProvider {
    start(): Promise<void>;
    stop(): Promise<void>;
    subscribe(listener: (result: RecognitionResult) => void): Unsubscribe;
}
//# sourceMappingURL=RecognitionProvider.d.ts.map