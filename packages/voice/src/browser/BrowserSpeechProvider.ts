/**
 * Voice Contracts — Browser Implementation
 *
 * Implements SpeechProvider using Browser Speech Synthesis API.
 *
 * PR-9d.2 fix (per client feedback): previously speak() resolved the
 * instant window.speechSynthesis.speak(utterance) was CALLED, which
 * only means "we asked the browser to speak" — not that speech
 * actually started or finished playing. The Execution Log's "Speak"
 * entry therefore looked identical whether the browser genuinely
 * spoke the text or silently failed. This provider now tracks the
 * utterance's real onstart/onend/onerror events and exposes them via
 * optional callbacks, and speak() only resolves once the utterance
 * has actually finished (or errored).
 *
 * Does NOT know about:
 *  - events
 *  - FSM
 *  - templates
 *  - business logic
 */
import type { SpeechProvider } from "../provider/SpeechProvider"
import type { SpeechOptions } from "../types/SpeechOptions"

export class BrowserSpeechProvider implements SpeechProvider {

    public onStarted: ((text: string) => void) | null = null
    public onFinished: ((text: string) => void) | null = null
    public onError: ((text: string, message: string) => void) | null = null

    async speak(options: SpeechOptions): Promise<void> {
        const utterance = new SpeechSynthesisUtterance(options.text)
        if (options.language) {
            utterance.lang = options.language
        }

        await new Promise<void>((resolve) => {
            utterance.onstart = () => {
                this.onStarted?.(options.text)
            }
            utterance.onend = () => {
                this.onFinished?.(options.text)
                resolve()
            }
            utterance.onerror = (event) => {
                const message =
                    (event as unknown as { error?: string })?.error ?? "unknown speech synthesis error"
                this.onError?.(options.text, message)
                resolve()
            }
            window.speechSynthesis.speak(utterance)
        })
    }

    async stop(): Promise<void> {
        window.speechSynthesis.cancel()
    }
}