/**
 * Voice Contracts
 *
 * Composition of RecognitionProvider and SpeechProvider.
 *
 * Contains no logic of its own.
 */

import type { RecognitionProvider } from "./RecognitionProvider"
import type { SpeechProvider } from "./SpeechProvider"

export interface VoiceProvider {

    readonly recognition: RecognitionProvider

    readonly speech: SpeechProvider

}