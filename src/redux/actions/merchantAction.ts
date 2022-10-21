import {
  AprrovedPendingRequestInput,
  BusinessDetailsType,
  CallbackResponse,
  CreateMerchantInput,
  DelegatesType,
  FilterSearchParams,
  GetRequestChangeInput,
  MerchantAccount,
  MerchantFeeItem,
  PayloadApproveMerchant,
  PayloadChangePasswordMerchant,
  PayloadRejectMerchant,
  PayloadUpdateActiveAccountMerchant,
  SendContractMerchant,
  RejectPendingRequestInput,
  GetChangedInfoInput,
  PayloadDisableSettlement,
  PayloadRequestActiveMerchant,
  FilterLogTransactionFeeInput,
  LogInfoFeeType,
} from 'models';
import { GetAccountMerchantLogInput } from 'models';
import * as types from 'redux/types';

export const searchMerchant = (payload: FilterSearchParams | any, callback: CallbackResponse) => {
  return {
    type: types.SEARCH_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const getInfoMerchant = (payload: FilterSearchParams, callback?: CallbackResponse) => {
  return {
    type: types.GET_PROFILE_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const searchApprovalMerchant = (payload: FilterSearchParams, callback: CallbackResponse) => {
  return {
    type: types.SEARCH_APPROVAL_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

interface PayloadUpdateMerchant extends MerchantAccount {
  id: number;
}

interface PayloadUpdateConfigFeeMerchant extends MerchantFeeItem {
  merchantId: number;
  type: TypeConfigFeeMcEnum;
}

export enum TypeConfigFeeMcEnum {
  ECOMMERCE = 'ecommerce',
  POBO = 'pobo',
}

export const updateInfoMerchant = (payload: PayloadUpdateMerchant, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_INFO_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantFeeConfig = (
  payload: { merchantId: number },
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_MERCHANT_FEE_CONFIG.REQUEST,
    payload,
    callback,
  };
};

export const updateMethodChecked = (payload?: number[] | string[]) => {
  return {
    type: types.UPDATE_METHOD_CHECKED,
    payload,
  };
};

export const getDefaultMerchantFeeConfig = (callback?: CallbackResponse) => {
  return {
    type: types.GET_DEFAULT_MERCHANT_FEE_CONFIG.REQUEST,
    callback,
  };
};

export const updateImageMerchant = (payload: FilterSearchParams) => {
  return {
    type: types.UPDATE_IMAGE_MERCHANT.REQUEST,
    payload,
  };
};

export const updateConfigFeeMerchant = (
  payload: PayloadUpdateConfigFeeMerchant,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_CONFIG_FEE_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const approvingMerchant = (payload: PayloadUpdateMerchant, callback?: CallbackResponse) => {
  return {
    type: types.APPROVING_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const rejectMerchant = (payload: PayloadRejectMerchant, callback?: CallbackResponse) => {
  return {
    type: types.REJECT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const changePasswordMerchant = (
  payload: PayloadChangePasswordMerchant,
  callback?: CallbackResponse
) => {
  return {
    type: types.CHANGE_PASSWORD_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const updateActiveMerchant = (
  payload: PayloadApproveMerchant,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_ACTIVE_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const updateActiveAccountMerchant = (
  payload: PayloadUpdateActiveAccountMerchant,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_ACTIVE_ACCOUNT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export interface PayloadAddDelegate {
  merchantId: number;
  delegate: DelegatesType;
}

export const addDelegateMerchant = (payload: PayloadAddDelegate, callback?: CallbackResponse) => {
  return {
    type: types.ADD_DELEGATE_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const getPendingList = (payload: GetRequestChangeInput, callback: CallbackResponse) => {
  return {
    type: types.GET_PENDING_LIST_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const getTotalPendingMerchant = (
  payload: GetRequestChangeInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_TOTAL_PENDING_MERCHANT.REQUEST,
    payload,
    callback,
  };
};
export const sendContractMerchant = (payload: SendContractMerchant, callback: CallbackResponse) => {
  return {
    type: types.SEND_CONTRACT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const createAccountMerchant = (payload: CreateMerchantInput, callback: CallbackResponse) => {
  return {
    type: types.CREATE_ACCOUNT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};
export const approvePendingMerchant = (
  payload: AprrovedPendingRequestInput,
  callback: CallbackResponse
) => {
  return {
    type: types.APPROVE_PENDING_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const rejectPendingMerchant = (
  payload: RejectPendingRequestInput,
  callback: CallbackResponse
) => {
  return {
    type: types.REJECT_PENDING_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const getBussinessDetail = (payload: FilterSearchParams, callback?: CallbackResponse) => {
  return {
    type: types.GET_BUSSINESS_DETAIL.REQUEST,
    payload,
    callback,
  };
};

export const getChangedInfo = (payload: GetChangedInfoInput, callback: CallbackResponse) => {
  return {
    type: types.GET_CHANGED_INFO.REQUEST,
    payload,
    callback,
  };
};

export const getChangedEwalletAccountInfo = (payload: GetChangedInfoInput, callback: CallbackResponse) => {
  return {
    type: types.GET_CHANGED_INFO_WALLET_ACCOUNT.REQUEST,
    payload,
    callback,
  };
};

export const requestUpdateInfo = (payload: PayloadUpdateMerchant | any, callback?: CallbackResponse) => {
  return {
    type: types.REQUEST_UPDATE_INFO.REQUEST,
    payload,
    callback,
  };
};

export const requestUpdateFee = (
  payload: { data: string; logInfo: LogInfoFeeType },
  callback?: CallbackResponse
) => {
  return {
    type: types.REQUEST_UPDATE_FEE.REQUEST,
    payload,
    callback,
  };
};
export const exportFileMerchant = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.MERCHANT_EXPORT.REQUEST,
    payload,
    callback,
  };
};

export const exportFileMerchantSocket = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.MERCHANT_EXPORT_SOXKET.REQUEST,
    payload,
    callback,
  };
};
export const exportFileMerchantSocketPending = () => {
  return {
    type: types.MERCHANT_EXPORT_SOXKET.PENDING,
  };
};
export const exportFileMerchantSocketSuccess = () => {
  return {
    type: types.MERCHANT_EXPORT_SOXKET.SUCCESS,
  };
};
export const exportFileMerchantSocketFailure = () => {
  return {
    type: types.MERCHANT_EXPORT_SOXKET.FAILURE,
  };
};

export const getMerchantLog = (
  payload: GetAccountMerchantLogInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_MERCHANT_LOG.REQUEST,
    payload,
    callback,
  };
};

export const getLogTransactionFee = (
  payload: FilterLogTransactionFeeInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_TRANSACTION_FEE_LOG.REQUEST,
    payload,
    callback,
  };
};

export const updateContractMerchant = (
  payload: { merchantId: number },
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_CONTRACT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const resendMailApproval = (
  payload: { merchantId: number },
  callback?: CallbackResponse
) => {
  return {
    type: types.RESEND_MAIL_APPROVAL.REQUEST,
    payload,
    callback,
  };
};

export const createManualCrosscheck = (
  payload: SendContractMerchant,
  callback?: CallbackResponse
) => {
  return {
    type: types.CREATE_MANUAL_CROSSCHECK_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const mailDisableSettlement = (
  payload: PayloadDisableSettlement,
  callback?: CallbackResponse
) => {
  return {
    type: types.DISABLE_MAIL_SETTLEMENT_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const requestUpdateActiveMerchant = (
  payload: PayloadRequestActiveMerchant,
  callback?: CallbackResponse
) => {
  return {
    type: types.REQUEST_UPDATE_ACTIVE_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

export const getMerchantActiveInfo = (
  payload: GetChangedInfoInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_MERCHANT_ACTIVE_INFO.REQUEST,
    payload,
    callback,
  };
};

export const getAccountActiveInfo = (payload: GetChangedInfoInput, callback?: CallbackResponse) => {
  return {
    type: types.GET_ACCOUNT_ACTIVE_INFO.REQUEST,
    payload,
    callback,
  };
};


export const searchExpertiseMerchant = (payload: FilterSearchParams | any, callback: CallbackResponse) => {
  return {
    type: types.SEARCH_EXPERTISE_MERCHANT.REQUEST,
    payload,
    callback,
  };
};

