import { finishedAtMerchantReportInput } from "models/accountantCrossCheck/accountantCrossCheck";

export interface RevenueStatisticDataType {
  merchantId: number;
  appName: string;
  amount: number;
  totalPayment: number;
  fee: number;
  count: number;
  crossCheckAmount: number;
  crossCheckCount: number;
}

export interface RevenueStatisticSumType {
  amount: number;
  totalPayment: number;
  fee: number;
  count: number;
  crossCheckAmount: number;
  crossCheckCount: number;
}

export interface SearchRevenuePayload {
  filter?: {
    merchantId?: number;
    method?: string;
    createdAt?: {
      from?: string;
      to?: string;
    };
  };
  paging?: {
    start: number;
    limit: number;
  };
}
// export interface finishedAtMerchantReportInput {
//   from?: string
//   to?: string
// }

export interface FilterSendMerchantReportCrossCheck {
  merchantId?: number
  email?: string[]
  finishedAt?: finishedAtMerchantReportInput
}

export interface FilterSendMerchantReportCrossCheckInput {
  filter?: FilterSendMerchantReportCrossCheck
}

export interface BoPauseResponse {
  message?: string
  succeeded?: boolean
}
