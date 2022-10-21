export interface InputReportTransaction {
  from?: string;
  to?: string;
}

export interface CttReportTransaction {
  month?: string;
  successCount?: number;
  successAmount?: number;
  failAmount?: number;
  failCount?: number;
}
