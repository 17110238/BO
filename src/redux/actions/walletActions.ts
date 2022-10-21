import {
  AddBankEwalletInput,
  BankUpdateType,
  CallbackResponse,
  EditBankEwalletInput,
  GetBankListPayload,
  GetIssuerPayload,
  GetSettingWalletAdvancePayload,
  GetSupplierPayload,
  IssuerAddType,
  IssuerUpdateType,
  SettingWalletAdvanceType,
  SupplierAddType,
  WalletAppVersionType,
} from 'models';
import * as types from 'redux/types';

export const getWalletVersion = (callback?: CallbackResponse) => {
  return {
    type: types.GET_WALLET_VERSION.REQUEST,
    callback,
  };
};

export const updateWalletVersion = (payload: WalletAppVersionType, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_WALLET_VERSION.REQUEST,
    callback,
    payload,
  };
};

export const getBankListAction = (payload: GetBankListPayload, callback?: CallbackResponse) => {
  return {
    type: types.GET_BANK_LIST.REQUEST,
    callback,
    payload,
  };
};

export const updateBankAction = (payload: BankUpdateType, callback?: CallbackResponse) => {
  return {
    type: types.UPDATE_BANK.REQUEST,
    callback,
    payload,
  };
};

export const getWalletIssuersAction = (payload: GetIssuerPayload, callback?: CallbackResponse) => {
  return {
    type: types.GET_ISSUER_LIST.REQUEST,
    callback,
    payload,
  };
};

export const createWalletIssuerAction = (payload: IssuerAddType, callback?: CallbackResponse) => {
  return {
    type: types.ADD_ISSUER.REQUEST,
    callback,
    payload,
  };
};

export const updateWalletIssuerAction = (
  payload: IssuerUpdateType,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_ISSUER.REQUEST,
    callback,
    payload,
  };
};

export const getWalletSuppliersAction = (
  payload: GetSupplierPayload,
  callback?: CallbackResponse
) => {
  return {
    type: types.GET_SUPPLIER_LIST.REQUEST,
    callback,
    payload,
  };
};

interface SupplierAddTypeExtend extends Omit<SupplierAddType, 'issuer'> {
  issuer: (number | undefined)[];
}

export const createSupplierAction = (
  payload: SupplierAddTypeExtend,
  callback?: CallbackResponse
) => {
  return {
    type: types.ADD_SUPPLIER.REQUEST,
    callback,
    payload,
  };
};

export const updateSupplierAction = (
  payload: SupplierAddTypeExtend,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_SUPPLIER.REQUEST,
    callback,
    payload,
  };
};

export const getWalletSettingAdvanced = (
  payload: GetSettingWalletAdvancePayload,
  callback: CallbackResponse
) => {
  return {
    type: types.GET_SETTING_ADVANCE_SYSTEM.REQUEST,
    payload,
    callback,
  };
};

export const updateWalletSettingAdvance = (
  payload: SettingWalletAdvanceType,
  callback: CallbackResponse
) => {
  return {
    type: types.UPDATE_SETTING_ADVANCE_SYSTEM.REQUEST,
    payload,
    callback,
  };
};

// co.op bank
export const getCoopBankListAction = (callback?: CallbackResponse) => {
  return {
    type: types.GET_COOPBANK_LIST.REQUEST,
    callback,
  };
};

export const createCoopBankAction = (payload: AddBankEwalletInput, callback?: CallbackResponse) => {
  return {
    type: types.ADD_COOPBANK.REQUEST,
    callback,
    payload,
  };
};

export const updateCoopBankAction = (
  payload: EditBankEwalletInput,
  callback?: CallbackResponse
) => {
  return {
    type: types.UPDATE_COOPBANK.REQUEST,
    callback,
    payload,
  };
};
