import { call, put, takeLatest } from 'redux-saga/effects'
import { searchAccountMerchantAPI } from '../apis/accountMerchant.api';
import { HIDE_LOADING, SHOW_LOADING, typeAccountMerchant } from '../redux.config'

function* searchAccountMC(action) {
  try {
  const params = {
    ...action.payload
  }
    yield put({ type: SHOW_LOADING });
    const responseSearchMC = yield call(searchAccountMerchantAPI, params)
    yield put({ type: HIDE_LOADING });

    if (responseSearchMC?.data?.data?.AccountMerchant?.SearchAccMc?.succeeded) {
      yield put({
        type: `${typeAccountMerchant.SEARCH_ACC_MC}_SUCCESS`,
        payload: responseSearchMC?.data?.data?.AccountMerchant?.SearchAccMc?.data
      })
    } else {
      action.callback(false, responseSearchMC?.data?.data?.AccountMerchant?.SearchAccMc?.data ?? {})
    }
  } catch (error) {
    console.log('error searchAccountMC saga: ', error)
  }
}

export default function* watchAction() {
  yield takeLatest(typeAccountMerchant.SEARCH_ACC_MC, searchAccountMC)
}
