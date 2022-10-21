import { callGraphql } from 'api/graphql';
import { MccCodeListType, MerchantDefaultFeeItem, SagaAction } from 'models';
import { call, takeEvery } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MccCodeListType> {
  type?: string;
}

const SQL_QUERY = `
    mutation updateMccCodeItem($input: MerchantCategoryCodeInput!){
      MerchantCategoryCode{
        updateMerchantCategory(input: $input){
          message
          succeeded
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: payload });
    const updated = data?.data?.MerchantCategoryCode?.updateMerchantCategory;

    if (updated?.succeeded) {
      callback && callback(true, updated ?? {});
    } else {
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeEvery(types.UPDATE_MCC_CODE_ITEM.REQUEST, doAction);
}
