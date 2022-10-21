import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import HeaderMerchantInfo from './HeaderMerchantInfo';
import TabMerchantInfo from './TabMerchantInfo';
import BoxSearchMerchantInfo from './BoxSearchMerchantInfo';
import alert from 'utils/helpers/alert';
import {
  EwalletAccount,
  SearchTypeEwalletAccountEnum,
} from 'models/merchantInfo/merchantInfoState';
import { resetSearchMerchant, searchMerchantInfo } from 'redux/actions/merchantInfoActions';
import LoadingInline from 'components/common/Loading/LoadingInline';
import { ajaxPrefilter } from 'jquery';

interface Props {
  tabActive?: number;
  merchantId?: any;
}

export interface FilterSearchParams {
  id?: number[];
  state?: string[];
  accountType?: string;
  searchValue: string;
  searchType: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface SearchParams {
  filter?: FilterSearchParams;
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

const MerchantInfoContainer: React.FC<Props> = () => {
  const [isShowFilter, setIsShowFilter] = useState<{
    walletHistory: boolean;
    transactionHistory: boolean;
    transactionReport: boolean;
    session: boolean;
  }>({
    walletHistory: true,
    transactionHistory: true,
    transactionReport: true,
    session: true,
  });

  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({});
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loading);

  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {

    if (data?.filter?.searchType === 'FULLNAME') {
      data = { filter: { searchType: 'ACCOUNT_ID', searchValue: data?.filter?.searchValue.toString() } };
    }
    setFilter(data);
    setSubmitForm(true);
  };

  useEffect(() => {
    if (filter?.filter?.searchValue && !isLoading && submitForm) {
      dispatch(
        searchMerchantInfo(filter, (status, res) => {
          if (res?.length === 0) alert('error', 'Không tìm thấy thông tin KH');
        })
      );
      setSubmitForm(false);
    }
  }, [filter, submitForm]);

  return (
    <div className='merchant-info-container'>
      {/* <LoadingInline loading={isLoading} /> */}
      <HeaderMerchantInfo t={t} showFilter={showFilter} toggleFilter={toggleFilter} />
      {showFilter && (
        <BoxSearchMerchantInfo
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
        />
      )}
      <TabMerchantInfo
        parentSubmit={submitForm}
        isShowFilter={isShowFilter}
        onClickFilterWalletHistory={() => {
          setIsShowFilter({
            ...isShowFilter,
            walletHistory: !isShowFilter.walletHistory,
          });
        }}
        onClickFilterTransactionHistory={() => {
          setIsShowFilter({
            ...isShowFilter,
            transactionHistory: !isShowFilter.transactionHistory,
          });
        }}
        onClickFilterTransactionReport={() => {
          setIsShowFilter({
            ...isShowFilter,
            transactionReport: !isShowFilter.transactionReport,
          });
        }}
        onClickFilterSession={() => {
          setIsShowFilter({
            ...isShowFilter,
            session: !isShowFilter.session,
          });
        }}
      />
    </div>
  );
};

export default MerchantInfoContainer;
