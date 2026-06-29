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
export class BrowserSpeechProvider {
    async speak(options) {
        const utterance = new SpeechSynthesisUtterance(options.text);
        if (options.language) {
            utterance.lang = options.language;
        }
        window.speechSynthesis.speak(utterance);
    }
    async stop() {
        window.speechSynthesis.cancel();
    }
}
//# sourceMappingURL=BrowserSpeechProvider.js.map