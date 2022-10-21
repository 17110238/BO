import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { SendMailInput } from 'models/message';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<SendMailInput> {
  type?: typeof types.REQUEST_SEND_MAIL.REQUEST;
}

const SQL_QUERY = `
  mutation SendEmail($input: SendMailInput!){
    SendEmailSmsMerchant {
      SendMail (input: $input) {
        message
        succeeded
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const res = data?.data?.SendEmailSmsMerchant?.SendMail;
    if (res?.succeeded) {
      yield put({
        type: types.REQUEST_SEND_MAIL.SUCCESS,
        payload: res,
      });
      callback && callback(true, res);
    } else {
      yield put({
        type: types.REQUEST_SEND_MAIL.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    console.log('error to send mail: ', error);
    yield put({
      type: types.REQUEST_SEND_MAIL.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_SEND_MAIL.REQUEST, doAction);
}
