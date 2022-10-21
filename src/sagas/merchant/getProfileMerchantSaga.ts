import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { FilterSearchParams, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<FilterSearchParams> {
  type?: typeof types.GET_PROFILE_MERCHANT.REQUEST;
}

const SQL_QUERY = `query SearchMC($input: SearchMcInput) {
    Merchant {
      SearchMc(input: $input) {
        message
        succeeded
        data {
          merchantId
          appraisalState
          accountInfo {
            id
            username
            fullname
            phone
            email
            accountType
            gender
          }
          connectionTypeList
          isActive
          isShift
          createdAt
          approvedAt
          updatedAt
          state
          authType
          withdrawVerifyType
          minBalance
          stores {
            storeId
            storeName
            address
            createdAt
            isActive
          }
          contactInfo{
            birthday
            name
            email
            phone
            identifyNumber
            issuePlace
            position
            issueDate
            nationality
          }
          businessOverview{
            type
            category
            categoryName
            abbreviationName
            brandName
            description
            maxRange
            connectionType
            homeUrl
            taxCode
            address
            province
            district
            wards
            locationIdentifyCode
            maxAmountTransaction
            logo
            averageIncome
            totalRevenue
            operatingStaff
            companyAddress {
              name
              address
              phoneNumber
            }
            shareholders{
              fullname
              identifyNumber
              title
              capitalRatio
              nationality
            }
            benefitOwner {
              fullname
              birthday
              identifyNumber
              issueDate
              issuePlace
              email
              nationality
            }
          }
          businessDetails {
            identifyImages
            licenseImages
            otherImages
            representativeContracts
            chiefAccountantAppointment
            benefitOwnerDocument
            executiveMemberList
            merchantContract {
                contractId
                contractCode
                fileName
                url
            }
          }
          crossCheckInfo{
            isOwner
            isUseBank
            isAllowCrossCheck
            crossCheckNum
            type
          }
          paymentMethodExtend{
            method
            extraData
          }
          paymentMethod{
            referId
          }
          paymentMethodUse
          delegate{
            accountId
            fullname
            displayName
            phone
            email
            isActivePasswordTrading
            passwordTrading
            role
            tokenVerify
            username
            isActive
            state
          }
          isSecurityPayout
          notifyTelegram{
            payout
            payment
          }
          currency
          operator{
            accountId
            username
          }
          emailBcc
          product
          contractDateStart
          contractDateEnd
          contractState
        }
        totalRow
      }
    }
    }
  `;

function* searchMC({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });

    const merchant = data?.data?.Merchant?.SearchMc;
    if (merchant?.succeeded) {
      yield put({
        type: types.GET_PROFILE_MERCHANT.SUCCESS,
        payload: merchant?.data[0],
      });
      callback && callback(true, merchant);
    } else {
      yield put({
        type: types.GET_PROFILE_MERCHANT.FAILURE,
      });

      callback && callback(false, {});
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    yield put({
      type: types.GET_PROFILE_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_PROFILE_MERCHANT.REQUEST, searchMC);
}
