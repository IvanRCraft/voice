/**
 * Execution Log
 *
 * Stores log entries in memory. Used by Verification Harness and
 * automated tests (PR-9b) to inspect what happened during a run.
 */
export class MemoryLogSink {
    entries = [];
    write(entry) {
        this.entries.push(entry);
    }
    getEntries() {
        return this.entries;
    }
    clear() {
        this.entries.length = 0;
    }
}
//# sourceMappingURL=MemoryLogSink.js.map