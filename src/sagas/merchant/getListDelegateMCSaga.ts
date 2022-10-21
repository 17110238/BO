import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_LIST_DELEGATE_MC.REQUEST;
}

const SQL_QUERY = `query SearchMC($input: SearchMcInput) {
    Merchant {
      SearchMc(input: $input) {
        message
        succeeded
        data {
          delegate{
            accountId
            fullname
            displayName
            phone
            email
            isActivePasswordTrading
            passwordTrading
            role
            tokenVerify
            username
            isActive
            state
          }
        }
        totalRow
      }
    }
    }
  `;

function* searchMC({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const merchant = data?.data?.Merchant?.SearchMc;
    if (merchant?.succeeded) {
      yield put({
        type: types.GET_LIST_DELEGATE_MC.SUCCESS,
        payload: merchant?.data[0]?.delegate,
      });
      callback && callback(true, merchant);
    } else {
      yield put({
        type: types.GET_LIST_DELEGATE_MC.FAILURE,
      });

      callback && callback(false, data?.errors[0]);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.GET_LIST_DELEGATE_MC.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_DELEGATE_MC.REQUEST, searchMC);
}
