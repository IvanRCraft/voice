/**
 * Voice Emulator
 *
 * Full implementation of InteractionContract for standalone
 * testing of the voice stack, without Taxi/FSM/PHP/Python/backend.
 *
 * Scenario execution is delegated to ScenarioEngine (PR-8) — this
 * class no longer hardcodes any scenario logic of its own.
 */
import type { InteractionAction, InteractionContract, InteractionEvent, InteractionSnapshot, Unsubscribe } from "../../interaction-contract/dist/index";
import type { ScenarioRegistry } from "../../scenario-engine/dist/index";
export declare class EmulatorContract implements InteractionContract {
    private state;
    private revision;
    private readonly bus;
    private readonly engine;
    constructor(registry: ScenarioRegistry);
    dispatch<TPayload>(action: InteractionAction<TPayload>): Promise<void>;
    subscribe(listener: (event: InteractionEvent) => void): Unsubscribe;
    snapshot(): Promise<InteractionSnapshot>;
}
//# sourceMappingURL=EmulatorContract.d.ts.map