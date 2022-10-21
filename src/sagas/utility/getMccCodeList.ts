import { callGraphql } from 'api/graphql';
import { PayloadFilterMccCodeType, SagaAction } from 'models';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadFilterMccCodeType> {
  type?: typeof types.GET_MCC_CODE_LIST_FULL_INFO.REQUEST;
}

const SQL_QUERY = `query getMccCodeList($input: GetListMerchantCategoryCodeInput){
    MerchantCategoryCode{
      QueryMerchantCategory(input: $input){
        data{
          id
          code
          content
          contentEN
          maxAmountTransaction
          approvedAccountId
          createdAt
          updatedAt
        }
        totalRow
        succeeded
        message
      }
    }
  }
  `;

const SQL_QUERY_PARTIAL = `query getMccCodeList($input: GetListMerchantCategoryCodeInput){
    MerchantCategoryCode{
      QueryMerchantCategory(input: $input){
        data{
          code
          content
        }
        totalRow
        succeeded
        message
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, payload ? { input: payload } : {});
    const mccCode = data?.data?.MerchantCategoryCode?.QueryMerchantCategory;
    if (mccCode?.succeeded) {
      yield delay(500);
      yield put({
        type: types.GET_MCC_CODE_LIST_FULL_INFO.SUCCESS,
        payload: mccCode?.data,
      });

      callback && callback(true, mccCode ?? {});
    } else {
      yield put({
        type: types.GET_MCC_CODE_LIST_FULL_INFO.FAILURE,
      });

      callback && callback(false, mccCode);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    yield put({
      type: types.GET_MCC_CODE_LIST_FULL_INFO.FAILURE,
    });
  }
}

function* doActionGetPartial({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(
      callGraphql,
      SQL_QUERY_PARTIAL,
      payload ? { input: payload } : {}
    );
    const mccCode = data?.data?.MerchantCategoryCode?.QueryMerchantCategory;
    if (mccCode?.succeeded) {
      yield put({
        type: types.GET_MCC_CODE_LIST_FULL_INFO.SUCCESS,
        payload: mccCode?.data,
      });
      callback && callback(true, mccCode ?? {});
    } else {
      yield put({
        type: types.GET_MCC_CODE_LIST_FULL_INFO.FAILURE,
      });

      callback && callback(false, mccCode);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    yield put({
      type: types.GET_MCC_CODE_LIST_FULL_INFO.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MCC_CODE_LIST_FULL_INFO.REQUEST, doAction);
  yield takeLatest(types.GET_MCC_CODE_LIST_PARTIAL.REQUEST, doActionGetPartial);
}
