import React, { useState, useEffect } from 'react'
import HeaderEwalletServiceBillReport from './HeaderEwalletServiceBillReport'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next';
import BoxSearchEwalletServiceBillReport from './BoxSearchEwalletServiceBillReport';
import DataTableEwalletServiceBillReport from './DataTableEwalletServiceBillReport';
import { getListEWalletTransactionSupplier } from 'redux/actions';
import { EstioBillObject, OCBBillObject, SearchSupplierTransactionInput } from 'models';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';

interface Props {
  title?: string,

}

const EwalletServiceBillReportContainer: React.FC<Props> = ({
  title,
}) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({})
  const [refreshTable, setRefreshTable] = useState<boolean>(false)
  const [dataEwallet, setDataEwallet] = useState<OCBBillObject[] | EstioBillObject[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const dispatch = useDispatch();

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleSearchForm = (data: any) => {
    if (data?.state === 'ALL') {
      delete data?.state
    }
    setFilter({...data})
    setSubmitForm(true)
  };

  // useEffect(() => {
  //   showFilter && setSubmitForm(true)
  // }, [])

  const handleEwalletServiceBillReport = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter: { ...filter, service: title },
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: -1,
      },
    };

    function getList(payload: SearchSupplierTransactionInput) {
      setIsLoading(true)
      dispatch(
        getListEWalletTransactionSupplier(payload, (state, res) => {
          if (state) {
            setDataEwallet(res || []);
            setRefreshTable(false);
            setSubmitForm(false)
          }
          setIsLoading(false)
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
    <div className='partner-service-container box-payment'>
      <HeaderEwalletServiceBillReport
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        title={title}
      />
      <BoxSearchEwalletServiceBillReport
        handleSearchForm={handleSearchForm}
        title={title}
        filter={filter}
        loading={isLoading}
        submitForm={submitForm}
        setSubmitForm={setSubmitForm}
        showFilter={showFilter}
      />
      <DataTableEwalletServiceBillReport
        data={dataEwallet}
        getDataList={handleEwalletServiceBillReport}
        setSubmitForm={setSubmitForm}
        {...{ refreshTable }}
        isLoading={isLoading}
      />
    </div>
  )
}

export default EwalletServiceBillReportContainer