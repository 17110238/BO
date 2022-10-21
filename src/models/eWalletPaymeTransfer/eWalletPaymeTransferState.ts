
export interface EwalletPaymeTransferState {
  loading: boolean;
  eWalletTransferHistory: EwalletPaymeTransferHistoryResponseData[];
  countSuccess: {
    _id?: string;
    count?: number;
    total?: number;
  }
}
export interface EwalletPaymeTransferHistoryResponseData {
  companyId: number;
  totalUser: number;
  totalUserTrans: number;
  totalAmount: number;
  totalAmountTrans: number;
  approvedAt: string;
  createdAt: string;
  state: string;
  description: string;
  campaign: string;
  sender: string;
}

export interface EwalletPaymeTransferHistoryResponseData {
  message: boolean;
  succeeded: boolean;
  data: EwalletPaymeTransferHistoryResponseData[];
  countSuccess: {
    _id?: string;
    count?: number;
    total?: number;
  }
}

export interface EwalletPaymeTransferHistoryInput {
  filter?: {
    txtSearch?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  }
}

export interface EwalletPaymeTransferLogInput {
  filter?: {
    campaignId?: string | string[];
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  }
}

export interface EwalletPaymeTransferInput {
  transferType?: string;
  description?: string;
  accountSender?: string;
  accountReceive?: string[];
  amount?: number;
}

export interface EwalletPaymeTransferLogResponse {
  state: string;
  description: string;
  amount: number;
  sender: string;
  receiver: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  transferType: string;
  campaign: string;
}

export interface EwalletPaymeTransferCampaignInput {
  campaignId?: string | string[];
}

export interface EwalletPaymeLogTransferDataApi extends EwalletPaymeTransferLogResponse {
  amountTrans: number;
  fullname: string;
}