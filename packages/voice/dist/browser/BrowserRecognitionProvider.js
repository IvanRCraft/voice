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
export class BrowserRecognitionProvider {
    recognition;
    listeners = new Set();
    constructor(language = "ru-RU") {
        this.recognition = this.createRecognition();
        this.configureRecognition(language);
        this.bindEvents();
    }
    async start() {
        this.recognition.start();
    }
    async stop() {
        this.recognition.stop();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    createRecognition() {
        const Ctor = window.SpeechRecognition ??
            window.webkitSpeechRecognition;
        if (!Ctor) {
            throw new Error("SpeechRecognition API is not supported in this browser.");
        }
        return new Ctor();
    }
    configureRecognition(language) {
        this.recognition.lang = language;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.continuous = false;
    }
    bindEvents() {
        this.recognition.onresult = (event) => {
            this.handleResult(event);
        };
        this.recognition.onerror = () => {
            // Intentionally left empty: this provider does not decide
            // how errors should be surfaced to the application. A
            // dedicated error channel can be added to the contract later.
        };
    }
    handleResult(event) {
        const resultItem = event.results.item(event.resultIndex);
        if (!resultItem || resultItem.length === 0) {
            return;
        }
        const alternative = resultItem.item(0);
        if (!alternative) {
            return;
        }
        const result = {
            text: alternative.transcript,
            confidence: alternative.confidence,
            language: this.recognition.lang
        };
        for (const listener of this.listeners) {
            listener(result);
        }
    }
}
//# sourceMappingURL=BrowserRecognitionProvider.js.map