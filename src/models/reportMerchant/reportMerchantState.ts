export interface ReportMerchantReducerType {
  revenueReport: RevenueReport[];
  sumReport: SumRevenueReport;
}
export interface PayloadSearchMerchantRevenue {
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

export interface PayloadDetailMerchantRevenue {
  to?: any;
  from?: any;
  id?: any;
  merchantId?: number;
  method?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface RevenueReport {
  merchantId?: number;
  title?: string;
  total?: number;
  amount?: number;
  totalTopup?: number;
  totalPayment?: number;
  fee?: number;
  count?: number;
  crossCheckAmount?: number;
  crossCheckFee?: number;
  crossCheckTotal?: number;
  crossCheckCount?: number;
  email?: string;
}

export interface SumRevenueReport {
  totalMerchant?: number;
  total?: number;
  amount?: number;
  totalTopup?: number;
  totalPayment?: number;
  fee?: number;
  count?: number;
  succeededCount?: number;
  succeededAmount?: number;
  succeededTotal?: number;
  succeededFee?: number;
  refundedCount?: number;
  refundedAmount?: number;
  refundedTotal?: number;
  refundedFee?: number;
  crossCheckAmount?: number;
  crossCheckFee?: number;
  crossCheckTotal?: number;
  crossCheckCount?: number;
}

export interface DetailRevenue {
  method?: string;
  total?: number;
  amount?: number;
  fee?: number;
  count?: number;
  succeededCount?: number;
  succeededAmount?: number;
  succeededTotal?: number;
  succeededFee?: number;
  refundedCount?: number;
  refundedAmount?: number;
  refundedTotal?: number;
  refundedFee?: number;
  crossCheckAmount?: number;
  crossCheckFee?: number;
  crossCheckTotal?: number;
  crossCheckCount?: number;
  canceledCount?: number;
  canceledAmount?: number;
  canceledTotal?: number;
  canceledFee?: number;
}
