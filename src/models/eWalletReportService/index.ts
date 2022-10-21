export interface CreatedAtFilterReportCustomerInput {
  from?: Date
  to?: Date
}

export interface FilterReportCustomerInput {
  createdAt?: CreatedAtFilterReportCustomerInput
}

export interface ReportCustomerInput {
  filter?: FilterReportCustomerInput
}

export interface DataReportCustomer {
  date?: string
  totalNewWallet?: number
  walletKyc?: number
  rejectedWallet?: number
  sumWalletKyc?: number
  allWalletActive?: number
  allUserWalletActive?: number
  allBusinessWalletActive?: number
  totalBalanceUser?: number
  totalBalanceBusiness?: number
  totalTransactions?: number
}

export interface SumDataReportCustomerResponsed {
  sumAllNewWallet?: number
  sumAllWalletKyc?: number
  sumAllTransaction?: number
}

export interface ReportCustomerResponsed {
  data?: [DataReportCustomer]
  sumData?: SumDataReportCustomerResponsed
}

