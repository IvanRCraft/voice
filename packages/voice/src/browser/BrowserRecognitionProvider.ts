/**
 * Voice Contracts — Browser Implementation
 *
 * Implements RecognitionProvider using Browser Web Speech API.
 */

import type {
    RecognitionProvider,
    Unsubscribe
} from "../provider/RecognitionProvider"

import type { RecognitionResult } from "../types/RecognitionResult"

import type {
    SpeechRecognition,
    SpeechRecognitionConstructor,
    SpeechRecognitionEvent,
    SpeechRecognitionErrorEvent
} from "./browser-types"

export class BrowserRecognitionProvider implements RecognitionProvider {

    private recognition: SpeechRecognition
    private language: string

    private readonly listeners =
        new Set<(result: RecognitionResult) => void>()

    public onError: ((message: string) => void) | null = null
    public onEnd: (() => void) | null = null

    constructor(language = "ru-RU") {
        this.language = language
        this.recognition = this.createRecognition()
        this.configureRecognition(this.language)
        this.bindEvents()
    }

    setLanguage(language: string): void {
        this.language = language
        this.recognition.lang = language
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

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            this.onError?.(event.error ?? "unknown-error")
        }

        this.recognition.onend = () => {
            this.onEnd?.()
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