/**
 * Execution Log
 *
 * Stores log entries in memory. Used by Verification Harness and
 * automated tests (PR-9b) to inspect what happened during a run.
 */
import type { LogEntry } from "./LogEntry";
import type { LogSink } from "./LogSink";
export declare class MemoryLogSink implements LogSink {
    private readonly entries;
    write(entry: LogEntry): void;
    getEntries(): ReadonlyArray<LogEntry>;
    clear(): void;
}
//# sourceMappingURL=MemoryLogSink.d.ts.map