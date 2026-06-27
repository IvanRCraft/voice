/**
 * Voice Contracts
 *
 * Result of a speech recognition attempt.
 */

export interface RecognitionResult {

    readonly text: string

    readonly confidence: number

    readonly language?: string

}