import { dataMerchantType } from './../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<any> {
    type?: typeof types.EXPORT_E_WALLET_TRANSACTION.REQUEST;
}
const SQL_QUERY = `
mutation exportEwalletTransaction($input: SearchEWalletTransactionInput) {
    eWalletTransactionBo {
        ExportEwalletTransaction(input: $input) {
            message
            succeeded
    }
}
}
`;
function* doAction({ payload, callback }: SagaExport) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: {
                filter: { ...payload },
            },
        });
        let dataRes = data?.eWalletTransactionBo?.ExportEwalletTransaction;

        yield put({
            type: types.EXPORT_E_WALLET_TRANSACTION.PENDING,
        });
        callback?.(true, dataRes ?? {});
    } catch (error) {
        console.log('error GETMcExport saga: ', error);
        yield put({
            type: types.EXPORT_E_WALLET_TRANSACTION.FAILURE,
            payload: error,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.EXPORT_E_WALLET_TRANSACTION.REQUEST, doAction);
}
