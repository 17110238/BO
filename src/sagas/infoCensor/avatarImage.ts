import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction, SearchEwalletAccountInput } from 'models';
import { callGraphql } from 'api/graphql';
import _ from 'lodash'

interface SagaSearch extends SagaAction<SearchEwalletAccountInput> {
  type?: typeof types.GET_LIST_AVATAR_IMAGE.REQUEST;
}

const SQL_QUERY = `
query GetListEWalletAccount($input: SearchEwalletAccountInput){
  EwalletAccount{
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
              path
              }
            district {
              title
              identifyCode
              path
              }
            ward {
              title
              identifyCode
              path
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
            image  {
              front
              back
              state
              }
            video {
              video
              state
              }
            face {
              face
              state
              }
            placeOfIssue
            issuedAt
            address {
              street
              city {
                title
                identifyCode
                path
                }
              district  {
                title
                identifyCode
                path
                }
              ward {
                title
                identifyCode
                path
                }
              }
            kycMerchant {
              taxCode
              name
              shortName
              phone
              email
              website
              logo
              address
              shopAddress
              business
              representative
              state
              lincenseImage
              }
            }
          balance
          appName
          alias
          clockLoginFail
          createdAt
          updatedAt
          linkedInfo {
            id
            accountId
            phone
            appName
            state
            linkedAt
            type
            cardInfo  {
              swiftCode
              bankName
              bankCode
              cardNumber
              accountNumber
              cardHolder
              issuedAt
              expiredAt
              }
            }
          aliasProfile {
            id
            alias
            state
            updateTimes
            createdAt
            }
      }
    }
}
`;

function* getListEWalletAccount({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const avatarImages = data?.data?.EwalletAccount?.Search;
    if (Array.isArray(avatarImages)) {
      yield put({
        type: types.GET_LIST_AVATAR_IMAGE.SUCCESS,
        payload: avatarImages,
      });
      callback && callback(true, avatarImages ?? {});
    } else {
      yield put({
        type: types.GET_LIST_AVATAR_IMAGE.FAILURE,
      });
      callback && callback(false, avatarImages);
    }
  } catch (error) {
    console.log('error get transaction list: ', error);
    yield put({
      type: types.GET_LIST_AVATAR_IMAGE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_AVATAR_IMAGE.REQUEST, getListEWalletAccount);
}
