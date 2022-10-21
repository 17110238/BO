import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_ACCOUNT_SALE.REQUEST;
}

const SQL_QUERY = `
  query GetListSaleAccount($input: SearchByRoleInput!) {
    Account {
      SearchByRole(input: $input) {
        succeeded
        message
        totalRow
        data {
          accountId
          fullname
          username
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
    const saleAccounts = data?.data?.Account?.SearchByRole;

    if (saleAccounts?.succeeded) {
      yield put({
        type: types.GET_LIST_ACCOUNT_SALE.SUCCESS,
        payload: saleAccounts?.data,
      });
      callback && callback(true, saleAccounts?.data ?? []);
    } else {
      yield put({
        type: types.GET_LIST_ACCOUNT_SALE.FAILURE,
      });

      callback && callback(false, saleAccounts?.data ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_LIST_ACCOUNT_SALE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_ACCOUNT_SALE.REQUEST, doAction);
}
