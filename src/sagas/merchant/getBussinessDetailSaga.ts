import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_BUSSINESS_DETAIL.REQUEST;
}

const SQL_QUERY = `query GetImageMerchant($input: SearchMcInput) {
    Merchant {
      SearchMc(input: $input) {
        message
        succeeded
        data {
          businessDetails{
            identifyImages
            licenseImages
            representativeContracts
            executiveMemberList
            otherImages
            merchantContract{
              contractId
              contractCode
              fileName
              url
            }
            chiefAccountantAppointment
            benefitOwnerDocument
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
        payload: merchant?.data[0]?.businessDetails,
      });
      callback && callback(true, merchant?.data[0]);
    } else {
      callback && callback(false, {});
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_BUSSINESS_DETAIL.REQUEST, searchMC);
}
