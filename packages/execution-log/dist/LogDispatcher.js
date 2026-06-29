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
export class LogDispatcher {
    sinks = new Set();
    register(sink) {
        this.sinks.add(sink);
        return () => {
            this.sinks.delete(sink);
        };
    }
    write(entry) {
        for (const sink of this.sinks) {
            sink.write(entry);
        }
    }
}
//# sourceMappingURL=LogDispatcher.js.map