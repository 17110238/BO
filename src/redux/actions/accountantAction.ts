import * as types from "redux/types";
import { CallbackResponse, FilterMerchantReportCrossCheckInput } from "models";

export const deleteListAccountantCrossCheck = () => {
  return {
    type: types.GET_LIST_ACOUNTANT_CROSS_CHECK.DELETE,
  }
}
export const getListAccountantCrossCheck = (payload: any, callback: CallbackResponse) => {
    return {
      type: types.GET_LIST_ACOUNTANT_CROSS_CHECK.REQUEST,
      payload,
      callback
    }
}
export const approveCrossCheck = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.APPROVE_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const createAccountantCrossCheck = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.CREATE_ACOUNTANT_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const getAccountantCrossCheckItem = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_ACOUNTANT_CROSS_CHECK_iTEM.REQUEST,
    payload,
    callback
  }
}
export const exportAccountantCrossCheck = (payload: any) => {
  return {
    type: types.EXPORT_ACOUNTANT_CROSS_CHECK.REQUEST,
    payload,
  }
}

export const exportAccountantCrossCheckPending = () => {
  return {
    type: types.EXPORT_ACOUNTANT_CROSS_CHECK.PENDING,
  };
};
export const exportAccountantCrossCheckFailure = () => {
  return {
    type: types.EXPORT_ACOUNTANT_CROSS_CHECK.FAILURE,
  };
};
export const exportAccountantCrossCheckSuccess = () => {
  return {
    type: types.EXPORT_ACOUNTANT_CROSS_CHECK.SUCCESS,
  };
};


export const updateStateAccountantCrossCheck = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_STATE_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const updateStateDeposiFinaltProcess = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.UPDATE_STATE_FINAL_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const boRejectCrossCheck= (payload: any, callback: CallbackResponse) => {
  return {
    type: types.BO_REJECT_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const boCancelCrossCheck= (payload: any, callback: CallbackResponse) => {
  return {
    type: types.BO_CANCEL_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const boPauseCrossCheck= (payload: any, callback: CallbackResponse) => {
  return {
    type: types.BO_PAUSE_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const boTransferCrossCheck= (payload: any, callback: CallbackResponse) => {
  return {
    type: types.BO_TRANSFER_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}
export const boContinueCrossCheck= (payload: any, callback: CallbackResponse) => {
  return {
    type: types.BO_CONTINUE_PAUSE_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}

export const boCompleteCrossCheck= (payload: any, callback: CallbackResponse) => {
  return {
    type: types.BO_COMPLETE_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}

export const searchBalanceMerchantAction = (payload: any, callback: CallbackResponse) => {
  return {
    type: types.GET_LIST_BALANCE_MERCHANT.REQUEST,
    payload,
    callback,
  };
};
export const deleteBalanceMerchantAction = () => {
  return {
    type: types.GET_LIST_BALANCE_MERCHANT.DELETE,

  };
};

export const exportSearchBalanceMerchantActionRequest = (payload:any) => {
  return {
    type: types.EXPORT_SEARCH_ACCOUNTANT.REQUEST,
    payload,
  };
};

export const exportSearchBalanceMerchantActionPending = () => {
  return {
    type: types.EXPORT_SEARCH_ACCOUNTANT.PENDING,
  };
};
export const exportSearchBalanceMerchantActionFailure = () => {
  return {
    type: types.EXPORT_SEARCH_ACCOUNTANT.FAILURE,
  };
};
export const exportSearchBalanceMerchantActionSuccess = () => {
  return {
    type: types.EXPORT_SEARCH_ACCOUNTANT.SUCCESS,
  };
};

export const getMerchantReportCrossCheck = (payload: FilterMerchantReportCrossCheckInput, callback: CallbackResponse) => {
  return {
    type: types.GET_MERCHANT_REPORT_CROSS_CHECK.REQUEST,
    payload,
    callback
  }
}

