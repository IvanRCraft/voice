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
import type { InteractionEvent } from "../../../interaction-contract/dist/index";
import type { SpeechOptions } from "../types/SpeechOptions";
export interface SpeechMapper {
    map(event: InteractionEvent): SpeechOptions;
}
export declare class DefaultSpeechMapper implements SpeechMapper {
    map(event: InteractionEvent): SpeechOptions;
}
//# sourceMappingURL=SpeechMapper.d.ts.map