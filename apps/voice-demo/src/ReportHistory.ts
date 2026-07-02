export interface HistoryRecord {
  date: string;
  status: 'PASS' | 'PASS WITH WARNINGS' | 'FAIL';
}

export class ReportHistory {
  private storageKey = 'validation_bench_history';

  // Tarixni yuklab olish
  public getHistory(): HistoryRecord[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Yangi natijani tarixga qo'shish
  public saveRecord(status: 'PASS' | 'PASS WITH WARNINGS' | 'FAIL'): void {
    const history = this.getHistory();
    const newRecord: HistoryRecord = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD formatda
      status: status
    };

    // Yangi hisobotni ro'yxat boshiga qo'shamiz
    history.unshift(newRecord);

    // Faqat oxirgi 10 ta testni saqlab qolamiz (ortiqchasi o'chadi)
    if (history.length > 10) {
      history.pop();
    }

    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }

  // Tarixni tozalash (agar kerak bo'lsa)
  public clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }
}