export interface SettingDeposit {
  id?: number;
  merchantName?: string;
  merchantId?: number;
  sumBalanceDay?: number;
  minBalanceRate?: number;
  minBalanceAmount?: number;
  description?: string;
}

export interface PayloadSearchDeposit {
  filter?:
    | {
        merchantId: number;
      }
    | {};
  payload?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt?: number;
    id?: number;
  };
}

export interface PayloadUpdateDeposit {
  id: number;
  value: {
    sumBalanceDay?: number;
    minBalanceRate?: number;
    minBalanceAmount?: number;
  };
  description: string;
}
