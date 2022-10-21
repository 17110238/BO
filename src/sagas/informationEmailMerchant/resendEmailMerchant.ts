import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaSearch extends SagaAction<any> {
  type?: typeof types.RESEND_EMAIL_MERCHANT.REQUEST;
}

const SQL_QUERY = `
mutation ewalletResend($input:FilterEwalletMerchantResendEmailInput){
    EwalletAnnounce{
      EwalletResendEmail(input:$input){
        message
        succeeded
      }
    }
  }
`;

function* doingSaga({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload },
        });
        const dataResendEmail = data?.data?.EwalletAnnounce?.EwalletResendEmail;
        if (dataResendEmail?.succeeded) {
            yield put({
                type: types.RESEND_EMAIL_MERCHANT.SUCCESS,
         
            });
            callback && callback(true, dataResendEmail);
        } else {
            yield put({
                type: types.RESEND_EMAIL_MERCHANT.FAILURE,
            });
    
            callback && callback(false, dataResendEmail);
        }
        } catch (error) {
            yield put({
                type: types.RESEND_EMAIL_MERCHANT.FAILURE,
            });
        }
}

export default function* watchAction() {
  yield takeLatest(types.RESEND_EMAIL_MERCHANT.REQUEST, doingSaga);
}
