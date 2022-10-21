export interface GetBalanceResponsed {
  balance?: number;
  balanceOpen?: number;
  balanceLock?: number;
}

export interface GetTotalUserResponsed {
  userReg?: number;
  userKyc?: number;
  userLinked?: number;
  userOpen?: number;
}

export interface CreatedAtPaymentInput {
  from?: string;
  to?: string;
}

export interface FilterReportEwalletAccountInput {
  accountId?: number;
  createdAt?: CreatedAtPaymentInput;
}

export interface ReportEwalletAccountInput {
  filter?: FilterReportEwalletAccountInput;
}

export interface AccountStatmentSecureWalletData {
  bankName?: string;
  accountNumber?: string;
  debitQuantity?: number;
  debitAmount?: number;
  creditQuantity?: number;
  creditAmount?: number;
  surplus?: number;
}
export interface AccountStatmentSecureWalletResponsed {
  accountList?: [AccountStatmentSecureWalletData];
  total?: AccountStatmentSecureWalletData;
}
