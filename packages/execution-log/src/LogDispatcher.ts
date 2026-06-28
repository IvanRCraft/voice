/**
 * Execution Log
 *
 * Receives entries from ExecutionLog and forwards them to all
 * registered LogSink instances (console, memory, file, HTML, etc).
 */

import type { LogEntry } from "./LogEntry"
import type { LogSink } from "./LogSink"

export class LogDispatcher implements LogSink {

    private readonly sinks: LogSink[] = []

    addSink(sink: LogSink): void {
        this.sinks.push(sink)
    }

    removeSink(sink: LogSink): void {
        const index = this.sinks.indexOf(sink)
        if (index !== -1) {
            this.sinks.splice(index, 1)
        }
    }

    write(entry: LogEntry): void {
        for (const sink of this.sinks) {
            sink.write(entry)
        }
    }

}