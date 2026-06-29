/**
 * Execution Log
 *
 * Outputs log entries to console. One of several possible LogSink
 * implementations.
 */
import type { LogEntry } from "./LogEntry";
import type { LogSink } from "./LogSink";
export declare class ConsoleLogSink implements LogSink {
    write(entry: LogEntry): void;
}
//# sourceMappingURL=ConsoleLogSink.d.ts.map