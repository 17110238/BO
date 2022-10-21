export interface GetWithdrawInput {
  filter?: {
    method?: string,
    typeId?: string,
    transactionId?: string
    partnerTransaction?: string
    supplierTransaction?: string
    bankTransaction?: string
    merchantId?: string
    state?: string
    createdAt?: {
      from?: Date | string
      to?: Date | string
    }
    search?: string | undefined;
  }
  paging?: {
    start?: number
    limit?: number
  }
  sort?: {
    createdAt?: number
  }
}

export interface WithdrawList {
  accountId?: number
  amount?: number
  approvedAt?: string
  bankTransaction?: string
  canceledAt?: string
  content?: string
  contentWithdraw?: string
  createdAt?: string
  destination?: DestinationInfoResponse
  failedUrl?: string
  fee?: number
  id?: number
  ipnUrl?: string
  isPick?: boolean
  merchantId?: string
  partnerTransaction?: string
  reason?: string
  redirectUrl?: string
  state?: string
  submittedAccountId?: string
  supplier?: string
  supplierResponse?: [SupplierResponseInfo]
  supplierTransaction?: string
  total?: number
  transactionId?: string
  updatedAt?: string
  verifyMethod?: string
  merchantName?: string
  bankName?: string
}

export interface DestinationInfoResponse {
  bankAccount: BankAccountInfoResponse
  wallet: WalletInfoResponse
}

export interface WalletInfoResponse {
  phone: string
  fullname: string
}

export interface BankAccountInfoResponse {
  accountName?: string
  accountNumber?: string
  branch?: string
  swiftCode?: string
}

export interface SupplierResponseInfo {
  _id?: string
  content?: string
  createdAt?: string
}

export interface ChangeWithdrawResponse {
  message: string
  succeeded: boolean
  data: [string]
  totalRow: number
}

export interface ChangeWithdrawInput {
  transactionId?: string
  state?: string
}
