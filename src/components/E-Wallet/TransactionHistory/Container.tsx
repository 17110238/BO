import useElementSize from 'hook/useElementSize';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BoxSearch, { SearchParams } from './BoxSearch';
import DataTable from './DataTable';
import Header from './Header';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { EWalletTransactionBO, SearchEWalletTransactionInput } from 'models';
import {
  getListEWalletTransaction,
  getServiceSearchTransaction,
} from 'redux/actions/eWalletTransactionHistoryActions';
import { getAppInfo } from 'redux/actions';
import dayjs from 'dayjs';
import _ from 'lodash';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Container: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [listTransactionHistory, setListTransactionHistory] = useState<EWalletTransactionBO[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const [squareRef, { width, height }] = useElementSize();
  const [applicationList, setApplicationList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<string[]>([]);

  const loadingExportTH = useSelector<any>(
    (state) => state?.eWalletTransactionReducer?.loadingExport
  );

  const handleSubmitSearch = (data: SearchParams) => {
    !data.code && delete data.code;
    !data.method && delete data.method;
    !data.state && delete data.state;
    delete data.timeType;
    delete data.search;
    delete data.typeId;
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetEWalletTransaction = (start?: number, limit?: number, sort?: {}) => {
    const payload: SearchEWalletTransactionInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetEWalletTransaction(payload: SearchEWalletTransactionInput) {
      setLoading(true);
      dispatch(
        getListEWalletTransaction(payload, (status, res) => {
          setSubmitForm(false);
          if (res) {
            setListTransactionHistory(res);
          } else {
            setListTransactionHistory([]);
          }
          setLoading(false);
        })
      );
    }
    return {
      payload,
      getList: handleGetEWalletTransaction,
      submitForm,
    };
  };

  useEffect(() => {
    dispatch(
      getAppInfo((status, response) => {
        if (status) {
          setApplicationList(response[0].store);
        }
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      getServiceSearchTransaction((status, response) => {
        if (response) {
          setServiceList(response);
        }
      })
    );
  }, []);

  return (
    <div className='box-content transaction-history-container'>
      <Header showFilter={showFilter} toggleFilter={toggleFilter} t={t} />
      {showFilter && (
        <BoxSearch
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
          applicationList={applicationList}
          serviceList={serviceList}
          filter={filter}
          isLoading={isLoading}
        />
      )}
      <DataTable
        t={t}
        data={listTransactionHistory}
        getDataList={handleGetEWalletTransaction}
        heightBoxSearch={height + 1}
        isLoading={isLoading}
      />
      {loadingExportTH && <LoadingFullScreen />}
    </div>
  );
};

export default Container;
