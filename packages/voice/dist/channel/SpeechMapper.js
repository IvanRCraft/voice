/**
 * Voice Channel
 *
 * Converts an InteractionEvent into SpeechOptions.
 *
 * This is a temporary, minimal default implementation.
 * Real response generation belongs to PR-8 (Template Renderer),
 * which can replace this mapper without changing VoiceChannel.
 */
export class DefaultSpeechMapper {
    map(event) {
        return {
            text: event.type
        };
    }
}
//# sourceMappingURL=SpeechMapper.js.map