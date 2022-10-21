import { MERCHANT_EXPORT } from './../types/merchantExportTypes';
import { BusinessDetailsType } from './../../models/account/merchantState';
import { ActionReducer, MerchantState } from 'models';
import * as types from 'redux/types';
const initialState: MerchantState = {
  loading: false,
  loadingModal: false,
  merchantInfoArray: [],
  approvalMerchantArray: [],
  merchantProfile: {},
  merchantFee: {},
  methodChecked: [],
  pendingListMerchant: [],
  totalPendingMerchant: 0,
  logsType: [],
  logsFee: [],
};

export default function merchant(state = initialState, action: ActionReducer) {
  switch (action.type) {
    case types.SEARCH_MERCHANT.SUCCESS:
      return {
        ...state,
        merchantInfoArray: action.payload,
      };

    case types.SEARCH_MERCHANT.FAILURE:
      return {
        ...state,
        merchantInfoArray: [],
      };

    case types.GET_PROFILE_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        merchantProfile: {
          ...state.merchantProfile,
          ...action.payload,
          paymentMethodExtend: action?.payload?.paymentMethodExtend?.map(
            (method: { extraData: string }) => {
              return {
                ...method,
                extraData: JSON.parse(method.extraData),
              };
            }
          ),
        },
      };

    case types.GET_PROFILE_MERCHANT.RESET:
      return {
        ...state,
        merchantProfile: {},
      };

    case types.SEARCH_APPROVAL_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        approvalMerchantArray: action.payload,
      };

    case types.SEARCH_APPROVAL_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
        approvalMerchantArray: [],
      };

    case types.GET_MERCHANT_FEE_CONFIG.REQUEST:
      return {
        ...state,
        loading: false,
        merchantFee: {},
      };
    case types.GET_MERCHANT_FEE_CONFIG.SUCCESS:
      return {
        ...state,
        loading: false,
        merchantFee: action.payload,
      };

    case types.UPDATE_METHOD_CHECKED:
      return {
        ...state,
        methodChecked: [...action.payload],
      };

    case types.UPDATE_IMAGE_MERCHANT.SUCCESS:
      return {
        ...state,
        merchantProfile: {
          ...state.merchantProfile,
          businessDetails: {
            ...action.payload,
          },
        },
      };

    case types.GET_LIST_DELEGATE_MC.SUCCESS:
      return {
        ...state,
        merchantProfile: {
          ...state.merchantProfile,
          delegate: [...action.payload],
        },
      };

    case types.GET_PENDING_LIST_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PENDING_LIST_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        pendingListMerchant: action.payload,
      };
    case types.GET_PENDING_LIST_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.GET_TOTAL_PENDING_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
        totalPendingMerchant: action.payload,
      };

    case types.SEND_CONTRACT_MERCHANT.LOADING:
      return {
        ...state,
        loadingModal: true,
      };
    case types.SEND_CONTRACT_MERCHANT.SUCCESS:
      return {
        ...state,
        loadingModal: false,
      };
    case types.SEND_CONTRACT_MERCHANT.FAILURE:
      return {
        ...state,
        loadingModal: false,
      };
    case types.MERCHANT_EXPORT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.MERCHANT_EXPORT.PENDING:
      return {
        ...state,
        loading: true,
      };
    case types.MERCHANT_EXPORT_SOXKET.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.MERCHANT_EXPORT_SOXKET.PENDING:
      return {
        ...state,
        loading: true,
      };

    case types.MERCHANT_EXPORT_SOXKET.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.MERCHANT_EXPORT_SOXKET.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.MERCHANT_EXPORT.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.MERCHANT_EXPORT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.APPROVE_PENDING_MERCHANT.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.APPROVE_PENDING_MERCHANT.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.APPROVE_PENDING_MERCHANT.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
