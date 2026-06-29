/**
 * Execution Log
 *
 * Outputs log entries to console. One of several possible LogSink
 * implementations.
 */
export class ConsoleLogSink {
    write(entry) {
        console.log(`[${entry.kind}]`, entry.payload);
    }
}
//# sourceMappingURL=ConsoleLogSink.js.map