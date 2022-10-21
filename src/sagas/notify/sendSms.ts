import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/notifyTypes';
import { SagaAction, SendSmsInput } from 'models';
import { callGraphql, callGraphQlFormData } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.SEND_SMS.REQUEST;
}

const SQL_QUERY = `
  mutation SendSms($file: Upload, $campaign: String!, $phoneList: [String], $content: String) {
    SendEmailSmsMerchant{
      SendSms(
        file: $file,
        campaign: $campaign,
        phoneList: $phoneList,
        content: $content
      ) {
        message
        succeeded
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    if (payload.file) {
      const { data } = yield call<any>(
        callGraphQlFormData,
        SQL_QUERY,
        payload,
        payload.file,
      );
      if (data.data.SendEmailSmsMerchant.SendSms.succeeded) {
        yield put({
          type: types.SEND_SMS.SUCCESS,
          payload: data.data.SendEmailSmsMerchant.SendSms.message
        })
        callback && callback(true, data.data.SendEmailSmsMerchant.SendSms.message);
      } else {
        yield put({
          type: types.SEND_SMS.FAILURE
        })
        callback && callback(false, data.data.SendEmailSmsMerchant.SendSms.message);
      }
    } else {
      const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        ...payload,
      });
      if (data.data.SendEmailSmsMerchant.SendSms.succeeded) {
        yield put({
          type: types.SEND_SMS.SUCCESS,
          payload: data.data.SendEmailSmsMerchant.SendSms.message
        })
        callback && callback(true, data.data.SendEmailSmsMerchant.SendSms.message);
      } else {
        yield put({
          type: types.SEND_SMS.FAILURE
        })
        callback && callback(false, data.data.SendEmailSmsMerchant.SendSms.message);
      }
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEND_SMS.REQUEST, doAction);
}
