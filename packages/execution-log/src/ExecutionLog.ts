/**
 * Execution Log
 *
 * Central storage for the sequence of execution entries.
 *
 * Responsibilities:
 *  - add entries
 *  - read entries
 *  - clear the log
 *  - get the full list of entries
 *
 * Does NOT handle display -- it forwards entries to a LogSink
 * (typically a LogDispatcher) without knowing where they end up.
 */

import type { LogEntry } from "./LogEntry"
import type { LogSink } from "./LogSink"

export class ExecutionLog {

    private readonly entries: LogEntry[] = []

    constructor(private readonly sink: LogSink) {}

    add(kind: string, payload: unknown): void {

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            kind,
            payload
        }

        this.entries.push(entry)
        this.sink.write(entry)

    }

    getEntries(): ReadonlyArray<LogEntry> {
        return this.entries
    }

    clear(): void {
        this.entries.length = 0
    }

}