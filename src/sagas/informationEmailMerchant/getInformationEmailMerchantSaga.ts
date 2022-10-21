import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_EMAIL_INFORMATION_MERCHANT.REQUEST;
}

const SQL_QUERY = `
query ewalletInforEmailMerchant($input:EwalletAnnounceMerchantInput) {
    EwalletAnnounceMerchant{
      EwalletAnnounceMerchant(input:$input){
        data{
          email
          merchantName
          merchantId
          title
          content
          
          updatedAt
          createdAt
           id
        }
      }
    }
  }
`;

function* doingSaga({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload },
        });
        const dataInfoEmailMerchant = data?.data?.EwalletAnnounceMerchant?.EwalletAnnounceMerchant;
        if (dataInfoEmailMerchant?.succeeded) {
            yield put({
                type: types.GET_EMAIL_INFORMATION_MERCHANT.SUCCESS,
                payload: dataInfoEmailMerchant?.data,
            });
            callback && callback(true, dataInfoEmailMerchant?.data);
        } else {
            yield put({
                type: types.GET_EMAIL_INFORMATION_MERCHANT.FAILURE,
            });
    
            callback && callback(false, dataInfoEmailMerchant?.data);
        }
        } catch (error) {
            yield put({
                type: types.GET_EMAIL_INFORMATION_MERCHANT.FAILURE,
            });
        }
}

export default function* watchAction() {
  yield takeLatest(types.GET_EMAIL_INFORMATION_MERCHANT.REQUEST, doingSaga);
}
