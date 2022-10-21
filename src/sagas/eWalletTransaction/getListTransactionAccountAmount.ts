import { GET_TOP_TRANSACTION_BY_ACCOUNT } from './../../redux/types/eWalletTransactionTypes';
import { dataMerchantType } from './../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
    type?: typeof types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.REQUEST;
}
const SQL_QUERY = `
 query getTopTransactionByAccount($input: GetTopTransactionByAccountInput!) {
    eWalletTransactionBo {
        GetTopTransactionByAccount(input: $input) {
            accountId,
            fullname,
            count,
            amount,    
            average,
            max
    }
}
}
`;
function* getTopTransactionByAccountAmount({ payload, callback }: SagaExport) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: {...payload },
        });
        let dataRes = data?.data?.eWalletTransactionBo?.GetTopTransactionByAccount;
        if (dataRes.lenght != 0) {
            yield put({
                type: types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.SUCCESS,
                payload: dataRes,
            });
            callback && callback(true, dataRes ?? {});
        } else {
            yield put({
                type: types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.FAILURE,
            });
            callback && callback(false, dataRes);
        }
    } catch (error) {
        yield put({
            type: types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.FAILURE,
            payload: error,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_TOP_TRANSACTION_BY_ACCOUNT_AMOUNT.REQUEST, getTopTransactionByAccountAmount);
}
