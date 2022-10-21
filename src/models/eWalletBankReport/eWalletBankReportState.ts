export interface EWalletBankReport {
  coopBank?: CoopBankType;
  transaction?: TransactionRepotType[];
  topCount?: topCountAmountType[];
  topAmount?: topCountAmountType[];
  totalMerchant?: number;
  userInfo?: UserInfoBankReportType;
}

export interface CoopBankType {
  total?: number;
  data?: CoopBankDataType[];
}

export interface CoopBankDataType {
  id?: number;
  name?: string;
  activeDate?: string;
}

export interface TransactionRepotType {
  month?: string;
  successAmount?: number;
  successCount?: number;
  failAmount?: number;
  failCount?: number;
  paymentCount: number;
  paymentAmount: number;
  depositCount: number;
  depositAmount: number;
  withdrawCount: number;
  withdrawAmount: number;
  transCountHight: number;
  transAmountHight: number;
}

export interface topCountAmountType {
  merchantId?: number;
  name?: string;
  identifyCode?: string;
  industryCode?: string;
  count?: number;
  value?: number;
}

export interface UserInfoBankReportType {
  totalUserPersonalReg?: number;
  totalUserPersonalKyc?: number;
  balanceUserPersonal?: number;
  totalUserBusinessReg?: number;
  totalUserBusinessKyc?: number;
  balanceUserBusiness?: number;
}

export interface PayloadBankReportForm {
  beginTime: string;
  endTime: string;
}
