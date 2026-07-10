export class BrowserSpeechProvider {
    onStarted = null;
    onFinished = null;
    onError = null;
    async speak(options) {
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
            window.speechSynthesis.speak(utterance);
        });
    }
    async stop() {
        window.speechSynthesis.cancel();
    }
}
//# sourceMappingURL=BrowserSpeechProvider.js.map