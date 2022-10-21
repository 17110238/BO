import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { SearchEwalletAccountInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<SearchEwalletAccountInput> {
  type?: typeof types.SEARCH_MERCHANT_INFO_LIST.REQUEST;
}

const SQL_QUERY = `
  query getMerchantInfoList($input: SearchEwalletAccountInput) {
    EwalletAccount {
      Search(input: $input) {
        id
        fullname
        phone
        email
        avatar
        updatedAvatarAt
        birthday
        isActive
        isVerifiedEmail
        state
        gender
        accountType
        createdClientId
        createdIp
        scope
        lastedLoginAt
        lastedLogoutAt
        address {
          street
          city {
            title
            identifyCode
          }
          district {
            title
            identifyCode
          }
          ward {
            title
            identifyCode
          }
        }
        createdDeviceInfo {
          platform
          channel
          version
        }
        kyc {
          kycId
          type
          identifyNumber
          state
          reason
          sentAt
          image {
            front
            back
          }
          video{
            video
          }
          placeOfIssue
          issuedAt
          kycMerchant {
            name
            taxCode
            representative
            phone
            logo
            lincenseImage
            address
            shopAddress
          }
        }
        balance
        appName
        alias
        clockLoginFail
        createdAt
        updatedAt
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.EwalletAccount?.Search;

    if (result) {
      yield put({
        type: types.SEARCH_MERCHANT_INFO_LIST.SUCCESS,
        payload: result,
      });
      callback && callback(true, result ?? []);
    } else {
      yield put({
        type: types.SEARCH_MERCHANT_INFO_LIST.FAILURE,
      });

      callback && callback(false, result ?? []);
    }
  } catch (error) {
    yield put({
      type: types.SEARCH_MERCHANT_INFO_LIST.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEARCH_MERCHANT_INFO_LIST.REQUEST, doAction);
}
