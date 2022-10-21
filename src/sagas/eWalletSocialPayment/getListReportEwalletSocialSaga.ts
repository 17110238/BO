import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getListReportEwalletIsecCode($input: ReportEWalletSocialPaymentInput){
        eWalletSocialPaymentBo{
          ReportSocialPay(input: $input){
            message
            succeeded
            data{
              paymentMethod
              numberPaymentMethod
              totalTransaction
              totalReal
              totalFee
            }
            sumData{
              numberPaymentMethod
              totalTransaction
              totalReal
              totalFee
            }
          }
        }
}
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    delete payload.paging;
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const list = data?.data?.eWalletSocialPaymentBo?.ReportSocialPay;

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
  yield takeLatest(types.GET_LIST_REPORT_EWALLET_SOCIAL.REQUEST, doAction);
}
