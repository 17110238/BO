import { call, put, takeLatest } from "redux-saga/effects";
import * as types from "redux/types";
import { SagaAction } from "models";
import { FilterSearchAccountMc } from "models/account/accountMerchant";
import { callGraphql } from "api/graphql";

interface SagaSearch extends SagaAction<FilterSearchAccountMc> {
    type?: typeof types.SEARCH_USER_MERCHANT.REQUEST;
}


const SQL_QUERY1 = `
query GetList($input: GetListInput) {
    Account {
      GetList(input: $input){
        message
        succeeded
        data{
            id
        username
        group
        fullname
        accountType
        phone
        gender
        birthday
        email
        isActive
        state
        scope
        createdAt
        operator{
            accountId
            username
        }
        }
        totalRow
      }
    }
  }
`
function* searchUser({ payload, callback }: SagaSearch) {
    try {
       
        const { data } = yield call<any>(callGraphql, SQL_QUERY1, {
            input: { ...payload },
        });
        const merchant = data;

        if (merchant?.data?.Account?.GetList.succeeded ) {
            yield put({
                type: types.SEARCH_USER_MERCHANT.SUCCESS,
                payload: merchant?.data.Account?.GetList.data,
            });
            callback && callback(true, data ?? {});
        } else {
            yield put({
                type: types.SEARCH_USER_MERCHANT.FAILURE,
            });

            callback && callback(false, merchant?.data ?? {});
        }
    } catch (error) {
        console.log("error searchMC saga: ", error);
        yield put({
            type: types.SEARCH_USER_MERCHANT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.SEARCH_USER_MERCHANT.REQUEST, searchUser);
}