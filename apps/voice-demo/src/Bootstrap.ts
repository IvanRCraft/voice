/**
 * Voice Demo
 *
 * Creates and wires together all components needed for the demo:
 * BrowserRecognitionProvider, BrowserSpeechProvider, ScenarioRegistry,
 * EmulatorContract, VoiceChannel.
 */

import {
    BrowserRecognitionProvider,
    BrowserSpeechProvider
} from "../../../packages/voice/dist/browser/index"

import {
    VoiceChannel,
    DefaultRecognitionMapper,
    DefaultSpeechMapper
} from "../../../packages/voice/dist/channel/index"

import { EmulatorContract } from "../../../packages/emulator/dist/index"

import { createDemoRegistry } from "./DemoRegistry"
import { ConsoleLogger } from "./ConsoleLogger"

export interface DemoApp {

    readonly channel: VoiceChannel

    readonly logger: ConsoleLogger

}

export function bootstrap(language = "ru-RU"): DemoApp {

    const registry = createDemoRegistry()
    const interaction = new EmulatorContract(registry)

    const recognition = new BrowserRecognitionProvider(language)
    const speech = new BrowserSpeechProvider()

    const logger = new ConsoleLogger()

    const channel = new VoiceChannel({
        recognition,
        speech,
        interaction,
        recognitionMapper: new DefaultRecognitionMapper(),
        speechMapper: new DefaultSpeechMapper()
    })

    return { channel, logger }

}