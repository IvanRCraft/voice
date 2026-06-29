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
import type { VoiceChannelOptions } from "./VoiceChannelOptions";
import { VoiceChannelState } from "./VoiceChannelState";
export declare class VoiceChannel {
    private readonly options;
    private state;
    private unsubscribeRecognition;
    private unsubscribeInteraction;
    constructor(options: VoiceChannelOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    getState(): VoiceChannelState;
    private handleRecognitionResult;
    private handleInteractionEvent;
}
//# sourceMappingURL=VoiceChannel.d.ts.map