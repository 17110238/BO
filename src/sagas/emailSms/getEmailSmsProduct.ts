import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/emailSmsTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.EMAIL_SMS_PRODUCT.REQUEST;
}

const SQL_QUERY = `
query EmailSmsProduct($input : GetEmailSmsProductInput){
  EmailSMS{
    GetEmailSmsProduct(input : $input)
    {
      message
      succeeded
      data {
        id
        package {
          mail
          sms
        }
        isVisible
        title
        description
        amount
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
    const emailSmsProduct = data?.data.EmailSMS.GetEmailSmsProduct;

    if (emailSmsProduct?.succeeded) {
      yield put({
        type: types.EMAIL_SMS_PRODUCT.SUCCESS,
        payload: emailSmsProduct?.data,
      });
      callback && callback(true, emailSmsProduct ?? {});
    } else {
      yield put({
        type: types.EMAIL_SMS_PRODUCT.FAILURE,
      });

      callback && callback(false, emailSmsProduct ?? {});
    }
  } catch (error) {
    yield put({
      type: types.EMAIL_SMS_PRODUCT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.EMAIL_SMS_PRODUCT.REQUEST, doAction);
}
