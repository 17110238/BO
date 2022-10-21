import * as types from 'redux/types/gapi';
import _ from 'lodash';

export function getHistoryTransaction(data, callback) {
  return {
    type: types.GET_TRANSACTION_HISTORY,
    payload: data,
    callback,
  };
}

// lấy danh sách payment page
export function getListPaymentPageAction(data, callback) {
  return {
    type: types.GET_LIST_PAYMENT_PAGE,
    payload: data,
    callback,
  };
}

export function getDetailPaymentPageAction(pageId, callback) {
  return {
    type: types.GET_DETAIL_PAYMENT_PAGE,
    payload: { pageId },
    callback,
  };
}

export function createPaymentPageAction(data, callback) {
  return {
    type: types.CREATE_PAYMENT_PAGE,
    payload: data,
    callback,
  };
}

export function editPaymentPageAction(data, pageId, callback) {
  return {
    type: types.EDIT_PAYMENT_PAGE,
    payload: data,
    pageId,
    callback,
  };
}

export function updateFieldPayMEPageAction(data, callback) {
  return {
    type: types.UPDATE_FIELD_PAYMENT_PAGE,
    payload: data,
    callback,
  };
}

export function sendNotiPayMePageCustomerAction(data, pageId, callback) {
  return {
    type: types.SENT_NOTI_PAYME_PAGE_CUSTOMER,
    payload: data,
    pageId,
    callback,
  };
}

//PayME link
export function createPayMELinkAction(data, callback) {
  return {
    type: types.CREATE_PAY_ME_LINK,
    payload: data,
    callback,
  };
}
export function createPayMELinkBulkAction(data, callback) {
  return {
    type: types.CREATE_PAY_ME_LINK_BULK,
    payload: data,
    callback,
  };
}
export function updatePayMELinkAction(data, callback) {
  return {
    type: types.UPDATE_PAY_ME_LINK,
    payload: data,
    callback,
  };
}
export function getListPayMELinkAction(data, callback) {
  return {
    type: types.GET_LIST_PAY_ME_LINK,
    payload: data,
    callback,
  };
}
export function getDetailPayMELinkAction(data, callback) {
  return {
    type: types.GET_DETAIL_PAY_ME_LINK,
    payload: data,
    callback,
  };
}
export function sendEmailPayMELinkAction(data, callback) {
  return {
    type: types.SEND_EMAIL_PAY_ME_LINK,
    payload: data,
    callback,
  };
}
export function getAccountInfoAction(data, callback) {
  return {
    type: types.GET_INFO_ACCOUNT,
    payload: data,
    callback,
  };
}

// Button
export function getListPaymentButtonAction(data, callback) {
  return {
    type: types.GET_LIST_PAYMENT_BUTTON,
    payload: data,
    callback,
  };
}
export function createPaymentButtonAction(data, callback) {
  return {
    type: types.CREATE_PAYMENT_BUTTON,
    payload: data,
    callback,
  };
}
export function getDetailPaymentButtonAction(data, callback) {
  return {
    type: types.GET_DETAIL_PAYMENT_BUTTON,
    payload: data,
    callback,
  };
}
export function updateStockPaymentButtonAction(data, callback) {
  return {
    type: types.UPDATE_STOCK_PAYMENT_BUTTON,
    payload: data,
    callback,
  };
}
export function updatePaymentButtonAction(data, callback) {
  return {
    type: types.UPDATE_PAYMENT_BUTTON,
    payload: data,
    callback,
  };
}

export function saveFieldCustom(data, callback) {
  return {
    type: types.SAVE_FIELD_CUSTOM,
    payload: data,
    callback,
  };
}
export function editFieldCustom(data, callback) {
  return {
    type: types.EDIT_FIELD_CUSTOM,
    payload: data,
    callback,
  };
}
export function updatePresetField(data, callback) {
  return {
    type: types.UPDATE_PRESET_FIELD,
    payload: data,
    callback,
  };
}
export function updatePresetFieldAmount(data, callback) {
  return {
    type: types.UPDATE_PRESET_FIELD_AMOUNT,
    payload: data,
    callback,
  };
}

export function updateAmountField(data, callback) {
  return {
    type: types.UPDATE_PRESET_FIELD_AMOUNT,
    payload: data,
    callback,
  };
}
export function updateAmountFieldBuyNow(data, callback) {
  return {
    type: types.UPDATE_FIELD_AMOUNT_BUY_NOW,
    payload: data,
    callback,
  };
}
//Transaction
/**
 * 
 * @param {*} data filter{stateList...}, paging 
 * @param {*} callback 
 * @returns 
 */
export function getListTransactionAction(data, callback) {
  if(data?.filter?.state === 'ALL' || !data?.filter?.statusList){
    data.filter.statusList = ['SUCCEEDED','REFUNDED','CANCELED','FAILED','EXPIRED']
    // data.filter.statusList = data.filter.state;
  }else if(data?.filter?.state && !data?.filter?.statusList){
    data.filter.statusList = data?.filter?.state;
  }

  return {
    type: types.GET_LIST_TRANSACTION,
    payload: data,
    callback,
  };
}
export function getListOrderAction(data, callback) {
  return {
    type: types.GET_LIST_ORDER,
    payload: data,
    callback,
  };
}

export function getListRefundAction(data, callback) {
  return {
    type: types.GET_LIST_REFUND,
    payload: data,
    callback,
  };
}
export function paymentRefundAction(data, callback) {
  return {
    type: types.PAYMENT_REFUND,
    payload: data,
    callback,
  };
}

//SETTING
export function settingProfileGet(clientId, filter = {}, callback) {
  return {
    type: types.SETING_PROFILE_GET,
    payload: { clientId, filter },
    callback,
  };
}

export function settingProfileUpdate(
  clientId,
  themeColor,
  logo,
  storeName,
  storeUrl,
  storeIntro,
  paymentMethodIds,
  storeLanguage,
  callback
) {
  return {
    type: types.SETTING_PROFILE_UPDATE,
    payload: _.pickBy({
      clientId,
      themeColor,
      logo,
      storeName,
      storeUrl,
      storeIntro,
      paymentMethodIds,
      storeLanguage,
    }),
    callback,
  };
}

export function settingProfileUpdateRemoveLogoAction(clientId, logo, callback) {
  return {
    type: types.SETTING_PROFILE_UPDATE,
    payload: { clientId, logo },
    callback,
  };
}

//settlement
export function getListSettlementAction(data, callback) {
  return {
    type: types.GET_LIST_SETTLEMENT,
    payload: data,
    callback,
  };
}

export function getCrossCheckAction(data, callback) {
  return {
    type: types.GET_CROSS_CHECK,
    payload: data,
    callback,
  };
}

export function getMerchantFeeAction(data, callback) {
  return {
    type: types.GET_MERCHANT_FEE,
    payload: data,
    callback,
  };
}

//satistics
export function getSatisticsAction(data, callback) {
  return {
    type: types.GET_SATISTICS,
    payload: data,
    callback,
  };
}

//customer
export function getListCustomerAction(data, callback) {
  return {
    type: types.GET_LIST_CUSTOMER,
    payload: data,
    callback,
  };
}

export function createCustomerAction(data, callback) {
  return {
    type: types.CREATE_CUSTOMER,
    payload: data,
    callback,
  };
}

export function updateCustomerAction(data, callback) {
  return {
    type: types.UPDATE_CUSTOMER,
    payload: data,
    callback,
  };
}

export function deleteCustomerAction(data, callback) {
  return {
    type: types.DELETE_CUSTOMER,
    payload: data,
    callback,
  };
}

//suport-ticket
export function getListTicketAction(data, callback) {
  return {
    type: types.GET_LIST_TICKET,
    payload: data,
    callback,
  };
}

export function createTicketAction(data, callback) {
  return {
    type: types.CREATE_TICKET,
    payload: data,
    callback,
  };
}

export function replyTicketAction(data, callback) {
  return {
    type: types.REPLY_TICKET,
    payload: data,
    callback,
  };
}

export function getListReplyTicketAction(data, callback) {
  return {
    type: types.GET_LIST_REPLY_TICKET,
    payload: data,
    callback,
  };
}

//list method
export function getListPaymentMethodAction(data, callback) {
  return {
    type: types.LIST_PAYMENT_METHOD,
    payload: data,
    callback,
  };
}
//Dashboard
export function getStatisticDashboardAction(data, callback) {
  return {
    type: types.GET_STATISTIC_DASHBOARD,
    payload: data,
    callback,
  };
}

//HDDT
export function getElectronicContractAction(data, callback) {
  return {
    type: types.GET_ELECTRONIC_CONTRACT,
    payload: data,
    callback,
  };
}

export function sentSmsContractAction(data, callback) {
  return {
    type: types.SENT_SMS_CONTRACT,
    payload: data,
    callback,
  };
}

export function signUpContractAction(data, callback) {
  return {
    type: types.SIGNUP_CONTRACT,
    payload: data,
    callback,
  };
}

export function getListPayoutAction(data, callback) {
  return {
    type: types.GET_LIST_PAYOUT,
    payload: data,
    callback,
  };
}

export function createPayoutSingleAction(data, callback) {
  return {
    type: types.CREATE_PAYOUT_SINGLE,
    payload: data,
    callback,
  };
}

export function cancelPayoutAction(data, callback) {
  return {
    type: types.CANCEL_PAYOUT_SINGLE,
    payload: data,
    callback,
  };
}

export function requestSecurityPasswordAction(data, callback) {
  return {
    type: types.REQUEST_SECURITY_PASSWORD,
    payload: data,
    callback,
  };
}

export function confirmSecurityPayoutAction(data, callback) {
  return {
    type: types.CONFIRM_PAYOUT_SECURITY,
    payload: data,
    callback,
  };
}

export function getListPayoutBulkAction(data, callback) {
  return {
    type: types.GET_LIST_PAYOUT_BULK,
    payload: data,
    callback,
  };
}

export function createPayoutBulkAction(data, callback) {
  return {
    type: types.CREATE_PAYOUT_BULK,
    payload: data,
    callback,
  };
}

export function getSecurityCodePayoutBulkAction(data, callback) {
  return {
    type: types.GET_SECURITY_CODE_PAYOUT_BULK,
    payload: data,
    callback,
  };
}

export function confirmPayoutBulkAction(data, callback) {
  return {
    type: types.CONFIRM_PAYOUT_BULK,
    payload: data,
    callback,
  };
}
export function cancelPayoutBulkAction(data, callback) {
  return {
    type: types.CANCEL_PAYOUT_BULK,
    payload: data,
    callback,
  };
}
export function readFileExcelPayoutBulkAction(data, callback) {
  return {
    type: types.READ_FILE_EXCEL_PAYOUT_BULK,
    payload: data,
    callback,
  };
}
