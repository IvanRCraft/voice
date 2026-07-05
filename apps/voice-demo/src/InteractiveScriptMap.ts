/**
 * Validation Bench — Interactive Mode
 *
 * Human-readable script text shown to the tester for each scenario
 * trigger, localized by session language. Lives only in voice-demo,
 * does not touch Platform Core.
 *
 * NOTE: placeholder phrases — replace with real client-approved
 * phrases per language when available.
 */

export interface InteractiveScript {
    /** Label shown before the phrase, e.g. "Скажите:" / "Say:" */
    readonly promptLabel: string
    /** The phrase the tester should say. */
    readonly spokenPhrase: string
    /** Label shown before the assistant's response, e.g. "Ассистент ответил:" */
    readonly responseLabel: string
    /** The human-readable response text (for echo, equals spokenPhrase). */
    readonly responseText: string
}

type ScriptsByTrigger = Record<string, InteractiveScript>

const SCRIPTS_RU: ScriptsByTrigger = {
    "voice.recognized": {
        promptLabel: "Скажите:",
        spokenPhrase: "Тестовая фраза 1",
        responseLabel: "Ассистент ответил:",
        responseText: "Речь распознана верно"
    },
    "interaction.echo": {
        promptLabel: "Скажите:",
        spokenPhrase: "Тестовая фраза 2",
        responseLabel: "Ассистент повторил:",
        responseText: "Тестовая фраза 2"
    },
    "interaction.delayed": {
        promptLabel: "Скажите:",
        spokenPhrase: "Тестовая фраза 3",
        responseLabel: "Ассистент ответил (с задержкой):",
        responseText: "Ответ получен с задержкой"
    }
}

const SCRIPTS_EN: ScriptsByTrigger = {
    "voice.recognized": {
        promptLabel: "Say:",
        spokenPhrase: "Test phrase 1",
        responseLabel: "Assistant replied:",
        responseText: "Speech recognized correctly"
    },
    "interaction.echo": {
        promptLabel: "Say:",
        spokenPhrase: "Test phrase 2",
        responseLabel: "Assistant repeated:",
        responseText: "Test phrase 2"
    },
    "interaction.delayed": {
        promptLabel: "Say:",
        spokenPhrase: "Test phrase 3",
        responseLabel: "Assistant replied (delayed):",
        responseText: "Delayed response received"
    }
}

const SCRIPTS_FR: ScriptsByTrigger = {
    "voice.recognized": {
        promptLabel: "Dites :",
        spokenPhrase: "Phrase de test 1",
        responseLabel: "L'assistant a répondu :",
        responseText: "Parole reconnue correctement"
    },
    "interaction.echo": {
        promptLabel: "Dites :",
        spokenPhrase: "Phrase de test 2",
        responseLabel: "L'assistant a répété :",
        responseText: "Phrase de test 2"
    },
    "interaction.delayed": {
        promptLabel: "Dites :",
        spokenPhrase: "Phrase de test 3",
        responseLabel: "L'assistant a répondu (avec délai) :",
        responseText: "Réponse différée reçue"
    }
}

const SCRIPTS_BY_LANGUAGE: Record<string, ScriptsByTrigger> = {
    "ru-RU": SCRIPTS_RU,
    "en-US": SCRIPTS_EN,
    "fr-FR": SCRIPTS_FR
}

export function getInteractiveScript(trigger: string, language: string): InteractiveScript {
    const scripts = SCRIPTS_BY_LANGUAGE[language] ?? SCRIPTS_EN
    return scripts[trigger] ?? {
        promptLabel: "Action:",
        spokenPhrase: trigger,
        responseLabel: "Response:",
        responseText: "No script defined for this language"
    }
}