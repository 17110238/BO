export interface GetPoboOrderInput {
  filter?: {
    method?: string;
    typeId?: string;
    transactionId?: string;
    partnerTransaction?: string;
    supplierTransaction?: string;
    bulkTransactionId?: string;
    type?: string;
    bankTransaction?: string;
    destination?: string;
    supplier?: string;
    merchantId?: string;
    state?: string;
    createdAt?: {
      from?: Date | string;
      to?: Date | string;
    };
    search?: string | undefined;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  };
}

export interface PoboOrderList {
  accountId?: number;
  actionInfo?: ActionInfoResponse;
  amount?: number;
  appId?: string;
  approvedAt?: string;
  bankTransaction?: string;
  bulkTransactionId?: string;
  canceledAt?: string;
  content?: string;
  createdAt?: string;
  createdBy?: string;
  createInfo?: CreateInfoResponse;
  customer?: CustomerInfoResponse;
  destination?: DestinationInfoResponse;
  extraData?: string;
  failedUrl?: string;
  fee?: number;
  id?: number;
  ipnUrl?: string;
  isPick?: boolean;
  merchantId?: number;
  partnerBulkTransaction?: string;
  partnerTransaction?: string;
  reason?: string;
  redirectUrl?: string;
  scheduleTransactionId?: string;
  source?: SourceInfoResponse;
  state?: string;
  submittedAccountId?: string;
  supplier?: string;
  supplierResponse?: [SupplierResponseInfo];
  supplierTransaction?: string;
  total?: number;
  transactionId?: string;
  type?: string;
  updatedAt?: string;
  verifyMethod?: string;
  bankName?: string;
  merchantName?: string;
}

export interface ActionInfoResponse {
  accountId?: number;
  fullname?: string;
  username?: string;
}

export interface CreateInfoResponse {
  accountId?: number;
  fullname?: string;
  username?: string;
}
export interface CustomerInfoResponse {
  customerId?: string;
  group?: string;
  name?: string;
}

export interface DestinationInfoResponse {
  bankAccount?: BankAccountInfoResponse;
  wallet?: WalletInfoResponse;
}

export interface BankAccountInfoResponse {
  accountName?: string;
  accountNumber?: string;
  branch?: string;
  swiftCode?: string;
}

export interface WalletInfoResponse {
  phone?: string;
  fullname?: string;
}

export interface SourceInfoResponse {
  customize?: CustomizeInfoResponse;
}

export interface CustomizeInfoResponse {
  amount?: number;
}

export interface SupplierResponseInfo {
  _id?: string;
  content?: string;
  createdAt?: string;
}

export interface ChangePoboOrderStateResponse {
  message?: string;
  succeeded?: boolean;
  data?: [string];
  totalRow?: number;
}

export interface ChangePoboOrderStateInput {
  transactionId?: string;
  state?: string;
}

export interface ExportPoboOrderInput {
  filter?: FilterPoboOrderInput;
}

export interface CreatedAtPaymentInput {
  from?: string;
  to?: string;
}

export interface FilterPoboOrderInput {
  transactionId?: string;
  partnerTransaction?: string;
  supplierTransaction?: string;
  bankTransaction?: string;
  bulkTransactionId?: string;
  type?: string;
  merchantId?: string;
  destination?: string;
  state?: [string];
  supplier?: string;
  createdAt?: CreatedAtPaymentInput;
}

export interface UpdateMismatchTransactionResponsed {
  message?: string;
  succeeded?: boolean;
}

export interface FilterWithdrawInput {
  transactionId?: string;
  partnerTransaction?: string;
  supplierTransaction?: string;
  bankTransaction?: string;
  bulkTransactionId?: string;
  type?: string;
  merchantId?: string;
  destination?: string;
  state?: [string];
  supplier?: string;
  createdAt?: CreatedAtPaymentInput;
}

export interface ExportWithDrawInput {
  filter?: FilterWithdrawInput
}