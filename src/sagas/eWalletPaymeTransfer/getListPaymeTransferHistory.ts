import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { EwalletPaymeTransferHistoryInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<EwalletPaymeTransferHistoryInput> {
  type?: typeof types.GET_LIST_PAYME_TRANSFER_HISTORY.REQUEST;
}

const SQL_QUERY = `query getListPaymeTransferHistory($input: EwalletPaymeTransferHistoryInput) {
  EwalletPaymeTransfer {
    EwalletPaymeTransferHistory(input: $input) {
      message
      succeeded
      data {
        companyId
        totalUser
        totalUserTrans
        totalAmount
        totalAmountTrans
        approvedAt
        createdAt
        state
        description
        campaign
        sender
      }
      countSuccess {
        _id
        count
        total
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
    const transferHistory = data?.data?.EwalletPaymeTransfer?.EwalletPaymeTransferHistory;
    if (transferHistory) {
      yield put({
        type: types.GET_LIST_PAYME_TRANSFER_HISTORY.SUCCESS,
        payload: transferHistory,
      });
      callback && callback(true, transferHistory ?? {});
    } else {
      yield put({
        type: types.GET_LIST_PAYME_TRANSFER_HISTORY.FAILURE,
      });

      callback && callback(false, transferHistory);
    }
  } catch (error) {
    yield put({
      type: types.GET_LIST_PAYME_TRANSFER_HISTORY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_PAYME_TRANSFER_HISTORY.REQUEST, doAction);
}
