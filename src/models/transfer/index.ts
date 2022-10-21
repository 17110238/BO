import { data } from 'jquery';
import { PagingInput } from 'models/utitlity/utilityState';

export interface SearchMismatchTransactionInput {
  filter?: FilterMismatchTransactionInput;
  paging?: PagingInput;
}

export interface FilterMismatchTransactionInput {
  merchantId?: number;
  createdAt?: {
    from?: string;
    to?: string;
  };
  supplierTransaction?: string;
  paymentId?: string;
  amount?: number;
  description?: string;
  supplierState?: string;
  paymentState?: string;
}

export interface UpdateMismatchTransactionInput {
  paymentId?: string;
  paymentIdUpdate?: string;
  supplierTransaction?: string;
  type?: string;
  cancel?: boolean;
}

export enum MismatchTransactionEnum {
  NOT_MATCH_ORDER = 'NOT_MATCH_ORDER',
  NOT_MATCH_AMOUNT = 'NOT_MATCH_AMOUNT',
  CANCEL_ORDER = 'CANCEL_ORDER',
  TOPUP = 'TOPUP'
}

export interface UpdateMismatchTransactionResponse {
  message: string;
  succeeded: boolean;
}

export interface SearchMismatchTransactionResponse {
  message: string;
  succeeded: boolean;
  data: MismatchTransaction[];
}

export interface MismatchTransaction {
  paymentId: string;
  supplierTransaction: string;
  amount: number;
  description: string;
  cardNumber: string;
  supplierState: string;
  paymentState: string;
  actions: string[];
  merchantName: string;
  brandName: string;
  merchantId: number;
  sourceType: string;
  sender: string;
  isMatch: boolean;
  createdAt: Date;
}

export interface TransferState {
  loading: boolean;
  loadingUpdateTransaction: boolean;
  loadingExport: boolean;
  message: string;
  mismatchTransactions: MismatchTransaction[];
}
