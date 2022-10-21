
export interface createdFilter {
  from?: string
  to?: string
}
export interface ReportMerchantEwalletInput {
  merchantId?: number
  createdAt?: createdFilter
}

export interface ReportMerchantEwalletTotal {
  amountEwalletBefore?: number
  crossCheck?: number
  topUp?: number
  withdraw?: number
  pobo?: number
  feePobo?: number
  wallet?: number
}

export interface ReportMerchantEwalletData {
  merchantId?: number
  merchantName?: string
  amountEwalletBefore?: number
  crossCheck?: number
  topUp?: number
  withdraw?: number
  pobo?: number
  feePobo?: number
  wallet?: number
}

export interface ReportMerchantEwalletResponsed {
  data?: ReportMerchantEwalletData[]
  total?: ReportMerchantEwalletTotal
}
