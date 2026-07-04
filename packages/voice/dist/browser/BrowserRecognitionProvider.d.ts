/**
 * Voice Contracts — Browser Implementation
 *
 * Implements RecognitionProvider using Browser Web Speech API.
 */
import type { RecognitionProvider, Unsubscribe } from "../provider/RecognitionProvider";
import type { RecognitionResult } from "../types/RecognitionResult";
export declare class BrowserRecognitionProvider implements RecognitionProvider {
    private recognition;
    private language;
    private readonly listeners;
    onError: ((message: string) => void) | null;
    onEnd: (() => void) | null;
    constructor(language?: string);
    setLanguage(language: string): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    subscribe(listener: (result: RecognitionResult) => void): Unsubscribe;
    private createRecognition;
    private configureRecognition;
    private bindEvents;
    private handleResult;
}
//# sourceMappingURL=BrowserRecognitionProvider.d.ts.map