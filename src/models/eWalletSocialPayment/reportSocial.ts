import {
  StateEWalletSocialPaymentEnum,
  TypeReportEWalletSocialPaymentEnum,
  TypeSearchEWalletSocialPaymentEnum,
} from './socialPay';

export interface ReportEWalletSocialPayment {
  paymentMethod?: string;
  numberPaymentMethod?: number;
  totalTransaction?: number;
  totalReal?: number;
  totalFee?: number;
}

export interface PayloadSearchEwalletReportSocialPayment {
  filter?: FilterEwalletReportSocialPayment;
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  };
}
export interface FilterEwalletReportSocialPayment {
  txtSearch?: string;
  typeSearch?: TypeSearchEWalletSocialPaymentEnum;
  state?: StateEWalletSocialPaymentEnum;
  type?: TypeReportEWalletSocialPaymentEnum;
  createdAt?: {
    from?: string;
    to?: string;
  };
}
