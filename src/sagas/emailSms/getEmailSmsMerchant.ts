import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/emailSmsTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.EMAIL_SMS_MERCHANT.REQUEST;
}

const SQL_QUERY = `
query EmailSmsMerchant($input : GetEmailSmsMerchantInput){
  EmailSMS{
    GetEmailSmsMerchant(input : $input)
    {
      message
      succeeded
      data {
        merChantId
        merChantName
        mail
        sms
        createdAt
        updatedAt
      }
      totalRow
      totalEmail
      totalSMS
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const emailSmsMerchant = data?.data.EmailSMS.GetEmailSmsMerchant;
    if (emailSmsMerchant?.succeeded) {
      yield put({
        type: types.EMAIL_SMS_MERCHANT.SUCCESS,
        payload: emailSmsMerchant?.data,
      });
      callback && callback(true, emailSmsMerchant ?? {});
    } else {
      yield put({
        type: types.EMAIL_SMS_MERCHANT.FAILURE,
      });

      callback && callback(false, emailSmsMerchant ?? {});
    }
  } catch (error) {
    yield put({
      type: types.EMAIL_SMS_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.EMAIL_SMS_MERCHANT.REQUEST, doAction);
}