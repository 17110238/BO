import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: string;
}

const SQL_QUERY = `query SearchMCApproval($input: SearchMcInput) {

  Merchant {
    SearchMc (input:$input){
      message
      succeeded
      totalRow
      data{
        merchantId
        accountInfo{
          id
          phone
          email
          fullname
          accountType
        }
        businessOverview{
          abbreviationName
          brandName
          maxRange
          type,
        }
        businessDetails{
          identifyImages
        }
        contactInfo{
          name
          email
          phone
        }
        createdAt
        updatedAt
        isActive
        state
        operator{
          accountId
          username
        }
     

      }
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
        type: types.SEARCH_APPROVAL_MERCHANT.SUCCESS,
        payload: merchant?.data,
      });
      yield delay(500);
      callback && callback(true, merchant ?? {});
    } else {
      yield put({
        type: types.SEARCH_APPROVAL_MERCHANT.FAILURE,
      });

      callback && callback(false, data?.errors[0]);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.SEARCH_APPROVAL_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEARCH_APPROVAL_MERCHANT.REQUEST, searchMC);
}
