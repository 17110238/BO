import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getReportSalaryAdvance } from 'redux/actions/salaryAdvance';
import BoxsearchSalaryAdvance from './BoxSearch';
import SalaryAdvanceReportDatatable from './Datable';
import SalaryAdvanceReportHeader from './Header';

const SalaryAdvanceReportContainer = () => {
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState();
  const [reportData, setReportData] = useState();
  const [submitForm, setSubmitForm] = useState(false);

  const handleGetReportSalaryAdvance = (start?: number, limit?: number) => {
    const payload: any = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetReportSalaryAdvance(payload: any) {
      setIsLoading(true);
      dispatch(
        getReportSalaryAdvance(payload, (status, res) => {
          setReportData(res.data);
          setIsLoading(false);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetReportSalaryAdvance,
      submitForm,
    };
  };

  const handleToggleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilter = (data: any) => {
    setFilter(data);
    setSubmitForm(true);
  };

  return (
    <div className='linkedbank-container'>
      <SalaryAdvanceReportHeader isShowFilter={showFilter} isClickFilter={handleToggleShowFilter} />
      {showFilter && <BoxsearchSalaryAdvance handleFilter={handleFilter} isLoading={isLoading} />}
      <SalaryAdvanceReportDatatable
        loading={isLoading}
        data={reportData}
        handleGetReportSalaryAdvance={handleGetReportSalaryAdvance}
      />
    </div>
  );
};

export default SalaryAdvanceReportContainer;
