import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import {
  FilterLogTransactionFeeInput,
  FilterSearchParams,
  GetAccountMerchantLogInput,
  LogsTransactionFee,
  LogsType,
  MerchantAccount,
  SearchByRoleInput,
  stateMcEnum,
} from 'models';
import { UserBo } from 'models/user/accountMerchant';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  exportFileMerchant,
  exportFileMerchantSocketFailure,
  exportFileMerchantSocketSuccess,
  getListAccountSale,
  getLogTransactionFee,
  getMerchantLog,
  requestUpdateActiveMerchant,
  resendMailApproval,
  searchMerchant,
  updateContractMerchant,
  searchExpertiseMerchant,
} from 'redux/actions';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import { swalCustom } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import BoxSearchExpertiseMerchant, { SearchParams } from './BoxSearchExpertiseMerchant';
import DataTableExpertiseMerchant from './DataTableExpertiseMerchant';
import HeaderExpertiseMerchant from './HeaderExpertiseMerchant';

interface ModalStateType {
  modalChangePassword: boolean;
  modalContract: boolean;
  modalHistoryUpdate: boolean;
  modalConfigurationFee: boolean;
  modalCreateSettlement: boolean;
  modalDisableMailSettlement: boolean;
}

const ExpertiseMerchant: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();

  const loading = useSelector<any, boolean>((state) => state?.merchantRD?.loading);
  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );
  const [merchantList, setMerchantList] = useState<any>('');
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [dataContract, setDataContract] = useState<string>('');
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({});
  const [merchantId, setMerchantId] = useState<string>('');
  const [saleMembers, setSaleMembers] = useState<UserBo[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const startDate = 'from';
  const endDate = 'to';
  const [socket, setSocket] = useState('');

  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };

    delete params.to;
    delete params.from;
    delete params.operatorAccountId;

    const payload = JSON.parse(
      JSON.stringify({
        ...params,
        ...(router?.query?.operatorAccountId
          ? { operatorAccountId: +(router?.query?.operatorAccountId as string) }
          : {}),
          approvedAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      })
    );

    !Object.keys(payload.approvedAt).length && delete payload.approvedAt;

    setFilter(payload);
    setSubmitForm(true);
  }, []);

  useEffect(() => {
    const payload: SearchByRoleInput = {
      filter: {
        role: 'ins.sale',
      },
      paging: {
        start: 0,
        limit: 100,
      },
    };
    dispatch(
      getListAccountSale(payload, (status, res) => {
        setSaleMembers(res);
      })
    );
  }, []);

  const formatDataSearch = (data: SearchParams | any) => {
    const dataCopy = { ...data };

    !Object.keys(dataCopy?.approvedAt || {}).length && delete dataCopy.approvedAt;

    return dataCopy;
  };

  const handleSubmitSearch = (data: SearchParams | any) => {
    let approvedAt = data?.createdAt ;
    delete data?.createdAt;
    data = {...data,approvedAt}
    const newData = formatDataSearch(data);
    setFilter({
      ...newData,
    });

    // payload trùng vẫn có thể search được
    setSubmitForm(true);
  };

  const handleSearchMerchant = (start?: number, limit?: number, sort?: {}) => {
    const payload: FilterSearchParams | any  = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      // sort,
    };

    function getListMerchant(payload: FilterSearchParams | any) {
      setLoadingTable(true);
      dispatch(
        searchExpertiseMerchant(payload, (status, res) => {
          setMerchantList(res?.data);
          setSubmitForm(false);
          setLoadingTable(false);
        })
      );
    }

    return {
      payload,
      getList: getListMerchant,
      submitForm,
    };
  };

  const getParameterInURL = (params: string) => {
    const emptyString = '';
    const currentLocation = window.location.href;
    const url = new URL(currentLocation);
    let getParam = url.searchParams.get(params);
    if (getParam) {
      return getParam;
    } else {
      return emptyString;
    }
  };


  return (
    <>
      <div className='merchant-container expertise-merchant-container'>
        <HeaderExpertiseMerchant
          isShowFilter={isShowFilter}
      
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && (
            <BoxSearchExpertiseMerchant
              loading={loadingTable}
              saleMembers={saleMembers}
              onSubmitSearch={handleSubmitSearch}
              
            />
          )}
          <DataTableExpertiseMerchant
            data={merchantList}
            getDataList={handleSearchMerchant}
            {...{ refreshTable: submitForm, isLoading: loadingTable }}
          />
        </div>
      </div>

      {loading && <LoadingFullScreen />}
    </>
  );
};

const query = `subscription subExportMc {
  SubExport{
      SubExportExcel{
          message
          succeeded
          type
          accountId
          url
          data
      }
  }
  }`;

export default ExpertiseMerchant;
