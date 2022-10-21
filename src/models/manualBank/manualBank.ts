import { EwalletPaymentBoState } from "models";

export interface ListAccountBankSearch {
  filter: {
    isActive?: boolean;
    swiftCode?: string;
  };
  paging: {
    start?: number;
    limit?: number;
  };
}
export interface ManualBankSearch {
  swiftCode?: string;
  bankId?: number;
  createdAt: {
    from?: string;
    to?: string;
  };
}

export interface initialStateManualBank {
  loading: boolean;
  listBank?: Array<BankInfoType>;
  listAccountBank?: Array<DepositBankType>;
  manualBank?: {
    data: Array<ReportManulBankingType>;
    total: any;
  };
  listManualDeposit?:Array<EwalletPaymentType>
}

export interface DepositBankType {
  id?: number;
  fullName?: string;
  number?: string;
  city?: string;
  branch?: string;
  totalDeposit?: number;
  balance?: number;
  isActive?: boolean;
  bankName?: string;
}

export interface BankInfoType {
  swiftCode?: string;
  bankName?: string;
}

export interface ReportManulBankingType {
  date?: Date;
  amount?: number;
  count?: number;
  total?: number;
  fee?: number;
}

export interface TotalReportType {
  amount?: number;
  count?: number;
  total?: number;
  fee?: number;
}

export interface DataManualBank {
  data: ReportManulBankingType[];
  total: TotalReportType;
}

export interface EwalletPaymentType {
  id?: number
  bankId?: string
  transaction?: string
  username?: string
  total?: number
  account?: string
  bankName?: string
  description?: string
  reason?: string
  state?: string
  bankTransaction?: string
  createdAt?: Date
}

export interface GetEwalletPaymentsInput {
  filter?: {
    bankTransaction?: string
    state?: EwalletPaymentBoState
    createdAt?: {
      from?: String
      to?: String
    }
    bankId?: number
    id?: number
  }
  paging?: {
    start?: number
    limit?: number
  }
}

export interface CreateEwalletPaymentBoInput {
  bankId: number
  amount: number 
  bankTransaction: string
  description: string
  phone: string
}

export interface CreateDepositBankInput {
  swiftCode?: string
  image?: string
  fullName: string
  number: string
  city?: string
  branch: string
}
export interface UpdateEwalletDepositBankBoInput {
  id: number
  isActive?: boolean
  fullName?: string
  branch?: string
  image?: string
  }

export interface  UpdateEwalletDepositPaymentInput {
    reason?: string
    transaction?: string
    phone?: string
}