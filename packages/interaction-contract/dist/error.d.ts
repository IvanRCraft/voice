/**
 * Universal Interaction Contract
 *
 * Error hierarchy.
 */
export declare abstract class InteractionError extends Error {
    protected constructor(message: string);
}
export declare class TransportError extends InteractionError {
    constructor(message?: string);
}
export declare class ValidationError extends InteractionError {
    constructor(message?: string);
}
export declare class TimeoutError extends InteractionError {
    constructor(message?: string);
}
//# sourceMappingURL=error.d.ts.map