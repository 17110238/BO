import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_MERCHANT_STORE.REQUEST;
}

const SQL_QUERY = `query SearchMC($input: SearchMcInput) {
      Merchant {
        SearchMc(input: $input) {
          message
          succeeded
          data {
            paymentMethod {
              referId
            }
          }
          totalRow
        }
      }
    }
  `;

function* searchMC({ payload, callback }: SagaSearch) {
  try {
    const { data, code } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const merchant = data?.data?.Merchant?.SearchMc;
    if (merchant?.succeeded) {
      callback && callback(true, merchant ?? {});
    } else {
      callback && callback(false, data);
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_STORE.REQUEST, searchMC);
}
