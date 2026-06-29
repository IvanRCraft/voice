/**
 * Voice Contracts — Browser Implementation
 *
 * Implements RecognitionProvider using Browser Web Speech API.
 *
 * Does NOT know about:
 *  - Taxi
 *  - Driver
 *  - FSM
 *  - Interaction Contract
 *  - commands
 *  - events
 */
import type { RecognitionProvider, Unsubscribe } from "../provider/RecognitionProvider";
import type { RecognitionResult } from "../types/RecognitionResult";
export declare class BrowserRecognitionProvider implements RecognitionProvider {
    private readonly recognition;
    private readonly listeners;
    constructor(language?: string);
    start(): Promise<void>;
    stop(): Promise<void>;
    subscribe(listener: (result: RecognitionResult) => void): Unsubscribe;
    private createRecognition;
    private configureRecognition;
    private bindEvents;
    private handleResult;
}
//# sourceMappingURL=BrowserRecognitionProvider.d.ts.map