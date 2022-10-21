import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useElementSize from 'hook/useElementSize';
import { GetAllTransactionsInput, SearchBalanceMerchantResponsed } from 'models';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBalanceMerchantAction, searchBalanceMerchantAction } from 'redux/actions/accountantAction';
import BoxSearchTransaction, { SearchParams } from './BoxSearchAccountantBalance';
import DataTableAccountBalance from './DataTableAccountBalance';
import DataTableTransaction from './DataTableAccountBalance';
import HeaderTransaction from './HeaderAccountBalance';
dayjs.extend(utc);

interface Payload {
  filter: {
    method?: string | null;
    state?: string | null;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort: {
    createdAt: number;
  };
}
const SearchAccountBalance: React.FC = (props: any) => {
  const defaultValues = {
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    }
  }
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showModalControl, setShowModalControl] = useState<boolean>(false);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const balanceMerchantList = useSelector<any, SearchBalanceMerchantResponsed[]>(
    (state) => state?.eWalletBalanceReducer?.listWalletBalance
  );
  const isLoading = useSelector<any, boolean>((state) => state?.eWalletBalanceReducer?.loading);
  const isLoadingExport = useSelector<any, boolean>((state) => state?.eWalletBalanceReducer?.loadingExport);
  const [filter, setFilter] = useState(defaultValues);
  const handleSubmitSearch = (data: SearchParams) => {
    let bufferData: any = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        bufferData[key] = value;
      }
    })
    setFilter({ ...bufferData });
    setSubmitForm(true)
  };
  // useEffect(() => {
  //   return () => {
  //     dispatch(deleteBalanceMerchantAction())
  //   }
  // }, [])

  const showModalControl1 = () => setShowModalControl(true);
  const handleGetListBalanceMerchant = (start?: number, limit?: number, sort?: {}) => {
    const payload: any = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListBalanceMerchant(payload: GetAllTransactionsInput) {
      dispatch(
        searchBalanceMerchantAction(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setTotalRow(res.totalRow);

          }
        })
      );
    }

    return {
      payload,
      getList: handleGetListBalanceMerchant,
      submitForm,
      setSubmitForm,
    };
  };

  return (
    <div className='box-content accountant-search-container'>

      <HeaderTransaction
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        showModalPayint={showModalControl1}
        onClickExport={() => { }}
        filter={filter}
        t={t}
      />

      <BoxSearchTransaction
        showFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        setSubmitForm={setSubmitForm}
        isLoading={isLoading}
      />

      <DataTableAccountBalance
        t={t}
        data={balanceMerchantList}
        totalFilter={totalRow}
        getDataList={handleGetListBalanceMerchant}
        setSubmitForm={setSubmitForm}
        isLoading={isLoading}

      />
      {/* {isLoading && <LoadingFullScreen />} */}
      {isLoadingExport && <LoadingFullScreen />}

    </div>
  );
};

export default SearchAccountBalance;
