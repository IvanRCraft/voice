/**
 * Execution Log
 *
 * Central store for the sequence of execution entries.
 *
 * Responsibilities:
 *  - append entries
 *  - read entries
 *  - clear the log
 *
 * Does NOT know how entries are displayed or exported -- that is
 * the responsibility of LogSink implementations, optionally
 * reached through a LogDispatcher passed in at construction time.
 */
import type { LogEntry } from "./LogEntry";
import type { LogSink } from "./LogSink";
export declare class ExecutionLog {
    private readonly sink?;
    private readonly entries;
    constructor(sink?: LogSink | undefined);
    append(kind: string, payload: unknown): void;
    getEntries(): ReadonlyArray<LogEntry>;
    clear(): void;
}
//# sourceMappingURL=ExecutionLog.d.ts.map