/**
 * Voice Channel
 *
 * Configuration options for VoiceChannel.
 */
import type { RecognitionProvider } from "../provider/RecognitionProvider";
import type { SpeechProvider } from "../provider/SpeechProvider";
import type { InteractionContract } from "../../../interaction-contract/dist/index";
import type { RecognitionMapper } from "./RecognitionMapper";
import type { SpeechMapper } from "./SpeechMapper";
export interface VoiceChannelOptions {
    readonly recognition: RecognitionProvider;
    readonly speech: SpeechProvider;
    readonly interaction: InteractionContract;
    readonly recognitionMapper: RecognitionMapper;
    readonly speechMapper: SpeechMapper;
}
//# sourceMappingURL=VoiceChannelOptions.d.ts.map