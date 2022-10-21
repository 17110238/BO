import { dataMerchantType } from '../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { ReportUserInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<ReportUserInput> {
    type?: typeof types.EXPORT_FILE_REPORT_USER.REQUEST;
}
const SQL_QUERY = `
mutation exportWalletReportFile($input: SearchBalanceMerchantInput) { 
    MerchantEwallet  {
        ExportSearchBalanceMerchant(input: $input) {
            message
            succeeded
        }
    }
}
`;
function* exportFile({ payload, callback }: SagaExport) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: {
                filter: { ...payload },
            },
        });
        let dataRes = data?.MerchantEwallet?.ExportSearchBalanceMerchant;
        yield put({
            type: types.EXPORT_SEARCH_ACCOUNTANT.PENDING,
        });
        callback && callback(true, dataRes ?? {});
    } catch (error) {
        console.log('error GETMcExport saga: ', error);
        yield put({
            type: types.EXPORT_SEARCH_ACCOUNTANT.FAILURE,
            payload: error,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.EXPORT_SEARCH_ACCOUNTANT.REQUEST, exportFile);
}
