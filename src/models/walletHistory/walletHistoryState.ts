export interface WalletHistoryState {
  loading: boolean;
  walletHistory: appHistoryData[];
}

export interface appHistoryInput {
  filter: FilterAppHistoryInput;
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface FilterAppHistoryInput {
  createdAt?: {
    from?: string;
    to?: string;
  };
  appId?: number;
  typeSearch?: string;
  txtSearch?: string;
  change?: string;
  id?: number;
}

export interface appHistoryResponse {
  message: string;
  succeeded: boolean;
  data: appHistoryData[];
}

export interface appHistoryData {
  balance: {
    before: balanceType;
    after: balanceType;
  };
  amount: number;
  accountId: number;
  change: string;
  description: string;
  referData: ReferData;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export interface balanceType {
  cash: number;
  credit: number;
}

export interface ReferData {
  service: {
    code: string
    type: string
    transaction: string
  }
  appId: number;
  amount: number;
  state: string;
  description: string;
  note: string;
  accountId: number;
  transaction: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}