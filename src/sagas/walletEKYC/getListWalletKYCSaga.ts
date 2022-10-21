import { callGraphql } from 'api/graphql';
import { PayloadSearchKYC, SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadSearchKYC> {
  type?: string;
}

const SQL_QUERY = `query getListWalletKYC($input: GetListEwalletKycInput!){
      EwalletKycBo{
        GetList(input: $input) {
            succeeded
            message
            totalRow
            data {
              id
              appName
              accountId
              phone
              fullname
              birthday
              gender
              kycAutoState
              address {
                  street
                  city {title, identifyCode}
                  district {title, identifyCode}
                  ward {title, identifyCode}
              }
              addressString
              identifyNumber
              issuedAt
              approvedAt
              createdAt
              updatedAt
              nationality
              type
              placeOfIssue
              video {
                  video
                  state
              }
              image {
                  back
                  front
                  state
              }
              face {
                  face
                  state
              }
              state
              registeredAt
              accountType
              identifyIC {front, back, state, reason}
              merchant {
                taxCode
                name
                shortName
                email
                website
                logo
                address
                business
                representative
                openTime
                state
                lincenseImage
                phone
                shopAddress
              }
          }
        }
      }
    }
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const kycs = data?.data?.EwalletKycBo?.GetList;

    if (kycs?.succeeded) {
      yield delay(500);
      callback && callback(true, kycs ?? {});
    } else {
      callback && callback(false, { data: [] });
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_EWALLET_KYC.REQUEST, doAction);
}
