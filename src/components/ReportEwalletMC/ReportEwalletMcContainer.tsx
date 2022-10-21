import React, { useEffect, useState } from 'react';
import BoxSearchReportEwalletMc from './BoxSearchReportEwalletMc';
import HeaderReportEwalletMc from './HeaderReportEwalletMc';
import DatableReportEwalletMc from './DataTableReportEwalletMc';
import { useDispatch, useSelector } from 'react-redux';
import { ReportMerchantEwalletInput, ReportMerchantEwalletResponsed } from 'models';
import dayjs from 'dayjs';
import { getReportEwalletMC } from 'redux/actions/reportEwalletMcAction';

interface Props { }

const ReportEwalletMcContainer: React.FC<Props> = ({ }) => {
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const[pageLoading, setPageLoading] = useState<boolean>(false)
  const [filter, setFilter] = useState<ReportMerchantEwalletInput>({
    createdAt: {
      from: dayjs().subtract(30, 'day').toISOString(),
      to: dayjs().endOf('date').toISOString(),
    },
  });
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [reportEwalletMc, setReportEwalletMc] = useState<any>([]);
  const [reportEwalletMcTotal, setReportEwalletMcTotal] = useState<any>({});

  const dispatch = useDispatch();

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleSearch = (data: ReportMerchantEwalletInput) => {
    setFilter(data);
    setSubmitForm(true);
  };

  const handleReportEwalletMC = (start?: number, limit?: number, sort?: {}) => {
    const payload: any = {
      merchantId: +filter?.merchantId!,
      createdAt: filter?.createdAt,
    };

    if(!payload?.merchantId){
      delete payload?.merchantId
    }    

    function getList(payload: ReportMerchantEwalletInput) {
      setIsLoading(true);
      setPageLoading(true)
      dispatch(
        getReportEwalletMC(payload, (state, res) => {
          if (state) {
            setReportEwalletMc(res?.data);
            setReportEwalletMcTotal(res?.total);
          }
          setSubmitForm(false);
          setIsLoading(false);
          setPageLoading(false)
        })
      );
    }

    return {
      payload,
      getList,
      submitForm,
    };
  };

  return (
    <>
      <div className='report-ewallet-mc-container box-payment'>
        <HeaderReportEwalletMc showFilter={showFilter} toggleFilter={toggleFilter} />
        <BoxSearchReportEwalletMc
          loading={isLoading}
          handleSearch={handleSearch}
          setSubmitForm={setSubmitForm}
          showFilter={showFilter}
          filter={filter}
        />
        <DatableReportEwalletMc
          data={reportEwalletMc}
          sumData={reportEwalletMcTotal}
          getDataList={handleReportEwalletMC}
          pageLoading={pageLoading}
        />
      </div>
    </>
  );
};

export default ReportEwalletMcContainer;
