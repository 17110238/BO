import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.SEARCH_EXPERTISE_MERCHANT.REQUEST;
}

const SQL_QUERY = `query SearchExpertiseMC($input: SearchAppraisalMcInput) {
      Merchant {
        SearchAppraisalMc(input: $input) {
          data {
            merchantId
         
            contactInfo {
              name
              email
              phone
            }
            accountInfo{
              id
              fullname
              username
            }
            businessOverview{
              type
              abbreviationName
              brandName
              category
              homeUrl
            }
            isActive
            createdAt
            approvedAt
            updatedAt
            state
          }
  
        }
      }
    }
  `;

function* searchMC({ payload, callback }: SagaSearch) {
  try {
    const { data, code } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const merchant = data?.data?.Merchant?.SearchAppraisalMc;

    if (merchant) {
      yield put({
        type: types.SEARCH_EXPERTISE_MERCHANT.SUCCESS,
        payload: merchant?.data,
      });
      yield delay(500);
      callback && callback(true, merchant ?? {});
    } else {
      yield put({
        type: types.SEARCH_EXPERTISE_MERCHANT.FAILURE,
      });

      callback && callback(false, data);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.SEARCH_EXPERTISE_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEARCH_EXPERTISE_MERCHANT.REQUEST, searchMC);
}
