export interface PagingEmailSmsProductInput {
  start?: number;
  limit?: number;
}

export interface SortEmailSmsProductInput {
  createdAt?: number;
}

export interface filterSmsProductInput {
  id: number;
}

export interface GetEmailSmsProductInput {
  filter?: filterSmsProductInput;
  paging?: PagingEmailSmsProductInput;
  sort?: SortEmailSmsProductInput;
}

export interface FiterMerchantMerchant {
  merchantId?: number;
}

export interface GetEmailSmsMerchantInput {
  filter?: FiterMerchantMerchant;
  paging?: PagingEmailSmsProductInput;
  sort?: SortEmailSmsProductInput;
}

export interface GetHistoryMerchantInput {
  filter?: FiterHistoryMerchant;
  paging?: PagingEmailSmsProductInput;
  sort?: SortEmailSmsProductInput;
}

export interface packageResponse {
  mail?: number;
  sms?: number;
}

export interface EmailSmsProductReponse {
  id?: number;
  package?: packageResponse;
  isVisible?: boolean;
  title?: string;
  description?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MerChantResponse {
  merChantId?: number;
  merChantName?: string;
  mail?: number;
  sms?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HistorySMSMerchantReposone {
  merChantName?: string;
  merchantId?: number;
  quantityEmail?: number;
  quantitySMS?: number;
  quantityEmailBefore?: number;
  quantityEmailAfter?: number;
  quantitySMSBefore?: number;
  quantitySMSAfter?: number;
  state?: string;
  change?: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface packageInt {
  mail?: number;
  sms?: number;
}

export interface CreateEmailSmsProductInput {
  package?: packageInt;
  isVisible?: boolean;
  title?: string;
  description?: string;
  amount?: number;
}

export interface UpdateEmailSmsProductInput {
  id?: number;
  package?: packageInt;
  isVisible?: boolean;
  title?: string;
  description?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchParamsEmailSms {
  merchantId?: number | null;
}

export interface FiterHistoryMerchant {
  merchantId?: number;
  change?: string;
  transactionId?: string;
  createAt?: string;
  createdAt?: string;
}
