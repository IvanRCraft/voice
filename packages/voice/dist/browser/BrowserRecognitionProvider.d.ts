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
    /**
     * PR-9d.2 fix: the Web Speech API's stop() is asynchronous under
     * the hood — the real "end" of the session only happens when the
     * 'onend' event fires, some time after recognition.stop() is
     * called. The previous implementation resolved stop() immediately
     * without waiting for that, so callers doing
     * `await stop(); await start()` back-to-back (as the Interactive
     * Runner does between steps) could start a new session before the
     * browser had actually finished the previous one. That race
     * occasionally caused the engine to deliver the same result twice
     * (observed as a duplicated Action/Event/Speak triple for a single
     * spoken step). stop() now properly waits for the real 'onend'
     * event before resolving, so start() is never called while a
     * previous session is still winding down.
     */
    private isActive;
    private pendingEndResolvers;
    constructor(language?: string);
    start(): Promise<void>;
    stop(): Promise<void>;
    subscribe(listener: (result: RecognitionResult) => void): Unsubscribe;
    setLanguage(language: string): void;
    private createRecognition;
    private configureRecognition;
    private bindEvents;
    private handleResult;
}
//# sourceMappingURL=BrowserRecognitionProvider.d.ts.map