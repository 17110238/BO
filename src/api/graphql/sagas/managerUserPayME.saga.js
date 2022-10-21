import { call, put, takeLatest } from 'redux-saga/effects'
import { postSearchAccountPayME } from "../apis/managerUserPayME.api"
import { typeAccountPayME } from "../redux.config"
import { saveToken } from 'utils/helpers'

function* searchAccountPayME(action) {
  try {
  const params = {
    ...action.payload
  }
    const response = yield call(postSearchAccountPayME, params)
    console.log('saga response: ', response)
    

    if (response?.succeeded) {
      yield call(saveToken, "accessToken", response?.data?.data?.Account?.Login?.accessToken);
      yield put({
        type: `${typeAccountPayME.SEARCH_ACCOUNT_PAYME}_SUCCESS`,
        payload: {
          data: response?.data,
          totalRow:response?.totalRow
        }
      })
      action.callback(true, response?.data?.data?.AccountMerchant?.SearchAccMc ?? {})
    } else {
      action.callback(false, response?.data?.data?.AccountMerchant?.SearchAccMc ?? {})
    }
  } catch (error) {
    console.log('error searchAccountPayME saga: ', error)
  }
  // loadingAp.next(true)
  // yield registerClient()
  // const clientId = yield select((state) => state?.ms?.clientId)
  // if (clientId) {
  // loadingApp.next(false)
    
}



export default function* watchAction() {
  yield takeLatest(typeAccountPayME.SEARCH_ACCOUNT_PAYME, searchAccountPayME)
}
