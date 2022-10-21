import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getEwalletServiceReportAction } from 'redux/actions/reportEwalletAction';
import ReportWalletServiceBoxSearch from './BoxSearch';
import ReportWalletServiceDatatable from './Datable';
import ReportWalletServiceHeader from './Header';
import _ from 'lodash';
import alert from 'utils/helpers/alert';

const ReportWalletServiceContainer = () => {
  const dispatch = useDispatch();

  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [data, setData] = useState();
  const [sumData, setSumData] = useState({});

  const handleGetEwalletServiceReport = (start?: number, limit?: number) => {
    const payload: any = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetEwalletServiceReport(payload: any) {
      setLoading(true);
      dispatch(
        getEwalletServiceReportAction(payload, (state, res) => {
          setLoading(false);
          setSubmitForm(false);
          if (state) {
            setData(res.data);
            setSumData(_.omit(res, ['data']));
          } else {
            alert('error', res.message);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetEwalletServiceReport,
      submitForm,
    };
  };

  const handleToggleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilter = (data: any) => {
    if (data && data.name) {
      setFilter({ ...data, appId: parseInt(data.appId) });
      setSubmitForm(true);
    }
  };

  return (
    <div className='linkedbank-container'>
      <ReportWalletServiceHeader isShowFilter={showFilter} isClickFilter={handleToggleShowFilter} />
      {showFilter && <ReportWalletServiceBoxSearch loading={loading} handleFilter={handleFilter} />}
      <ReportWalletServiceDatatable
        handleGetEwalletServiceReport={handleGetEwalletServiceReport}
        loading={loading}
        data={data}
        sumData={sumData}
      />
    </div>
  );
};

export default ReportWalletServiceContainer;
