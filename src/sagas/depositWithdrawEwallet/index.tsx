import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaUpdate extends SagaAction<any> {
  type?: typeof types.DEPOSIT_WITHDRAW_EWALLET.REQUEST;
}

const SQL_QUERY = `
mutation requestDepositWithdrawEwallet($input: DepositWithdrawEwalletInput!) {
    MerchantEwallet {
      DepositWithdrawEwallet(input: $input) {
        message
        succeeded
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaUpdate) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const dataAddMoney = data?.data?.MerchantEwallet?.DepositWithdrawEwallet;
    if (dataAddMoney?.succeeded) {
      callback && callback(true, dataAddMoney);
    } else {
      callback && callback(false, dataAddMoney);
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.DEPOSIT_WITHDRAW_EWALLET.REQUEST, doAction);
}
