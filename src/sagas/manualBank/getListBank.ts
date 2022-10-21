import { call, put, takeLatest } from 'redux-saga/effects';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as types from '../../redux/types/manualBankTypes';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_BANK.REQUEST;
}

const SQL_QUERY = `
  query getListBanks {
    EwalletPaymentBo {
      GetBanks{
        swiftCode
        bankName
      }
    }
  }
`;

function* getListBanks({ callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY);
    const listBanks = data.data.EwalletPaymentBo.GetBanks;
    if (Array.isArray(listBanks)) {
      yield put({
        type: types.GET_LIST_BANK.SUCCESS,
        payload: listBanks,
      });
      callback && callback(true, listBanks);
    } else {
      yield put({
        type: types.GET_LIST_BANK.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.GET_LIST_BANK.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_BANK.REQUEST, getListBanks);
}
