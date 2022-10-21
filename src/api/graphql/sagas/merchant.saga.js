import { call, put, takeLatest } from 'redux-saga/effects'
import { searchMCAPI } from '../apis/merchant.api'
import { HIDE_LOADING, SHOW_LOADING, typeMerchant } from '../redux.config'

function* searchMC(action) {
  try {
  const params = {
    ...action.payload
  }
    yield put({ type: SHOW_LOADING });
    const responseSearchMC = yield call(searchMCAPI, params)
    yield put({ type: HIDE_LOADING });

    if (responseSearchMC?.data?.data?.Merchant?.SearchMc?.succeeded) {
      yield put({
        type: `${typeMerchant.SEARCH_MERCHANT}_SUCCESS`,
        payload: responseSearchMC?.data?.data?.Merchant?.SearchMc?.data
      })
    } else {
      action.callback(false, responseSearchMC?.data?.data?.Merchant?.SearchMc?.data ?? {})
    }
  } catch (error) {
    console.log('error searchMC saga: ', error)
  }
}

export default function* watchAction() {
  yield takeLatest(typeMerchant.SEARCH_MERCHANT, searchMC)
}
