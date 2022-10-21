import { callGraphql } from 'api/graphql';
import { GetMerchantSDKInput, SagaAction } from 'models';
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetMerchantSDKInput> {
  type?: typeof types.MC_SDK_LIST.REQUEST;
}

const SQL_QUERY = `query getMCSDKList($input: GetMerchantSDKInput){
    Merchant{
      GetMerchantSDK(input: $input){
        merchantId,
        merchantName
      }
    }
  }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, payload ? { input: payload } : {});
    const sdkMCList = data?.data?.Merchant?.GetMerchantSDK;

    if (Array.isArray(sdkMCList) && sdkMCList.length > 0) {
      yield put({
        type: types.MC_SDK_LIST.SUCCESS,
      });

      callback && callback(true, sdkMCList);
    } else {
      yield put({
        type: types.MC_SDK_LIST.FAILURE,
      });

      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    yield put({
      type: types.MC_SDK_LIST.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.MC_SDK_LIST.REQUEST, doAction);
}
