import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getEwalletReportAction } from 'redux/actions';
import alert from 'utils/helpers/alert';
import BoxSearchEwalletReport from './Boxsearch';
import DataTableEwalletReport from './Datatable';
import EwalletReportHeader from './Header';

const AccountWalletReportContainer = () => {
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(true);
  const [filter, setFilter] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [checkSumData, setCheckSumData] = useState({});

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getEwalletReportAction({ filter }, (status, data) => {
        setIsLoading(false);
        if (status) {
          setCheckSumData(data);
        } else {
          alert('error', data.message);
        }
      })
    );
  }, [filter]);

  const handleFilter = (data: any) => {
    setFilter(data);
  };

  return (
    <div className='linkedbank-container'>
      <EwalletReportHeader
        showFilter={showFilter}
        toggleFilter={() => setShowFilter(!showFilter)}
      />
      {showFilter && <BoxSearchEwalletReport handleFilter={handleFilter} isLoading={isLoading} />}
      <DataTableEwalletReport data={checkSumData} isLoad={isLoading} />
    </div>
  );
};

export default AccountWalletReportContainer;
