import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql ,callGraphQlFormData } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.TRANSFER_WALLET_PAYME.REQUEST;
}

const SQL_QUERY = `mutation addPaymeTransfer(
  $transferType: String,
  $file: Upload,
  $accountSender: String,
  $accountReceive: [String],
  $amount: Float,
  $description: String
) {
  EwalletPaymeTransfer {
    EwalletPaymeLogTransfer(
      transferType: $transferType,
      file: $file, 
      accountSender: $accountSender,
      accountReceive: $accountReceive,
      amount: $amount,
      description: $description
    ) {
      message
      succeeded
      campaignId
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    if (payload.file) {
      const { data } = yield call<any>(callGraphQlFormData, SQL_QUERY, payload, payload.file);
      const res = data.data.EwalletPaymeTransfer.EwalletPaymeLogTransfer;
      if (res.succeeded) {
        callback && callback(true, res);
      } else {
        callback && callback(false, res);
      }
    } else {
      const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        ...payload,
      });
      const res = data.data.EwalletPaymeTransfer.EwalletPaymeLogTransfer;
      if (res.succeeded) {
        callback && callback(true, res);
      } else {
        callback && callback(false, res);
      }
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.TRANSFER_WALLET_PAYME.REQUEST, doAction);
}
