import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_INFO_LIST_BANK.REQUEST;
}

const SQL_QUERY = `
    query getListBank {
        Utility {
            GetBanks {
                message
                succeeded
                data {
                shortName
                swiftCode
                engName
                viName
                }
            }
        }
    }
`;

function* doAction({ callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {});
    const res = data?.data?.Utility?.GetBanks;
    if (res?.succeeded) {
      yield put({
        type: types.GET_INFO_LIST_BANK.SUCCESS,
        payload: res?.data,
      });
      callback && callback(true, res);
    } else {
      yield put({
        type: types.GET_INFO_LIST_BANK.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    console.log('error get list info: ', error);
    yield put({
      type: types.GET_INFO_LIST_BANK.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_INFO_LIST_BANK.REQUEST, doAction);
}
