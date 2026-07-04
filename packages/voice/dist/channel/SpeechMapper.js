/**
 * Voice Channel
 *
 * Converts an InteractionEvent into SpeechOptions.
 *
 * This is a temporary, minimal default implementation.
 * Real response generation belongs to PR-8 (Template Renderer),
 * which can replace this mapper without changing VoiceChannel.
 *
 * PR-9d.2: if the event carries a `recognizedText` field in its
 * payload (attached automatically by ScenarioEngine when the
 * triggering action came from real speech recognition), that text
 * is spoken back instead of the raw technical event type.
 */
export class DefaultSpeechMapper {
    map(event) {
        const payload = event.payload;
        const recognizedText = payload && typeof payload.recognizedText === "string"
            ? payload.recognizedText
            : undefined;
        return {
            text: recognizedText ?? event.type
        };
    }
}
//# sourceMappingURL=SpeechMapper.js.map