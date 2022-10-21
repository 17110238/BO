import React, { useEffect, useState, useRef } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'react-tagsinput/react-tagsinput.css';
import HeaderWalletHistory from './Header';
import BoxSearchWalletHistory from './BoxSearch';
import DataTableWalletHistory from './DataTable';
import { appHistoryData, appHistoryInput } from 'models/walletHistory/walletHistoryState';
import { getWalletHistory } from 'redux/actions/walletHistoryActions';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export interface SearchParams {
  txtSearch?: string;
  typeSearch?: string;
  change?: string;
  appId?: number;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface appTypes {
  name: string;
  id: number | string;
}

function WalletHistoryContainer() {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [filter, setFilter] = useState({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const [walletHistory, setWalletHistory] = useState<appHistoryData[]>([]);
  const router = useRouter();

  const handleGetWalletHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload: appHistoryInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetWalletHistory(payload: appHistoryInput) {
      dispatch(
        getWalletHistory(payload, (status, res) => {
          setWalletHistory(res.data);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetWalletHistory,
      submitForm,
    };
  };

  const getPayloadFromURL = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const payload: any = {};
    payload.createdAt = {};
    searchParams.forEach((value, key) => {
      if (key === 'from') {
        payload.createdAt.from = value;
      } else if (key === 'to') {
        payload.createdAt.to = value;
      } else {
        payload[key] = value;
      }
    });

    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    return payload;
  };

  useEffect(() => {
    const payload = getPayloadFromURL();
    if (Object.keys(payload).length !== 0) {
      handleSubmitSearch && handleSubmitSearch(payload);
    }
  }, []);

  const updateURLParams = (filter: any) => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams();
    for (const key in filter) {
      if (filter[key]) {
        if (key === 'createdAt') {
          if (filter.createdAt?.from) searchParams.set('from', filter.createdAt?.from);
          if (filter.createdAt?.to) searchParams.set('to', filter.createdAt?.to);
        } else {
          searchParams.set(key, filter[key]);
        }
      } else {
        searchParams.delete(key);
      }
    }
    if (!filter.txtSearch) searchParams.delete('typeSearch');
    if (searchParams.toString())
      router.replace(path + '?' + searchParams.toString(), undefined, { shallow: true });
    else router.replace(path, undefined, { shallow: true });
  };

  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {
    const payload: any = { ...data };
    payload.createdAt &&
      Object.keys(payload?.createdAt).forEach(
        (key) => !payload.createdAt[key] && delete payload.createdAt[key]
      );

    Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    updateURLParams(payload);
    setFilter({ ...payload });
    setSubmitForm(true);
  };

  return (
    <div className='e-wallet-history-container'>
      <HeaderWalletHistory showFilter={showFilter} toggleFilter={toggleFilter} t={t} />
      <BoxSearchWalletHistory
        showFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        setSubmitForm={setSubmitForm}
        getPayloadFromURL={getPayloadFromURL}
      />
      <DataTableWalletHistory
        t={t}
        data={walletHistory}
        getDataList={handleGetWalletHistory}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
}

export default WalletHistoryContainer;
