import { callGraphql } from 'api/graphql';
import { MerchantAccount, SagaAction } from 'models';
import { element } from 'prop-types';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<MerchantAccount> {
  type?: typeof types.REQUEST_UPDATE_FEE.REQUEST;
}

const SQL_QUERY = `
  mutation requestUpdateFee($input:UpdateFeeMcInput!){
    Merchant{
      RequestUpdateFeeMc (input: $input) {
        message
        succeeded
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const requested = data?.data?.Merchant?.RequestUpdateFeeMc;
    if (requested?.succeeded) {
      callback && callback(true, requested);
    } else {
      callback && callback(false, requested);
    }
  } catch (error) {
    console.log('error saga: ', error);
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_UPDATE_FEE.REQUEST, doAction);
}
