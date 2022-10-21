import { FilterSearchIsecManage } from 'models';

export interface EWalletIsecReport {
  date?: string;
  fullDate?: string;
  totalNew?: number;
  countNew?: number;
  totalUsed?: number;
  countUsed?: number;
  totalLock?: number;
  countLock?: number;
  totalISec?: number;
  countISec?: number;
  countCashback?: number;
  totalCashback?: number;
  feeISec?: number;
}

export interface EWalletISecReportAccount {
  accountId?: number;
  amount?: number;
  amountCreated?: number;
  amountReceived?: number;
  amountUsed?: number;
  amountTransfer?: number;
  amountResidual?: number;
  feeUsed?: number;
  feeTransfer?: number;
  quantityCreated?: number;
  quantityTransfer?: number;
  quantityReceived?: number;
  quantityUsed?: number;
  phone?: string;
}

export interface PayloadSearchEWalletIsecReportAccount {
  filter?: FilterSearchEWalletIsecReportAccount;
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface FilterSearchEWalletIsecReportAccount
  extends Omit<FilterSearchIsecManage, 'typeSearch'> {
  typeSearch?: SearchReportIsecByAccountEnum;
}

export enum SearchReportIsecByAccountEnum {
  BUSSINESS = 'BUSSINESS',
  PERSONAL = 'PERSONAL',
}
