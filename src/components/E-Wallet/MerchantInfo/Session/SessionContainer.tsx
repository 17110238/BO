import React, { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'react-tagsinput/react-tagsinput.css';
import DataTableSession from './DataTableSession';
import BoxSearchSession from './BoxSearchSession';
import {
  EwalletSessionType,
  FilterEwalletAccountInput,
  SearchEwalletAccountInput,
} from 'models/merchantInfo/merchantInfoState';
import { getMerchantSessions } from 'redux/actions/merchantInfoActions';

interface Props {
  isShowFilter?: boolean;
  parentSubmit: boolean;
}

export interface FilterSearchParams {
  id?: number[];
  state?: string[];
  accountType?: string;
  searchValue: string;
  searchType: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface SearchParams {
  filter?: FilterSearchParams;
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

const SessionContainer: React.FC<Props> = ({ isShowFilter, parentSubmit }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterEwalletAccountInput>({});
  const [sessions, setSessions] = useState<EwalletSessionType[]>([]);
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loadingSession);
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);

  const handleGetMerchantSessions = (start?: number, limit?: number, sort?: {}) => {
    const payload: SearchEwalletAccountInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetMerchantSessions(payload: SearchEwalletAccountInput) {
      if (payload.filter.searchValue) {
        dispatch(
          getMerchantSessions(payload, (status, res) => {
            setSessions(res);
          })
        );
      } else {
        setSessions([]);
      }
      setSubmitForm(false);
    }

    return {
      payload,
      getList: handleGetMerchantSessions,
      submitForm,
      setSubmitForm,
    };
  };

  useEffect(() => {
    setSubmitForm(true);
  }, [accountId]);

  useEffect(() => {
    if (parentSubmit) {
      setSubmitForm(true);
    }
  }, [parentSubmit]);

  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {
    const payload: any = { ...data };
    payload.createdAt &&
      Object.keys(payload?.createdAt).forEach(
        (key) => !payload.createdAt[key] && delete payload.createdAt[key]
      );

    Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    payload.searchType = 'ACCOUNT_ID';
    payload.searchValue = accountId;

    setFilter({ ...payload });
    setSubmitForm(true);
  };

  return (
    <div className='session-container'>
      <BoxSearchSession
        showFilter={isShowFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        setSubmitForm={setSubmitForm}
        parentSubmit={parentSubmit}
      />
      <DataTableSession
        t={t}
        data={sessions}
        getDataList={handleGetMerchantSessions}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
};

export default SessionContainer;
