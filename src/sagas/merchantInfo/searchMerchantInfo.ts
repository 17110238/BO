import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { SearchEwalletAccountInput } from 'models/merchantInfo/merchantInfoState';

interface SagaSearch extends SagaAction<SearchEwalletAccountInput | any> {
  type?: typeof types.SEARCH_MERCHANT_INFO.REQUEST;
}

const SQL_QUERY = `
  query getMerchantInfo($input: SearchEwalletAccountInput) {
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
          face{
            face
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
        shareHolders {
          fullname
          identifyNumber
          title
          capitalRatio
          nationality
        }
        temporaryAddress{
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
        position
        career
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
        type: types.SEARCH_MERCHANT_INFO.SUCCESS,
        payload: result,
      });
      callback && callback(true, result ?? []);
    } else {
      yield put({
        type: types.SEARCH_MERCHANT_INFO.FAILURE,
      });

      callback && callback(false, result ?? []);
    }
  } catch (error) {
    yield put({
      type: types.SEARCH_MERCHANT_INFO.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.SEARCH_MERCHANT_INFO.REQUEST, doAction);
}
