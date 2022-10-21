export interface EwalletTransactionBank {
  transactionId?: string;
  phone?: string;
  accountId?: number;
  feeAmount?: number;
  transactionAmount?: number;
  transactionType?: string;
  status?: string;
  content?: string;
  supplierTransactionId?: string;
  supplierAccountId?: string;
  supplierResponse?: string;
  transactionTime?: string;
  ip?: string;
  deviceInfo?: string;
  description?: string;
  supplierName?: string;
  supplierAccountNumber?: string;
}

export interface PayloadListEwalletBankTransaction {
  filter?: FilterListEwalletBankTransaction;
  paging?: {
    start: number;
    limit: number;
  };
}

export interface FilterListEwalletBankTransaction {
  transactionType?: string;
  txtSearch?: string;
  typeSearch?: string;
  gateway?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface EwalletTransactionBankReport {
  message: string;
  succeeded: boolean;
  data: EwalletTransactionReportData[];
  totalDeposit: number;
  totalCountDeposit: number;
  totalWithdraw: number;
  totalCountWithdraw: number;
}

export interface EwalletTransactionReportData {
  bankCode: string;
  supplierName: string;
  totalDeposit: number;
  countDeposit: number;
  totalWithdraw: number;
  countWithdraw: number;
}
 
export interface FilterEwalletReportTransactionBankInput {
  filter?: {
    createdAt?: {
      from?: string;
      to?: string;
    }
  }
}