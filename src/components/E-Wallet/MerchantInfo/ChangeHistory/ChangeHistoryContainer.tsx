import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'react-tagsinput/react-tagsinput.css';
import DataTableChangeHistory from './DataTableChangeHistory';
import { getMerchantChangeHistory } from 'redux/actions/merchantInfoActions';
import { GetAccountMerchantLogInput, LogsType } from 'models/merchantInfo/merchantInfoState';

export interface SearchParams {
  search?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

interface Props {
  parentSubmit: boolean;
}

function ChangeHistoryContainer({ parentSubmit }: Props) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [changeHistory, setChangeHistory] = useState<LogsType[]>([]);
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loadingChangeHistory);
  const accountId = useSelector<any, string>(
    (state) => state?.merchantInfoReducer.accountId
  );

  const handleGetMerchantChangeHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetAccountMerchantLogInput = {
      search: accountId,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetMerchantChangeHistory(payload: GetAccountMerchantLogInput) {
      if (accountId) {
        dispatch(
          getMerchantChangeHistory(payload, (status, res) => {
            setChangeHistory(res);
          })
        );
      } else {
        setChangeHistory([]);
      }
    }

    return {
      payload,
      getList: handleGetMerchantChangeHistory,
      submitForm,
      setSubmitForm,
    };
  };

  useEffect(() => {
    if (parentSubmit) {
      setSubmitForm(true);
    }
  }, [parentSubmit]);

  return (
    <div className='change-history-container'>
      <DataTableChangeHistory
        t={t}
        data={changeHistory}
        getDataList={handleGetMerchantChangeHistory}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
}

export default ChangeHistoryContainer;
