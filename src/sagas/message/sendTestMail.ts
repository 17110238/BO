import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { SendMailInput } from 'models/message';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<SendMailInput> {
  type?: typeof types.SEND_TEST_MAIL.REQUEST;
}

const SQL_QUERY = `
  mutation SendEmail($input: emailTestInput!){
    Announce {
      emailTest (input: $input) {
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
    const res = data?.data?.Announce?.emailTest;
    if (res?.succeeded) {
      yield put({
        type: types.SEND_TEST_MAIL.SUCCESS,
        payload: res,
      });
      callback && callback(true, res);
    } else {
      yield put({
        type: types.SEND_TEST_MAIL.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    console.log('error to send mail: ', error);
    yield put({
      type: types.SEND_TEST_MAIL.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEND_TEST_MAIL.REQUEST, doAction);
}
