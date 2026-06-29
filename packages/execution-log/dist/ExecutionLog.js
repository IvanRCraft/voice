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
export class ExecutionLog {
    sink;
    entries = [];
    constructor(sink) {
        this.sink = sink;
    }
    append(kind, payload) {
        const entry = {
            timestamp: new Date().toISOString(),
            kind,
            payload
        };
        this.entries.push(entry);
        this.sink?.write(entry);
    }
    getEntries() {
        return this.entries;
    }
    clear() {
        this.entries.length = 0;
    }
}
//# sourceMappingURL=ExecutionLog.js.map