import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { FilterSearchAccountMc } from 'models/account/accountMerchant';
import { callGraphql } from 'api/graphql';

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
        scope
        accountType
        group
        fullname
        accountType
        phone
        gender
        birthday
        address
        identifyNumber
        issueDate
        issuePlace
        email
        isActive
        state
        scope
        lastedLoginAt
        lastedLogoutAt
        refcode
        link
        operator{
          accountId
          username
        }
      }
      }
    }
  }
`;
function* getDetailUser({ payload, callback }: SagaSearch) {
  try {
   
    const { data } = yield call<any>(callGraphql, SQL_QUERY1, {
      input: { ...payload },
    });
    const merchant = data;
    // console.log(
    //   '🚀 ~ file: getDetailUser.ts ~ line 48 ~ function*getDetailUser ~ merchant',
    //   merchant?.data.Account?.GetList.data[0]
    // );
    if (merchant?.data?.Account?.GetList.succeeded) {
      yield put({
        type: types.GET_DETAIL_USER.SUCCESS,
        payload: merchant?.data.Account?.GetList.data[0],
      });
      callback && callback(true, data ?? {});
    } else {
      yield put({
        type: types.GET_DETAIL_USER.FAILURE,
      });

      callback && callback(false, merchant?.data ?? {});
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.GET_DETAIL_USER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DETAIL_USER.REQUEST, getDetailUser);
}
