import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/emailSmsTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaUpdate extends SagaAction<any> {
  type?: typeof types.UPDATE_EMAIL_SMS_PRODUCT.REQUEST;
}

const SQL_QUERY = `
mutation UpdateEmailSmsProduct($input : UpdateEmailSmsProductInput!) {
  EmailSMS {
    UpdateEmailSmsProduct(input : $input){
          message
          succeeded
      }
  }
}
`;

function* doAction({ payload, callback }: SagaUpdate) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const updateEmailSmsProduct = data?.data?.EmailSMS?.UpdateEmailSmsProduct;

    if (updateEmailSmsProduct?.succeeded) {
      yield put({
        type: types.UPDATE_EMAIL_SMS_PRODUCT.SUCCESS,
        payload: updateEmailSmsProduct?.password,
      });
      callback && callback(true, updateEmailSmsProduct);
    } else {
      yield put({
        type: types.UPDATE_EMAIL_SMS_PRODUCT.FAILURE,
      });

      callback && callback(false, updateEmailSmsProduct);
    }
  } catch (error) {
    yield put({
      type: types.UPDATE_EMAIL_SMS_PRODUCT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_EMAIL_SMS_PRODUCT.REQUEST, doAction);
}
