import { callGraphql } from 'api/graphql';
import { PayloadDetailMerchantRevenue, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `
mutation sendMailMerchantReportCrossCheck($input: FilterSendMerchantReportCrossCheckInput!){
        CrossCheck{
          BoSendMerchantReportCrossCheck(input: $input) {
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
    const details = data?.data?.CrossCheck?.BoSendMerchantReportCrossCheck;

    if (details?.succeeded) {
      callback && callback(true, details);
    } else {
      callback && callback(false, details || {});
    }
  } catch (error) {
    console.log('error get changed info: ', error);
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEND_MAIL_MERCHANT_REPORT_CROSS_CHECK.REQUEST, doAction);
}
