import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.SEARCH_MERCHANT.REQUEST;
}

const SQL_QUERY = `mutation sendContractMail($input: SendContractMailInput!) {
    Merchant{
      SendContractMail(input: $input) {
          succeeded,
          message
      }
    }
  }
  `;

function* sendContractMC({ payload, callback }: SagaSearch) {
  try {
    yield put({
      type: types.SEND_CONTRACT_MERCHANT.LOADING,
    });
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const merchant = data?.data?.Merchant?.SendContractMail;
    if (merchant?.succeeded) {
      yield put({
        type: types.SEND_CONTRACT_MERCHANT.SUCCESS,
        payload: merchant?.data,
      });
      callback && callback(true, merchant ?? {});
    } else {
      yield put({
        type: types.SEND_CONTRACT_MERCHANT.FAILURE,
      });

      callback && callback(false, data?.errors[0]);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.SEND_CONTRACT_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEND_CONTRACT_MERCHANT.REQUEST, sendContractMC);
}
