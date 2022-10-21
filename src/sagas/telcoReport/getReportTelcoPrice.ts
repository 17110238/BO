import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_TELCO_PRICE.REQUEST;
}

const SQL_QUERY = `
    query reportTelcoByPrice($input:GetReportCardTelcoInput) {
        EwalletReportBo {
        ReportCardTelcoPrice(input:$input){
            data {
            price,
            totalCard,
            totalAmountCard,
            totalWallet
            }
            sumData{
            totalCard,
            totalAmountCard,
            totalWallet
            }
        }
        }
    }
`;

function* getReportTelcoPrice({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const telcoPrice = data.data.EwalletReportBo.ReportCardTelcoPrice;
    if (Array.isArray(telcoPrice?.data)) {
      yield put({
        type: types.GET_TELCO_PRICE.SUCCESS,
        payload: telcoPrice,
      });
      callback && callback(true, telcoPrice);
    } else {
      yield put({
        type: types.GET_TELCO_PRICE.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get report telco saga: ', error);
    yield put({
      type: types.GET_TELCO_PRICE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TELCO_PRICE.REQUEST, getReportTelcoPrice);
}
