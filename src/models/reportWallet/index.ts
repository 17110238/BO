export interface SearchReportWallet {
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface ReportWallet {
  month?: string;
  total?: number;
  kycAmount?: number;
  activeAccountAmount?: number;
}

export interface BalanceReportWallet {
  balance?: number;
  balanceOpen?: number;
  balanceLock?: number;
}

export interface KycReportWallet {
  userReg?: number;
  userKyc?: number;
  userLinked?: number;
}
