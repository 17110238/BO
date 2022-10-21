import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getListEwalletIsecCode($input: SearchEWalletSocialPaymentInput){
  eWalletSocialPaymentBo{
          SearchSocialPay(input: $input){
            message
            succeeded
            data{
              transactionId
              tokenLink
              type
              fromUserId
              toUserId
              state
              createdAt
              amount
              description
              paymentMethod
              publisher
            }
          }
        }
}
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const list = data?.data?.eWalletSocialPaymentBo?.SearchSocialPay;

    if (list?.succeeded) {
      yield delay(500);
      callback && callback(true, list ?? {});
    } else {
      callback && callback(false, { data: [], sumData: {} });
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_EWALLET_SOCIAL_PAY.REQUEST, doAction);
}
