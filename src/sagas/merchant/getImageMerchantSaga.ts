import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.UPDATE_IMAGE_MERCHANT.REQUEST;
}

const SQL_QUERY = `query SearchMC($input: SearchMcInput) {
    Merchant {
      SearchMc(input: $input) {
        message
        succeeded
        data {
          businessDetails{
            identifyImages
            licenseImages
            merchantContract{
              contractId
              contractCode
              fileName
              url
            }
            otherImages
            representativeContracts
            executiveMemberList
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
        type: types.UPDATE_IMAGE_MERCHANT.SUCCESS,
        payload: merchant?.data[0].businessDetails,
      });
      callback && callback(true, merchant);
    } else {
      yield put({
        type: types.UPDATE_IMAGE_MERCHANT.FAILURE,
      });

      callback && callback(false, data?.errors[0]);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.UPDATE_IMAGE_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_IMAGE_MERCHANT.REQUEST, searchMC);
}
