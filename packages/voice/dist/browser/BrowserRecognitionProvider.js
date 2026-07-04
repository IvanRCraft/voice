/**
 * Voice Contracts — Browser Implementation
 *
 * Implements RecognitionProvider using Browser Web Speech API.
 */
export class BrowserRecognitionProvider {
    recognition;
    language;
    listeners = new Set();
    onError = null;
    onEnd = null;
    constructor(language = "ru-RU") {
        this.language = language;
        this.recognition = this.createRecognition();
        this.configureRecognition(this.language);
        this.bindEvents();
    }
    setLanguage(language) {
        this.language = language;
        this.recognition.lang = language;
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
        this.recognition.onerror = (event) => {
            this.onError?.(event.error ?? "unknown-error");
        };
        this.recognition.onend = () => {
            this.onEnd?.();
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