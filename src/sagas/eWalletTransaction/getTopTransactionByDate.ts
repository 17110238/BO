import { dataMerchantType } from './../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
    type?: typeof types.GET_TOP_TRANSACTION_BY_DATE.REQUEST;
}
const SQL_QUERY = `
 query getTopTransactionByDate($input: GetTopTransactionByDateInput!) {
    eWalletTransactionBo {
        GetTopTransactionByDate(input: $input) {
             date,
            count,
            amount,
    }
}
}
`;
function* getTopTransactionByDate({ payload, callback }: SagaExport) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
       
            input: {...payload },
        });
        
      
        let dataRes = data?.data?.eWalletTransactionBo?.GetTopTransactionByDate;
    
        if (dataRes.lenght != 0) {
            yield put({
                type: types.GET_TOP_TRANSACTION_BY_DATE.SUCCESS,
                payload: dataRes,
            });
            callback && callback(true, dataRes ?? {});
        } else {
            yield put({
                type: types.GET_TOP_TRANSACTION_BY_DATE.FAILURE,
            });
            callback && callback(false, dataRes);
        }
      
    } catch (error) {
        console.log('error GETMcExport saga: ', error);
        yield put({
            type: types.GET_TOP_TRANSACTION_BY_DATE.FAILURE,
            payload: error,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_TOP_TRANSACTION_BY_DATE.REQUEST, getTopTransactionByDate);
}
