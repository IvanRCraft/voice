import { BackendClient } from './BackendClient'; // mavjud backend client

// Hisobot interfeyslari strukturasi
export interface ReportSummary {
  status: 'PASS' | 'PASS WITH WARNINGS' | 'FAIL';
  totalScenarios: number;
  passed: number;
  failed: number;
  manualWarnings: number;
  repeatedSteps: number;
  skippedSteps: number;
  durationMs: number;
}

export interface ValidationReport {
  Session: any;
  Environment: any;
  ScenarioStatistics: any;
  Verification: any;
  ManualValidation: any;
  ExecutionLog: any;
  Summary: ReportSummary;
  Attachments: any[];
}

export class ValidationReportManager {
  private history: Array<{ date: string; status: string }> = [];

  constructor(private backendClient: BackendClient) {}

  // 1. Barcha manbalardan datani yig'ib, yagona JSON formatga keltirish
  public compileReport(
    sessionMeta: any,
    environmentInfo: any,
    verificationReport: any,
    manualValidation: any,
    executionLog: any,
    stats: Omit<ReportSummary, 'status'>
  ): ValidationReport {
    
    // Statusni avtomatik hisoblash logikasi
    let status: 'PASS' | 'PASS WITH WARNINGS' | 'FAIL' = 'PASS';
    if (stats.failed > 0) {
      status = 'FAIL';
    } else if (stats.manualWarnings > 0 || stats.repeatedSteps > 0) {
      status = 'PASS WITH WARNINGS';
    }

    const summary: ReportSummary = {
      status,
      ...stats
    };

    return {
      Session: sessionMeta,
      Environment: environmentInfo,
      ScenarioStatistics: { total: stats.totalScenarios },
      Verification: verificationReport,
      ManualValidation: manualValidation,
      ExecutionLog: executionLog,
      Summary: summary,
      Attachments: []
    };
  }

  // 2. Yuklab olish uchun fayl nomini formatlash (validation-report-YYYY-MM-DD-Tester.json)
  public generateFileName(testerName: string): string {
    const dateStr = new Date().toISOString().split('T')[0]; // 2026-07-02
    return `validation-report-${dateStr}-${testerName.replace(/\s+/g, '-')}.json`;
  }

  // 3. Mavjud BackendClient orqali hisobotni yuborish (SMTP-siz)
  public async sendReport(report: ValidationReport): Promise<{ success: boolean; message: string }> {
    try {
      // Birinchi navbatda backend ulanganini va auth holatini tekshiramiz
      const authStatus = await this.backendClient.checkAuth(); 
      if (!authStatus.isConnected) {
        return { success: false, message: "🔴 Authentication failed" };
      }

      // Mail xizmati ishlayotganini tekshirish
      const mailStatus = await this.backendClient.checkMailService();
      if (!mailStatus.isAvailable) {
        return { success: false, message: "🟡 Mail unavailable" };
      }

      // API orqali jo'natish (POST /api/v1/mail/)
      const response = await this.backendClient.post('/api/v1/mail/', {
        subject: `Validation Report: ${report.Summary.status}`,
        body: JSON.stringify(report, null, 2)
      });

      if (response.success) {
        this.saveToHistory(report.Summary.status);
        return { success: true, message: "🟢 Connected & Sent" };
      }
      
      return { success: false, message: "🔴 Failed to send report" };
    } catch (error) {
      return { success: false, message: `🔴 Error: ${error.message}` };
    }
  }

  // 4. Oxirgi hisobotlar tarixini saqlash
  private saveToHistory(status: string) {
    const dateStr = new Date().toISOString().split('T')[0];
    this.history.unshift({ date: dateStr, status });
    if (this.history.length > 10) this.history.pop(); // oxirgi 10 tasini saqlaydi
  }

  public getHistory() {
    return this.history;
  }
}