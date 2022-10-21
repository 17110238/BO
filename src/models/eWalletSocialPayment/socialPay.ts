export interface EWalletSocialPay {
  transactionId?: string;
  tokenLink?: string;
  type?: string;
  fromUserId?: number;
  toUserId?: number;
  state?: string;
  createdAt?: string;
  amount?: number;
  description?: string;
  paymentMethod?: string;
  publisher?: string;
}

export enum TypeReportEWalletSocialPaymentEnum {
  SEND_MONEY = 'SEND_MONEY',
  REQUEST_MONEY = 'REQUEST_MONEY',
  DONATE_MONEY = 'DONATE_MONEY',
}

export enum StateEWalletSocialPaymentEnum {
  USED = 'USED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  RECEIVED = 'RECEIVED',
  SUCCEEDED = 'SUCCEEDED',
  PENDING = 'PENDING',
}

export enum TypeSearchEWalletSocialPaymentEnum {
  TOKEN_LINK = 'TOKEN_LINK',
  SHORT_LINK = 'SHORT_LINK',
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER',
}
