/**
 * Scenario Engine
 *
 * A small set of built-in scenarios, used only to verify the
 * infrastructure works end to end. These are examples and can be
 * freely replaced or extended by consumers via ScenarioRegistry.
 */
export const builtinScenarios = [
    {
        name: "voice-recognized-ok",
        trigger: "voice.recognized",
        steps: [
            {
                kind: "emit",
                event: {
                    type: "interaction.ok",
                    payload: {}
                }
            }
        ]
    },
    {
        name: "echo",
        trigger: "interaction.echo",
        steps: [
            {
                kind: "emit",
                event: {
                    type: "interaction.echo-response",
                    payload: {}
                }
            }
        ]
    },
    {
        name: "delayed-response",
        trigger: "interaction.delayed",
        steps: [
            { kind: "delay", ms: 500 },
            {
                kind: "emit",
                event: {
                    type: "interaction.delayed-response",
                    payload: {}
                }
            }
        ]
    }
];
/**
 * Convenience helper: registers all built-in scenarios into the
 * given registry. Consumers that don't want the examples can
 * simply skip calling this and register their own scenarios instead.
 */
export function registerBuiltinScenarios(registry) {
    for (const scenario of builtinScenarios) {
        registry.register(scenario);
    }
}
//# sourceMappingURL=BuiltinScenarios.js.map