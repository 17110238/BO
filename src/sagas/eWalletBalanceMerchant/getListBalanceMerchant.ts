import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';
import { SearchConnectedUserInput, SagaAction } from 'models';

interface SagaSearch extends SagaAction<SearchConnectedUserInput> {
  type?: typeof types.GET_LIST_BALANCE_MERCHANT.REQUEST;
}

const SQL_QUERY = `
query getListBalanceMerchant($input: SearchBalanceMerchantInput) {
    MerchantEwallet{
      SearchBalanceMerchant(input: $input) {
        data{
          createdAt
          transactionId
          merchantId
          merchantName
          transactionType
          balanceBefore
          amount
          change
          balanceAfter
          description
          referTransaction
        }
      }
    }
  }

`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const list = data?.data?.MerchantEwallet.SearchBalanceMerchant;
   
    if (Array.isArray(list.data)) {
      yield put({
        type: types.GET_LIST_BALANCE_MERCHANT.SUCCESS,
        payload: list?.data,
      });
      callback && callback(true, list ?? []);
    } else {
      yield put({
        type: types.GET_LIST_BALANCE_MERCHANT.FAILURE,
      });

      callback && callback(false, list);
    }
  } catch (error) {
    yield put({
      type: types.GET_LIST_BALANCE_MERCHANT.FAILURE,
    });
    callback && callback(false, []);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_BALANCE_MERCHANT.REQUEST, doAction);
}
