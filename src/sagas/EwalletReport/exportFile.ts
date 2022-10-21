import { dataMerchantType } from '../../models/chartmerchant/chartmerchant';
import { callGraphql } from 'api/graphql';
import { ReportUserInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<ReportUserInput> {
    type?: typeof types.EXPORT_FILE_REPORT_USER.REQUEST;
}
const SQL_QUERY = `
mutation exportEwalletReportFile($input: ReportUserInput) {
    EwalletReportBo {
        ExportReportUser(input: $input) {
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
        let dataRes = data?.EwalletReportBo?.ExportReportUser;
        yield put({
            type: types.EXPORT_FILE_REPORT_USER.PENDING,
        });
        callback && callback(true, dataRes ?? {});
    } catch (error) {
        console.log('error GETMcExport saga: ', error);
        yield put({
            type: types.EXPORT_FILE_REPORT_USER.FAILURE,
            payload: error,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.EXPORT_FILE_REPORT_USER.REQUEST, exportFile);
}
