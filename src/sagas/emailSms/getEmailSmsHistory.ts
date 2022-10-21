import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/emailSmsTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.EMAIL_SMS_HISTORY.REQUEST;
}

const SQL_QUERY = `
query EmailSmsHistory($input : GetHistoryMerchantInput){
  EmailSMS{
    GetHistoryMerchant(input : $input)
    {
      message
      succeeded
      data {
        merChantName
        merchantId
        quantityEmail
        quantitySMS
        quantityEmailBefore
        quantityEmailAfter
        quantitySMSBefore
        quantitySMSAfter
        state
        change
        transactionId
        createdAt
        updatedAt
      }
      totalRow
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const emailSmsHistory = data?.data.EmailSMS.GetHistoryMerchant;
    if (emailSmsHistory?.succeeded) {
      yield put({
        type: types.EMAIL_SMS_HISTORY.SUCCESS,
        payload: emailSmsHistory?.data,
      });
      callback && callback(true, emailSmsHistory ?? {});
    } else {
      yield put({
        type: types.EMAIL_SMS_HISTORY.FAILURE,
      });

      callback && callback(false, emailSmsHistory ?? {});
    }
  } catch (error) {
    yield put({
      type: types.EMAIL_SMS_HISTORY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.EMAIL_SMS_HISTORY.REQUEST, doAction);
}