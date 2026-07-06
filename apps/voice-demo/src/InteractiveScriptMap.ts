/**
 * Validation Bench — Interactive Mode
 *
 * Human-readable script text shown to the tester for each scenario
 * trigger, localized per session language.
 *
 * PR-9d.2 fix: previously the prompt asked the tester to say an exact
 * scripted phrase ("Тестовая фраза 1"), which mixed two different test
 * types — "repeat what's written" vs "recognize an arbitrary phrase".
 * Since the actual recognition/logging pipeline works with whatever
 * the tester really says (not a fixed script), the prompt now simply
 * asks the tester to say any phrase.
 */

export interface InteractiveScript {
    readonly promptText: string
    readonly expectedText: string
}

type ScriptsByTrigger = Record<string, InteractiveScript>

const SCRIPTS_RU: ScriptsByTrigger = {
    "voice.recognized": {
        promptText: "Произнесите любую фразу",
        expectedText: "Ожидаемый ответ: подтверждение распознавания"
    },
    "interaction.echo": {
        promptText: "Произнесите любую фразу",
        expectedText: "Ожидаемый ответ: эхо-повтор фразы"
    },
    "interaction.delayed": {
        promptText: "Произнесите любую фразу",
        expectedText: "Ожидаемый ответ: ответ с задержкой"
    }
}

const SCRIPTS_EN: ScriptsByTrigger = {
    "voice.recognized": {
        promptText: "Say any phrase",
        expectedText: "Expected response: recognition confirmed"
    },
    "interaction.echo": {
        promptText: "Say any phrase",
        expectedText: "Expected response: echo of the phrase"
    },
    "interaction.delayed": {
        promptText: "Say any phrase",
        expectedText: "Expected response: delayed reply"
    }
}

const SCRIPTS_FR: ScriptsByTrigger = {
    "voice.recognized": {
        promptText: "Dites n'importe quelle phrase",
        expectedText: "Réponse attendue : reconnaissance confirmée"
    },
    "interaction.echo": {
        promptText: "Dites n'importe quelle phrase",
        expectedText: "Réponse attendue : écho de la phrase"
    },
    "interaction.delayed": {
        promptText: "Dites n'importe quelle phrase",
        expectedText: "Réponse attendue : réponse différée"
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
        promptText: `Perform action: ${trigger}`,
        expectedText: "No expected response defined"
    }
}

const STEP_LABEL_BY_LANGUAGE: Record<string, string> = {
    "ru-RU": "Шаг",
    "en-US": "Step",
    "fr-FR": "Étape"
}

export function getStepLabel(language: string): string {
    return STEP_LABEL_BY_LANGUAGE[language] ?? STEP_LABEL_BY_LANGUAGE["en-US"]
}