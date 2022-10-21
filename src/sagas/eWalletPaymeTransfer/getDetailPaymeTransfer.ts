import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { EwalletPaymeTransferLogInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<EwalletPaymeTransferLogInput> {
  type?: typeof types.GET_DETAIL_PAYME_TRANSFER.REQUEST;
}

const SQL_QUERY = `query getDetailPaymeTransfer($input: FilterCampainLogInput) {
  EwalletPaymeTransfer {
    EwalletPaymeTransferCampaign(input: $input) {
      message
      succeeded
      totalAmount
      totalValidAmount
      data {
        state
        amountTrans
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
        fullname
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
    const detailTransfer = data?.data?.EwalletPaymeTransfer?.EwalletPaymeTransferCampaign;
    if (detailTransfer) {
      yield put({
        type: types.GET_DETAIL_PAYME_TRANSFER.SUCCESS,
        payload: detailTransfer?.data,
      });
      callback && callback(true, detailTransfer ?? {});
    } else {
      yield put({
        type: types.GET_DETAIL_PAYME_TRANSFER.FAILURE,
      });

      callback && callback(false, detailTransfer);
    }
  } catch (error) {
    yield put({
      type: types.GET_DETAIL_PAYME_TRANSFER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DETAIL_PAYME_TRANSFER.REQUEST, doAction);
}
