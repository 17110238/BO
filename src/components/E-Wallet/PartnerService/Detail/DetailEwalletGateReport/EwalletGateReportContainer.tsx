import { GateCardObject, GateTopUpObject, SearchSupplierTransactionInput } from 'models';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { filter } from 'rxjs';
import BoxSearchEwalletGateReport from './BoxSearchEwalletGateReport';
import DataTableEwalletGateReport from './DataTableEwalletGateReport';
import HeaderEwalletGateReport from './HeaderEwalletGateReport';
import { getListEWalletTransactionSupplier } from 'redux/actions';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';

interface Props {
  title?: string
}

const EwalletGateReportContainer: React.FC<Props> = ({
  title
}) => {


  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({})
  const [refreshTable, setRefreshTable] = useState<boolean>(false)
  const [dataEwallet, setDataEwallet] = useState<GateCardObject[] | GateTopUpObject[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitForm, setSubmitForm] = useState<boolean>(false);


  const dispatch = useDispatch();

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleSearchForm = (data: any) => {
    if (data?.state === 'ALL')
      delete data?.state
    setFilter(data)
    setSubmitForm(true)
  };

  const handleEwalletGateReport = (start?: number, limit?: number, sort?: {}) => {
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
    <>
      <div className='partner-service-container box-payment'>
        <HeaderEwalletGateReport
          showFilter={showFilter}
          toggleFilter={toggleFilter}
          title={title}
        />
        <BoxSearchEwalletGateReport
          handleSearchForm={handleSearchForm}
          title={title}
          filter={filter}
          submitForm={submitForm}
          setSubmitForm={setSubmitForm}
          showFilter={showFilter}
        />
        <DataTableEwalletGateReport
          data={dataEwallet}
          getDataList={handleEwalletGateReport}
          isLoading={isLoading}
          {...{ refreshTable }}
        />
      </div>
    </>
  )
}

export default EwalletGateReportContainer