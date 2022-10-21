import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import HeaderEwalletHistoryReport from './HeaderEwalletHistoryReport'
import BoxSearchEwalletHistoryReport from './BoxSearchEwalletHistoryReport'
import DataTableEwalletHistoryReport from './DataTableEwalletHistoryReport'
import { EWalletTransactionBO, SearchEWalletTransactionInput } from 'models';
import { getListEWalletTransaction } from 'redux/actions';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';


interface Props {
  title?: string
}

const EwalletHistoryReportContainer: React.FC<Props> = ({
  title,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({})
  const [refreshTable, setRefreshTable] = useState<boolean>(false)
  const [dataEwallet, setDataEwallet] = useState<EWalletTransactionBO[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const dispatch = useDispatch();

  const toggleFilter = () => setShowFilter(!showFilter);

  const formatDataSearch = (data: any) => {
    const dataCopy: any = { ...data };
    dataCopy.createdAt &&
      Object.keys(dataCopy?.createdAt).forEach(
        (key) => !dataCopy.createdAt[key] && delete dataCopy.createdAt[key]
      );

    Object.keys(dataCopy).forEach((key) => !dataCopy[key] && delete dataCopy[key]);

    return dataCopy;
  };

  const handleSearchForm = (data: any) => {
    const newData = formatDataSearch(data)
    setFilter(newData)
    setSubmitForm(true)
  }

  const handleHistoryReport = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter: { ...filter, code: title, state: "SUCCEEDED" },
      paging: {
        start: start!,
        limit: limit!,
      }
    };

    function getList(payload: SearchEWalletTransactionInput) {
      setIsLoading(true)
      dispatch(
        getListEWalletTransaction(payload, (state, res) => {
          
          if (state) {
            setDataEwallet(res?.data || []);
          }
          setRefreshTable(false);
          setIsLoading(false)
          setSubmitForm(false)
        })
      );
    }

    return {
      payload,
      getList,
      submitForm
    };
  };

  return (
    <>
      <div className='partner-service-container box-payment'>
        <HeaderEwalletHistoryReport
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          title={title}
        />
        <BoxSearchEwalletHistoryReport
          handleSearchForm={handleSearchForm}
          loading={isLoading}
          submitForm={submitForm}
          setSubmitForm={setSubmitForm}
          showFilter={showFilter}
        />
        <DataTableEwalletHistoryReport
          data={dataEwallet}
          getDataList={handleHistoryReport}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default EwalletHistoryReportContainer;
