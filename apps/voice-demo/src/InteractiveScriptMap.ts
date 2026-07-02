/**
 * Validation Bench — Interactive Mode
 *
 * Human-readable script text shown to the tester for each scenario
 * trigger. Lives only in voice-demo, does not touch Platform Core.
 *
 * NOTE: placeholder text — replace with real phrases from the client.
 */

export interface InteractiveScript {
    /** What the tester should say / do to trigger this scenario. */
    readonly promptText: string
    /** What the tester should expect to hear back. */
    readonly expectedText: string
}

export const interactiveScriptMap: Record<string, InteractiveScript> = {
    "voice.recognized": {
        promptText: "Скажите: \"Тестовая фраза 1\"",
        expectedText: "Ожидаемый ответ: подтверждение распознавания"
    },
    "interaction.echo": {
        promptText: "Скажите: \"Тестовая фраза 2\"",
        expectedText: "Ожидаемый ответ: эхо-повтор фразы"
    },
    "interaction.delayed": {
        promptText: "Скажите: \"Тестовая фраза 3\"",
        expectedText: "Ожидаемый ответ: ответ с задержкой"
    }
}

export function getInteractiveScript(trigger: string): InteractiveScript {
    return interactiveScriptMap[trigger] ?? {
        promptText: `Выполните действие: ${trigger}`,
        expectedText: "Ожидаемый ответ не задан"
    }
}