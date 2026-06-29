/**
 * Voice Channel
 *
 * Connects voice providers (RecognitionProvider, SpeechProvider)
 * with the universal interaction-contract.
 *
 * Pure transport: this class contains NO domain logic, NO intent
 * resolution and NO template rendering of its own. Conversion is
 * delegated to RecognitionMapper / SpeechMapper, which can be
 * replaced later (PR-7, PR-8) without changing this class.
 *
 * Does NOT know about:
 *  - Taxi
 *  - Driver
 *  - FSM
 *  - React
 */
import { VoiceChannelState } from "./VoiceChannelState";
export class VoiceChannel {
    options;
    state = VoiceChannelState.Idle;
    unsubscribeRecognition = null;
    unsubscribeInteraction = null;
    constructor(options) {
        this.options = options;
    }
    async start() {
        if (this.state === VoiceChannelState.Running) {
            return;
        }
        this.unsubscribeRecognition =
            this.options.recognition.subscribe((result) => this.handleRecognitionResult(result));
        this.unsubscribeInteraction =
            this.options.interaction.subscribe((event) => this.handleInteractionEvent(event));
        await this.options.recognition.start();
        this.state = VoiceChannelState.Running;
    }
    async stop() {
        if (this.state !== VoiceChannelState.Running) {
            return;
        }
        await this.options.recognition.stop();
        await this.options.speech.stop();
        this.unsubscribeRecognition?.();
        this.unsubscribeRecognition = null;
        this.unsubscribeInteraction?.();
        this.unsubscribeInteraction = null;
        this.state = VoiceChannelState.Stopped;
    }
    getState() {
        return this.state;
    }
    handleRecognitionResult(result) {
        const action = this.options.recognitionMapper.map(result);
        this.options.interaction
            .dispatch(action)
            .catch((error) => {
            // Per review: dispatch() failures are intentionally
            // swallowed at this layer for now. The channel does
            // not implement retries or error surfacing — this is
            // a deliberate, documented limitation of PR-6.
            void error;
        });
    }
    handleInteractionEvent(event) {
        const speechOptions = this.options.speechMapper.map(event);
        void this.options.speech.speak(speechOptions);
    }
}
//# sourceMappingURL=VoiceChannel.js.map