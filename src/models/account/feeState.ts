export interface FeeMerchantConfig {
  ecommerceFeeList?: MerchantFeeItem[];
  coboFeeList?: MerchantFeeItem[];
  poboFeeList?: MerchantFeeItem[];
  noteInfo?: MerchantNoteInfo;
}

export interface MerchantFeeItem {
  paymentMethodId?: number;
  paymentMethodName?: string;
  gatewayFee?: MerchantFeeValue;
  fixedGatewayFee?: MerchantFeeValue;
  transactionFee?: MerchantFeeValue;
  fixedTransactionFee?: MerchantFeeValue;
  logInfo?: LogInfoFeeType;
}

export interface LogInfoFeeType {
  description?: string;
  images?: string[];
}
export interface MerchantFeeValue {
  isDefault?: boolean;
  value?: number;
}

export interface DefaultFeeMerchantConfig {
  ecommerceFeeList?: MerchantDefaultFeeItem[];
  coboFeeList?: MerchantDefaultFeeItem[];
  poboFeeList?: MerchantDefaultFeeItem[];
}

export interface MerchantDefaultFeeItem {
  id?: number;
  payCode?: string;
  paymentMethodId?: number;
  paymentMethodName?: string;
  gatewayFee?: number;
  fixedGatewayFee?: number;
  transactionFee?: number;
  fixedTransactionFee?: number;
}

export interface MerchantNoteInfo {
  description: string;
  images: string[];
}
