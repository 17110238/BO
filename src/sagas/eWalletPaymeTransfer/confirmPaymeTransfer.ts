import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { EwalletPaymeTransferLogInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<EwalletPaymeTransferLogInput> {
  type?: typeof types.CONFIRM_TRANSFER_WALLET_PAYME.REQUEST;
}

const SQL_QUERY = `mutation confirmPaymeTransfer($input: EwalletPaymeTransferCampaignInput) {
  EwalletPaymeTransfer {
    EwalletPaymeTransferDoConfirmp2p(input: $input) {
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
    const res = data?.data?.EwalletPaymeTransfer?.EwalletPaymeTransferDoConfirmp2p;
    if (res) {
      yield put({
        type: types.CONFIRM_TRANSFER_WALLET_PAYME.SUCCESS,
        payload: res,
      });
      callback && callback(true, res ?? {});
    } else {
      yield put({
        type: types.CONFIRM_TRANSFER_WALLET_PAYME.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    yield put({
      type: types.CONFIRM_TRANSFER_WALLET_PAYME.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CONFIRM_TRANSFER_WALLET_PAYME.REQUEST, doAction);
}
