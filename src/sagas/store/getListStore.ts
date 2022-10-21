import { SagaAction, SearchStoreInput } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<SearchStoreInput> {
  type?: typeof types.GET_LIST_STORE.REQUEST;
}

const SQL_QUERY = `query getListStore($input: SearchStoreInput) {
  Store {
    SearchStore(input: $input) {
      message
      succeeded
      totalRow
      data {
        storeId,
        storeName,
        accountId,
        username,
        businessCode,
        merchantId,
        merchantName,
        address,
        storeImages,
        merchantRegDoc,
        createdAt,
        state,
        isActive,
        isShift,
        website,
        paymentForm,
        logo,
        transactionType,
        description,
        operator {
          accountId
          username
        },
        contact {
          fullname,
          email,
          phone,
        },
        workingTime {
          open,
          close
        },
        registration {
          address,
          locationIdentifyCode,
          images
        },
        crossCheckInfo {
          isOwner,
          isUseBank,
          isAllowCrossCheck,
          crossCheckNum,
          type,
          payME {
            phone,
            fullname
          },
          bank {
            number,
            fullname,
            swiftCode,
            province,
            branch,
            provinceIdentifyCode
          },
        },
        locale {
          title,
          locale
        },
        paymentMethod {
          paymentMethodId,
          paymentMethodName,
          state,
          reason,
          isActive
        },
        delegate {
          accountId,
          fullname,
          username,
          isActive,
          createdAt,
          expiryAt
        }
        bannerInfo {
          isActive
          banners {
            id
            showDuration
            from
            to
            createdAt
            type
            link
            order
          }
        }
      }
    }
  }
}
`;

// `storeId,
// storeName,
// accountId,
// username,
// businessCode,
// merchantId,
// merchantName,
// address,
// storeImages,
// merchantRegDoc,
// createdAt,
// approvedAccountId,
// state,
// isActive,
// isShift,
// website,
// paymentForm,
// logo,
// transactionType,
// description,
// contact {
//   fullname,
//   email,
//   phone,
//   identifyImages
// },
// workingTime {
//   open,
//   close
// },
// registration {
//   province,
//   district,
//   wards,
//   address,
//   locationIdentifyCode,
//   images
// },
// crossCheckInfo {
//   isOwner,
//   isUseBank,
//   isAllowCrossCheck,
//   crossCheckNum,
//   type,
//   payME {
//     phone,
//     walletAccountId,
//     fullname
//   },
//   bank {
//     number,
//     fullname,
//     swiftCode,
//     province,
//     branch,
//     provinceIdentifyCode
//   },
// },
// locale {
//   title,
//   description,
//   locale
// },
// paymentMethod {
//   paymentMethodId,
//   paymentMethodName,
//   state,
//   reason,
//   isActive
// },
// paymentMethodExtend {
//   method,
//   extraData
// }
// delegate {
//   accountId,
//   fullname,
//   username,
//   phone,
//   isAllowCancel,
//   isActive,
//   createdAt,
//   expiryAt
// }
// bannerInfo {
//   isActive
//   banners {
//     id
//     showDuration
//     from
//     to
//     createdAt
//     type
//     link
//     order
//   }
// }`

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const stores = data?.data?.Store?.SearchStore;
    if (stores) {
      yield put({
        type: types.GET_LIST_STORE.SUCCESS,
        payload: stores?.data,
      });
      callback && callback(true, stores ?? {});
    } else {
      yield put({
        type: types.GET_LIST_STORE.FAILURE,
      });

      callback && callback(false, stores);
    }
  } catch (error) {
    console.log('error get store list: ', error);
    yield put({
      type: types.GET_LIST_STORE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_STORE.REQUEST, doAction);
}
