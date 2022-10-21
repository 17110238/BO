import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { LinkedBanksType } from 'models/linkedBanks';

interface SagaSearch extends SagaAction<LinkedBanksType> {
  type?: typeof types.UNLINK_BANK.REQUEST;
}

const SQL_QUERY = `
mutation UnlinkBank($input: UnlinkBankCardInput){
    EwalletAccount{
        UnlinkBankCard(input: $input) {
        message
        succeeded
      }
    }
  }
`;

function* unlinkBankSaga({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const unlinkBank = data?.data.EwalletAccount?.UnlinkBankCard;
    if (unlinkBank.succeeded) {
      callback && callback(true, unlinkBank);
    } else {
      callback && callback(false, unlinkBank);
    }
  } catch (error) {
    yield put({
      type: types.UNLINK_BANK.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UNLINK_BANK.REQUEST, unlinkBankSaga);
}
