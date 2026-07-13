export class BrowserSpeechProvider {
    onStarted = null;
    onFinished = null;
    onError = null;
    async speak(options) {
        const synthesis = window.speechSynthesis;
        // Chrome may leave speechSynthesis paused after cancel(); resume so the
        // next session in a different Validation mode can still be heard.
        if (synthesis.paused) {
            synthesis.resume();
        }
        const utterance = new SpeechSynthesisUtterance(options.text);
        if (options.language) {
            utterance.lang = options.language;
        }
        await new Promise((resolve) => {
            utterance.onstart = () => {
                this.onStarted?.(options.text);
            };
            utterance.onend = () => {
                this.onFinished?.(options.text);
                resolve();
            };
            utterance.onerror = (event) => {
                const message = event?.error ?? "unknown speech synthesis error";
                this.onError?.(options.text, message);
                resolve();
            };
            synthesis.speak(utterance);
        });
    }
    async stop() {
        const synthesis = window.speechSynthesis;
        synthesis.cancel();
        if (synthesis.paused) {
            synthesis.resume();
        }
    }
}
//# sourceMappingURL=BrowserSpeechProvider.js.map