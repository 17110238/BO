import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSalaryAdvance } from 'redux/actions/salaryAdvance';
import BoxsearchSalaryAdvance from './BoxSearch';
import SalaryAdvanceListDatatable from './Datable';
import SalaryAdvanceListHeader from './Header';

const SalaryAdvanceListContainer = () => {
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState();
  const [salaryAdvanceData, setSalaryAdvanceData] = useState();

  const handleGetSalaryAdvance = (start?: number, limit?: number) => {
    const payload: any = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetSalaryAdvance(payload: any) {
      setIsLoading(true);
      dispatch(
        getSalaryAdvance(payload, (status, res) => {
          setIsLoading(false);
          setSalaryAdvanceData(res.data);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetSalaryAdvance,
      submitForm,
    };
  };

  const handleToggleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilter = (data: any) => {
    const _data = { ...data, isReimbursed: data.isReimbursed === 'isReimbursed' };
    data.isReimbursed === '' && delete _data.isReimbursed;
    setFilter(_data);
    setSubmitForm(true);
  };

  return (
    <div className='linkedbank-container'>
      <SalaryAdvanceListHeader isShowFilter={showFilter} isClickFilter={handleToggleShowFilter} />
      {showFilter && <BoxsearchSalaryAdvance handleFilter={handleFilter} isLoading={isLoading} />}
      <SalaryAdvanceListDatatable
        loading={isLoading}
        data={salaryAdvanceData}
        handleGetSalaryAdvance={handleGetSalaryAdvance}
      />
    </div>
  );
};

export default SalaryAdvanceListContainer;
