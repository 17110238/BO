import useElementSize from 'hook/useElementSize';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BoxSearch, { SearchParams } from './BoxSearch';
import DataTable from './DataTable';
import Header from './Header';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { DataReportUser, ReportUserInput } from 'models';
import _ from 'lodash';
import { getListEwalletReportUser } from 'redux/actions';

const Container: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [listReportUser, setListReportUser] = useState<DataReportUser[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const loadingExportFile = useSelector<any, boolean>(
    (state) => state?.eWalletReportReducer?.loadingExport
  );
  const [filter, setFilter] = useState({});
  const [squareRef, { width, height }] = useElementSize();
  const handleSubmitSearch = (data: SearchParams) => {
    let newDataFilter: any = {
      fullname: data.fullname,
      appId: data.appId,
      kycState: data.kycState,
      gender: data.gender,
      age: {
        from: data.from ? +data.from : '',
        to: data.to ? +data.to : '',
      },
    };

    if (!data.from && !data.to) {
      delete newDataFilter.age;
    }

    for (let key in newDataFilter) {
      if (newDataFilter.hasOwnProperty(key)) {
        if (newDataFilter[key] === '' || newDataFilter[key] === undefined) {
          delete newDataFilter[key];
        }
      }
    }
    setFilter({ ...newDataFilter });
    setSubmitForm(true);
  };

  const handleGetReportUser = (start?: number, limit?: number, sort?: {}) => {
    const payload: ReportUserInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetReportUser(payload: ReportUserInput) {
      setLoading(true);
      dispatch(
        getListEwalletReportUser(payload, (status, res) => {
          setSubmitForm(false);
          if (res) {
            setListReportUser(res);
          } else {
            setListReportUser([]);
          }
          setLoading(false);
        })
      );
    }
    return {
      payload,
      getList: handleGetReportUser,
      submitForm,
    };
  };

  return (
    <div className='box-content report-container'>
      <Header showFilter={showFilter} toggleFilter={toggleFilter} t={t} />
      {showFilter && (
        <BoxSearch
          t={t}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          boxSearchRef={squareRef}
          filter={filter}
          isLoading={isLoading}
        />
      )}
      <DataTable
        t={t}
        isLoading={isLoading}
        data={listReportUser}
        getDataList={handleGetReportUser}
        heightBoxSearch={height + 1}
        submitForm={submitForm}
        filter={filter}
      />
      {loadingExportFile && <LoadingFullScreen />}
    </div>
  );
};

export default Container;
