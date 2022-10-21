import { ActionReducer } from 'models';
import { MerchantInfoState } from 'models/merchantInfo/merchantInfoState';
import * as types from 'redux/types/merchantInfoTypes';
import * as walletTypes from 'redux/types/walletHistoryTypes';

const initialState: MerchantInfoState = {
  accountId: '',
  loading: false,
  loadingLinkedBank: false,
  loadingSession: false,
  loadingWalletHistory: false,
  loadingTransactionHistory: false,
  loadingChangeHistory: false,
  loadingTransactionReport: false,
  loadingRequestCancelWallet: false,
  loadingUpdate: false,
  loadingResetPassword: false,
  loadingUnlockKyc: false,
  merchantAccountInfo: [],
  merchantSessions: [],
  merchantWalletHistory: [],
  merchantTransactionHistory: [],
  merchantLinkedBanks: [],
  merchantChangeHistory: [],
  merchantTransactionReport: '',
  merchantWalletTotalCredit: 0,
  merchantWalletTotalDebit: 0,
};

export default function merchantInfo(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.SEARCH_MERCHANT_INFO.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.SEARCH_MERCHANT_INFO.SUCCESS:
      return {
        ...state,
        loading: false,
        merchantAccountInfo: action.payload,
        accountId: action.payload?.[0]?.id?.toString() || '',
      };

    case types.SEARCH_MERCHANT_INFO.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.GET_MERCHANT_SESSIONS.REQUEST:
      return {
        ...state,
        loadingSession: true,
      };

    case types.GET_MERCHANT_SESSIONS.SUCCESS:
      return {
        ...state,
        loadingSession: false,
        merchantSessions: state.accountId ? action.payload : [],
      };

    case types.GET_MERCHANT_SESSIONS.FAILURE:
      return {
        ...state,
        loadingSession: false,
      };

    case types.GET_MERCHANT_LINKED_BANKS.REQUEST:
      return {
        ...state,
        loadingLinkedBank: true,
      };

    case types.GET_MERCHANT_LINKED_BANKS.SUCCESS:
      return {
        ...state,
        loadingLinkedBank: false,
        merchantLinkedBanks: action.payload,
      };

    case types.GET_MERCHANT_LINKED_BANKS.FAILURE:
      return {
        ...state,
        loadingLinkedBank: false,
      };

    case types.GET_MERCHANT_TRANSACTION_HISTORY.REQUEST:
      return {
        ...state,
        loadingTransactionHistory: true,
      };

    case types.GET_MERCHANT_TRANSACTION_HISTORY.SUCCESS:
      return {
        ...state,
        loadingTransactionHistory: false,
        merchantTransactionHistory: action.payload,
      };

    case types.GET_MERCHANT_TRANSACTION_HISTORY.FAILURE:
      return {
        ...state,
        loadingTransactionHistory: false,
      };

    case types.REQUEST_CANCEL_MERCHANT_WALLET.REQUEST:
      return {
        ...state,
        loadingRequestCancelWallet: true,
      };

    case types.REQUEST_CANCEL_MERCHANT_WALLET.SUCCESS:
      return {
        ...state,
        loadingRequestCancelWallet: false,
      };

    case types.REQUEST_CANCEL_MERCHANT_WALLET.FAILURE:
      return {
        ...state,
        loadingRequestCancelWallet: false,
      };

    case types.GET_MERCHANT_TRANSACTION_REPORT.REQUEST:
      return {
        ...state,
        loadingTransactionReport: true,
      };

    case types.GET_MERCHANT_TRANSACTION_REPORT.SUCCESS:
      return {
        ...state,
        loadingTransactionReport: false,
        merchantTransactionReport: action.payload,
      };

    case types.GET_MERCHANT_TRANSACTION_REPORT.FAILURE:
      return {
        ...state,
        loadingTransactionReport: false,
      };

    case types.GET_MERCHANT_CHANGE_HISTORY.REQUEST:
      return {
        ...state,
        loadingChangeHistory: true,
      };

    case types.GET_MERCHANT_CHANGE_HISTORY.SUCCESS:
      return {
        ...state,
        loadingChangeHistory: false,
        merchantChangeHistory: action.payload,
      };

    case types.GET_MERCHANT_CHANGE_HISTORY.FAILURE:
      return {
        ...state,
        loadingChangeHistory: false,
      };

    case walletTypes.GET_WALLET_HISTORY.REQUEST:
      return {
        ...state,
        loadingWalletHistory: true,
      };

    case walletTypes.GET_WALLET_HISTORY.SUCCESS:
      return {
        ...state,
        loadingWalletHistory: false,
        merchantWalletHistory: state.accountId ? action.payload.data : [],
        merchantWalletTotalCredit: state.accountId ? action.payload.totalCredit : 0,
        merchantWalletTotalDebit: state.accountId ? action.payload.totalDebit : 0,
      };

    case walletTypes.GET_WALLET_HISTORY.FAILURE:
      return {
        ...state,
        loadingWalletHistory: false,
      };

    case types.UPDATE_ACCOUNT_INFO_EWALLET.REQUEST:
      return {
        ...state,
        loadingUpdate: true,
      };

    case types.UPDATE_ACCOUNT_INFO_EWALLET.SUCCESS:
      return {
        ...state,
        loadingUpdate: false,
      };

    case types.UPDATE_ACCOUNT_INFO_EWALLET.FAILURE:
      return {
        ...state,
        loadingUpdate: false,
      };

    case types.RESET_MERCHANT_PASSWORD.REQUEST:
      return {
        ...state,
        loadingResetPassword: true,
      };

    case types.RESET_MERCHANT_PASSWORD.SUCCESS:
      return {
        ...state,
        loadingResetPassword: false,
      };

    case types.RESET_MERCHANT_PASSWORD.FAILURE:
      return {
        ...state,
        loadingResetPassword: false,
      };

    case types.UNLOCK_MERCHANT_KYC.REQUEST:
      return {
        ...state,
        loadingUnlockKyc: true,
      };

    case types.UNLOCK_MERCHANT_KYC.SUCCESS:
      return {
        ...state,
        loadingUnlockKyc: false,
      };

    case types.UNLOCK_MERCHANT_KYC.FAILURE:
      return {
        ...state,
        loadingUnlockKyc: false,
      };

    case types.RESET_SEARCH_MERCHANT.SUCCESS:
      return initialState;

    default:
      return state;
  }
}
