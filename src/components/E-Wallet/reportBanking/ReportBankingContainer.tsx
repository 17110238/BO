import { EwalletTransactionReportData, FilterEwalletReportTransactionBankInput } from 'models';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListEwalletBankTransactionReport } from 'redux/actions';
import BoxSearchReportBanking, { SearchParams } from './BoxSearchReportBanking';
import DataTableReportBanking, { TotalReportProps } from './DataTableReportBanking';
import HeaderReportBanking from './HeaderReportBanking';

export default function ReportBankingContainer() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [data, setData] = useState<EwalletTransactionReportData[]>([]);
  const [totalReport, setTotalReport] = useState<TotalReportProps>({
    totalDeposit: 0,
    totalCountDeposit: 0,
    totalWithdraw: 0,
    totalCountWithdraw: 0,
  })

  const handleSubmitSearch = (data: SearchParams) => {
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetListTransactionBankReport = (start?: number, limit?: number, sort?: {}) => {
    const payload: FilterEwalletReportTransactionBankInput = {
      filter,
    };

    function getList(payload: FilterEwalletReportTransactionBankInput) {
      setLoading(true);
      dispatch(
        getListEwalletBankTransactionReport(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setData(res.data);
            setTotalReport({
              ...totalReport,
              totalDeposit: res.totalDeposit,
              totalCountDeposit: res.totalCountDeposit,
              totalWithdraw: res.totalWithdraw,
              totalCountWithdraw: res.totalCountWithdraw,
            })
          }
          setLoading(false);
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
    <div className='telcoManage-container box-content transaction-container'>
      <HeaderReportBanking />
      <BoxSearchReportBanking
        handleSubmitSearch={handleSubmitSearch}
      />
      <DataTableReportBanking
        isLoading={isLoading}
        data={data}
        totalReport={totalReport}
        getList={handleGetListTransactionBankReport}
      />
    </div>
  );
}
