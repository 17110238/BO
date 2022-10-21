import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { SagaAction, SearchSupplierTransactionInput } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<SearchSupplierTransactionInput> {
  type?: typeof types.GET_LIST_E_WALLET_TRANSACTION_SUPPLIER.REQUEST;
}

const handleQuery = (service: string) => {
  let queryString;

  switch (service) {
    case 'BILL_OCB':
      queryString = `
      ... on OCBBillObject {
        id
        accountId
        transaction
        total
        fee
        state
        typeTransaction
        description
        bankTransaction
        supplierCode
        supplierName
        customerId
        customerName
        customerAddress
        createdAt
        accountInfo {
          phone
        }
      }`
      break;

    case 'BILL_SSCC':
      queryString = `
      ... on SSCCBillObject {
        id
        transaction
        total
        fee
        feeLater
        state
        customerName
        customerClass
        customerSchool
        customerAddress
        createdAt
        accountInfo {
          phone
        }
      }`
      break;

    case 'BILL_ESTIO':
      queryString = `
      ... on EstioBillObject {
        id
        transaction
        total
        fee
        state
        typeTransaction
        description
        bankTransaction
        supplierCode
        supplierName
        customerId
        customerName
        customerClass
        customerSchool
        customerAddress
        createdAt
        accountInfo {
          phone
        }
      }`
      break;

    case 'GATE_CARD':
      queryString = `
      ... on GateCardObject {
        id
        transaction
        serial
        total
        fee
        discount
        cashback
        state
        description
        supplier
        createdAt
        accountInfo {
          phone
        }
      }`
      break;

    case 'GATE_TOPUP':
      queryString = `
      ... on GateTopUpObject {
        id
        transaction
        total
        fee
        discount
        cashback
        state
        description
        supplier
        createdAt
        accountInfo {
          phone
        }
      }`
      break;

    case 'NAPAS':
      queryString = `
      ... on NapasTransactionObject {
        transaction
        supplierTransaction
        transTime
        bankAccount
        total
        amount
        fee
        transType
        state
        content
        description
        supplier
        supplierResponse
        bankInfo {
          shortName
          swiftCode
          engName
          viName
        }
        accountInfo {
          phone
        }
      }`
      break;

    case 'PVCOMBANK':
      queryString = `
      ... on PVCombankTransactionObject {
        transaction
        supplierTransaction
        transTime
        bankAccount
        total
        amount
        fee
        transType
        state
        description
        content
        supplier
        supplierResponse
        accountInfo {
          phone
        }
      }`
      break;

    case 'OCBBANK':
      queryString = `
      ... on OCBBankTransactionObject {
        transaction
        supplierTransaction
        transTime
        bankAccount
        requestId
        total
        amount
        fee
        transType
        state
        description
        supplier
        createdAt
        supplierResponse
        bankInfo {
          shortName
          swiftCode
          engName
          viName
        }
      }`
      break;

    case 'BIDVBANK':
      queryString = `
      ... on BIDVTransactionObject {
        transaction
        supplierTransaction
        transTime
        bankAccount
        requestId
        total
        amount
        fee
        transType
        state
        description
        supplier
        createdAt
        supplierResponse
        bankInfo {
          shortName
          swiftCode
          engName
          viName
        }
      }`
      break;
  }

  return `
  query getListTransactionSupplier($input: SearchSupplierTransactionInput!) {
    EwalletSupplierTransaction {
      SearchSupplierTransaction (input: $input) { 
        ${queryString}
      }
    }
  }
  `;
}

function* doAction({ payload, callback }: SagaSearch) {
  const service = payload?.filter?.service;
  try {
    const { data } = yield call<any>(callGraphql, handleQuery(service!), {
      input: { ...payload }
    });
    const res = data?.data?.EwalletSupplierTransaction?.SearchSupplierTransaction;
    if (res) {
      yield put({
        type: types.GET_LIST_E_WALLET_TRANSACTION_SUPPLIER.SUCCESS,
        payload: res,
      });
      callback && callback(true, res ?? []);
    } else {
      yield put({
        type: types.GET_LIST_E_WALLET_TRANSACTION_SUPPLIER.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    yield put({
      type: types.GET_LIST_E_WALLET_TRANSACTION_SUPPLIER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_E_WALLET_TRANSACTION_SUPPLIER.REQUEST, doAction)
}
