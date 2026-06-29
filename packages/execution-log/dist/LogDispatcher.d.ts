/**
 * Execution Log
 *
 * Receives entries from ExecutionLog and forwards them to every
 * registered LogSink. A single log can simultaneously be sent to
 * Console, memory, a file, HTML, or future analysis tools.
 *
 * Implements LogSink itself, so an ExecutionLog can write to a
 * LogDispatcher exactly as it would to any single sink.
 */
import type { LogEntry } from "./LogEntry";
import type { LogSink } from "./LogSink";
export declare class LogDispatcher implements LogSink {
    private readonly sinks;
    register(sink: LogSink): () => void;
    write(entry: LogEntry): void;
}
//# sourceMappingURL=LogDispatcher.d.ts.map