/**
 * Voice Contracts — Browser Implementation
 *
 * Implements RecognitionProvider using Browser Web Speech API.
 *
 * Does NOT know about:
 *  - Taxi
 *  - Driver
 *  - FSM
 *  - Interaction Contract
 *  - commands
 *  - events
 */

import type {
    RecognitionProvider,
    Unsubscribe
} from "../provider/RecognitionProvider"

import type { RecognitionResult } from "../types/RecognitionResult"

import type {
    SpeechRecognition,
    SpeechRecognitionConstructor,
    SpeechRecognitionEvent
} from "./browser-types"

export class BrowserRecognitionProvider implements RecognitionProvider {

    private readonly recognition: SpeechRecognition

    private readonly listeners =
        new Set<(result: RecognitionResult) => void>()

    constructor(language = "ru-RU") {

        this.recognition = this.createRecognition()
        this.configureRecognition(language)
        this.bindEvents()

    }

    async start(): Promise<void> {
        this.recognition.start()
    }

    async stop(): Promise<void> {
        this.recognition.stop()
    }

    subscribe(
        listener: (result: RecognitionResult) => void
    ): Unsubscribe {

        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }

    }

    private createRecognition(): SpeechRecognition {

        const Ctor: SpeechRecognitionConstructor | undefined =
            window.SpeechRecognition ??
            window.webkitSpeechRecognition

        if (!Ctor) {
            throw new Error(
                "SpeechRecognition API is not supported in this browser."
            )
        }

        return new Ctor()

    }

    private configureRecognition(language: string): void {
        this.recognition.lang = language
        this.recognition.interimResults = false
        this.recognition.maxAlternatives = 1
        this.recognition.continuous = false
    }

    private bindEvents(): void {

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            this.handleResult(event)
        }

        this.recognition.onerror = () => {
            // Intentionally left empty: this provider does not decide
            // how errors should be surfaced to the application. A
            // dedicated error channel can be added to the contract later.
        }

    }

    private handleResult(event: SpeechRecognitionEvent): void {

        const resultItem = event.results.item(event.resultIndex)

        if (!resultItem || resultItem.length === 0) {
            return
        }

        const alternative = resultItem.item(0)

        if (!alternative) {
            return
        }

        const result: RecognitionResult = {
            text: alternative.transcript,
            confidence: alternative.confidence,
            language: this.recognition.lang
        }

        for (const listener of this.listeners) {
            listener(result)
        }

    }

}