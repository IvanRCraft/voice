/**
 * Voice Demo
 *
 * Registers the built-in scenarios for the demo. Custom scenarios
 * can be added here later without touching the rest of the app.
 */

import { ScenarioRegistry, registerBuiltinScenarios } from "../../../packages/scenario-engine/dist/index"

export function createDemoRegistry(): ScenarioRegistry {

    const registry = new ScenarioRegistry()

    registerBuiltinScenarios(registry)

    return registry

}