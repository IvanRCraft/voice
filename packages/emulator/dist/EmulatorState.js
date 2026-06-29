/**
 * Voice Emulator
 *
 * Minimal internal state, used only to verify the infrastructure
 * (not real domain logic).
 */
export var EmulatorState;
(function (EmulatorState) {
    EmulatorState["Idle"] = "idle";
    EmulatorState["Processing"] = "processing";
    EmulatorState["Responding"] = "responding";
})(EmulatorState || (EmulatorState = {}));
//# sourceMappingURL=EmulatorState.js.map