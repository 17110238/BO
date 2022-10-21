import { getLogsInterface, logsDataInterface } from 'models/alertlogs/getLogs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAlertLogsAction } from 'redux/actions/alertLogsActions';
import alert from 'utils/helpers/alert';
import BoxSearchAlertLogs from './Boxsearch';
import AlertLogsDatatable from './Datatable';
import AlertLogsHeader from './Header';

const AlertLogs = () => {
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(true);
  const [filter, setFilter] = useState({});
  const [submitForm, setSubmitForm] = useState(false);
  const [alertData, setAlertData] = useState<logsDataInterface[] | any>();
  const [isLoad, setIsLoad] = useState<boolean>(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleGetAlertLogs = (start?: number, limit?: number) => {
    const payload: getLogsInterface = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function getAlertLogs(payload: getLogsInterface) {
      setIsLoad(true);
      dispatch(
        getAlertLogsAction(payload, (status, res) => {
          setIsLoad(false);
          setSubmitForm(false);
          if (status) {
            setAlertData(res.data);
          } else {
            res.message && alert('error', res.message);
            setAlertData([]);
          }
        })
      );
    }
    return {
      payload,
      getList: getAlertLogs,
      submitForm,
    };
  };

  const addFilter = (data: any) => {
    setFilter(data);
    setSubmitForm(true);
  };

  return (
    <div className='linkedbank-container'>
      <AlertLogsHeader showFilter={showFilter} toggleFilter={toggleFilter} />
      {showFilter && <BoxSearchAlertLogs handleFilter={addFilter} isLoading={isLoad} />}
      <AlertLogsDatatable
        handleGetAlertLogs={handleGetAlertLogs}
        alertData={alertData}
        isLoad={isLoad}
      />
    </div>
  );
};

export default AlertLogs;
