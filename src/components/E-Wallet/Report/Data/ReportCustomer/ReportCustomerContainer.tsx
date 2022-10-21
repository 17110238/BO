import React, { useEffect, useState } from 'react';
import BoxSearchReportCustomer from './BoxSearchReportCustomer';
import DataTableReportCustomer from './DataTableReportCustomer';
import HeaderReportCustomer from './HeaderReportCustomer';
import { useTranslation } from 'react-i18next';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { useDispatch, useSelector} from 'react-redux'
import { getReportCustomer } from 'redux/actions';
import { DataReportCustomer, ReportCustomerResponsed } from 'models/eWalletReportService';
import _ from 'lodash'

interface Props {
  showFilter? : boolean
}

const ReportCustomerContainer: React.FC<Props> = ({
  showFilter
}) => {
  const { t } = useTranslation('common');
  const [filter, setFilter] = useState<any>({});
  const dispatch = useDispatch()
  const stringifyFilter = JSON.stringify(filter);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dataReportCustomer, setDataReportCustomer] = useState<ReportCustomerResponsed>({})

  const handleSubmitSearch = (data: any) => {
    setFilter({ ...data });
  };

  useEffect(() => {
    const handleGetListReportCustomer = () => {
      setLoading(true);
      dispatch(
        getReportCustomer({ filter }, (status, res) => {
          if (status) {
            setDataReportCustomer(res || {})
          }
          setLoading(false);
        })
      )
    }
    if (!_.isEmpty(filter)) {
      handleGetListReportCustomer();
    }
  }, [filter]);  

  return (
    <>
      <div className='box-payment box-payment-report-customer'>
        <BoxSearchReportCustomer 
          handleSubmitSearch={handleSubmitSearch} 
          loading={isLoading}
          showFilter={showFilter}
        />
        <DataTableReportCustomer
          data={dataReportCustomer}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default ReportCustomerContainer;
