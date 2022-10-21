import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/accountMcType';
import { SagaAction } from 'models';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaSearch extends SagaAction<FilterSearchAccountMc> {
    type?: typeof types.SEARCH_ACCOUNT_MERCHANT.REQUEST;
}

const SQL_QUERY = `
    query SearchAccountMc($input: SearchAccMcInput,$paging : ChangeLogsAccInput ,$report: ReportMcInput, ) {
        AccountMerchant {
            SearchAccMc(input: $input) {
                message
                succeeded
                data {
                    accountId
                    fullname
                    username
                    phone
                    email
                    merchantName
                    createdAt
                    lastedLoginAt
                    isActive
                    group
                    state
                    lockAccount
                    changeLogs(input : $paging){
                        createdAt
                        submittedAccountId
                        submittedAccountName
                        action
                        result
                        detail
                    }
                    report(input : $report){
                        message
                        data {
                            merchantName
                            feeTotal
                            amountTotal
                            crossCheckTotal
                            merchantId
                            crossCheckAmountTotal
                            transactionTotal
                        }
                    }
                }
                totalRow
            }
        }
    }
`;

function* searchMC({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
        paging : {
            paging : payload?.paging
        },
        report : {
            // finishedAt : payload?.filter?.createdAt ? payload?.filter?.createdAt : {}
        }
    });
    const accountMerchant = data?.data?.AccountMerchant?.SearchAccMc;

    if (accountMerchant?.succeeded) {
        yield put({
        type: types.SEARCH_ACCOUNT_MERCHANT.SUCCESS,
        payload: accountMerchant?.data,
        });
        callback && callback(true, accountMerchant ?? {});
    } else {
        yield put({
            type: types.SEARCH_ACCOUNT_MERCHANT.FAILURE,
        });

        callback && callback(false, accountMerchant ?? {});
    }
    } catch (error) {
        yield put({
            type: types.SEARCH_ACCOUNT_MERCHANT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.SEARCH_ACCOUNT_MERCHANT.REQUEST, searchMC);
}
