import { ServiceEWalletTransactionBOEnum } from "models";
import { CreatedAtInput } from "models/utitlity/utilityState"

export interface GetEwalletServiceBillReportInput {
  createdAt?: CreatedAtInput
  gateway?: string
}

export interface ServiceBillType {
  type?: string;
  count?: number;
  total?: number;
}

export interface TotalServiceBillType {
  count?: number;
  total?: number;
}

export interface GetEwalletServiceBillReportResponed {
  data?: ServiceBillType[]
  total?: TotalServiceBillType
}

export interface EwalletGateReportReponsed {
  data?: [EwalletGateReportType ]
  total?: EwalletGateReportTotalType
}

export interface EwalletGateReportType {
  type? : string,
  data? : EwalletGateReportDataType[]
  total? : EwalletGateReportTotalType
}

export interface EwalletGateReportDataType {
  supplier?: string
  total?: number
  discount?: number
  cashback?: number
  count?: number
  amount? : number
}

export interface EwalletGateReportTotalType {
  total?: number
  discount?: number
  cashback?: number
  count?: number
  amount?: number
}

export interface GetEwalletGateReportInput {
  createdAt?: CreatedAtInput
}

export interface GetBankReportInput {
  createdAt?: DateInput
  supplierName?: string
}

export interface DateInput {
  start?: Date
  end?: Date
}
export interface GetBankReportReponsed {
  totalDeposit?: number
  countDeposit?: number
  totalWithdraw?: number
  countWithdraw?: number
}

export interface GetEwalletHistoryReportInput {
  createdAt?: CreatedAtInput
  serviceCode?: ServiceEWalletTransactionBOEnum
}

export interface GetEwalletHistoryReportType {
  total?: number
  count?: number
  amount?: number
  fee?: number
}

export enum TypeSearchBill {
  PHONE = 'PHONE',
  TRANSACTION = 'TRANSACTION'
}

export enum TypeSearchHistoryReport {
  PHONE = 'phone',
  TRANSACTION = 'transactionId'
}
export interface GetEwalletSsccReportInput {
  createdAt?: CreatedAtInput
}

export interface EwalletSsccReportReponsed {
  data?: GetEwalletSsccReportType[]
}

export interface GetEwalletSsccReportType {
  count?: number
  amount?: number
  fee?: number
  total?: number
}