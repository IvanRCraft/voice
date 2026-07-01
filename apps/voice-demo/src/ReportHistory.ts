import type { ValidationReport } from "./ValidationReportManager"

export interface ReportHistoryEntry {
    id: string
    timestamp: string
    status: string
    tester: string
    report: ValidationReport
}

export class ReportHistory {

    private readonly entries: ReportHistoryEntry[] = []
    private readonly maxEntries: number

    constructor(maxEntries = 10) {
        this.maxEntries = maxEntries
    }

    add(report: ValidationReport): ReportHistoryEntry {
        const entry: ReportHistoryEntry = {
            id: Date.now().toString(),
            timestamp: report.session.finishedAt,
            status: report.summary.status,
            tester: report.session.tester,
            report
        }
        this.entries.unshift(entry)
        if (this.entries.length > this.maxEntries) {
            this.entries.pop()
        }
        return entry
    }

    getAll(): ReadonlyArray<ReportHistoryEntry> {
        return this.entries
    }

    clear(): void {
        this.entries.length = 0
    }

}