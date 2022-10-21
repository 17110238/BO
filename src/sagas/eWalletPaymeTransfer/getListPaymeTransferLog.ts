import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { EwalletPaymeTransferLogInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<EwalletPaymeTransferLogInput> {
  type?: typeof types.GET_LIST_PAYME_TRANSFER_LOG.REQUEST;
}

const SQL_QUERY = `query getListPaymeTransferLog($input: FilterCampainLogInput) {
  EwalletPaymeTransfer {
    EwalletPaymeTransferLog(input: $input) {
      message
      succeeded
      totalAccountValid
      totalAmount
      data {
        state
        description
        amount
        sender
        receiver
        phone
        createdAt
        updatedAt
        id
        transferType
        campaign
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
    const transferLog = data?.data?.EwalletPaymeTransfer?.EwalletPaymeTransferLog;
    if (transferLog) {
      yield put({
        type: types.GET_LIST_PAYME_TRANSFER_LOG.SUCCESS,
        payload: transferLog?.data,
      });
      callback && callback(true, transferLog ?? {});
    } else {
      yield put({
        type: types.GET_LIST_PAYME_TRANSFER_LOG.FAILURE,
      });

      callback && callback(false, transferLog);
    }
  } catch (error) {
    yield put({
      type: types.GET_LIST_PAYME_TRANSFER_LOG.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_PAYME_TRANSFER_LOG.REQUEST, doAction);
}
