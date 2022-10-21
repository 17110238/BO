import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  exportFileMismatchTransactionsFailure,
  getMismatchTransactions,
} from 'redux/actions/transferActions';
import { SubmitHandler } from 'react-hook-form';
import { MismatchTransaction, SearchMismatchTransactionInput } from 'models/transfer';
import dayjs from 'dayjs';
import Header from './Header';
import BoxSearch from './BoxSearch';
import DataTable from './DataTable';
import { useRouter } from 'next/router';
import Loading from 'components/common/Loading/LoadingFullScreen';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export interface SearchParams {
  merchantId?: number;
  createdAt?: {
    from?: string;
    to?: string;
  };
  supplierTransaction?: string;
  paymentId?: string;
  amount?: number;
  description?: string;
  supplierState?: string;
  paymentState?: string;
}

const TransferManageContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const router = useRouter();
  const [mismatchTransactions, setMismatchTransactions] = useState<MismatchTransaction[]>([]);
  const loadingExport = useSelector<any>((state) => state?.transferReducer?.loadingExport);

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
    if (searchParams.toString())
      router.replace(path + '?' + searchParams.toString(), undefined, { shallow: true });
    else router.replace(path, undefined, { shallow: true });
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
      } else if (key === 'merchantId') {
        payload.merchantId = Number(value);
      } else if (!key) {
        delete payload.paymentId;
      } else {
        payload[key] = value;
      }
    });
    if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;
    return payload;
  };
  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {
    const payload: any = { ...data };

    if (data?.amount) {
      payload.amount = Number(data.amount);
    }

    if (data?.merchantId) {
      payload.merchantId = Number(data.merchantId);
    }

    Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);
    setFilter({ ...payload });
    updateURLParams(payload);
    setSubmitForm(true);
  };
  const handleGetMismatchOrderTransList = (start?: number, limit?: number, sort?: {}) => {
    const payload: SearchMismatchTransactionInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetMismatchOrderTransList(payload: SearchMismatchTransactionInput) {
      dispatch(
        getMismatchTransactions(payload, (status, res) => {
          setSubmitForm(false);
          setMismatchTransactions(res);
        })
      );
    }

    return {
      payload,
      getList: handleGetMismatchOrderTransList,
      submitForm,
    };
  };

  const convertState = (_state: string) => {
    const state = _state?.toLowerCase();
    switch (state) {
      case 'pending':
        return 'Đang xử lý';
      case 'success':
      case 'succeeded':
        return 'Thành công';
      case 'canceled':
        return 'Hủy';
      case 'failed':
        return 'Thất bại';

      default:
        return state ? state.charAt(0).toUpperCase() + state?.slice(1) : state;
    }
  };

  useEffect(() => {
    if (loadingExport) {
      dispatch(exportFileMismatchTransactionsFailure());
    }
  }, []);

  useEffect(() => {
    if (submitForm) {
      if (Object.keys(router.query)?.length !== 0) {
        const payload = getPayloadFromURL();

        setFilter(payload);
      } else {
        const defaultValues = {
          createdAt: {
            from: dayjs().subtract(30, 'day').toISOString(),
            to: dayjs().endOf('date').toISOString(),
          },
        };
        setFilter(defaultValues);
      }
      setSubmitForm(true);
    }
  }, []);

  return (
    <div className='transfer-manage-container'>
      <Header showFilter={showFilter} toggleFilter={toggleFilter} t={t} />
      <BoxSearch
        convertState={convertState}
        filter={filter}
        showFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        getPayloadFromURL={getPayloadFromURL}
        setSubmitForm={setSubmitForm}
      />
      <DataTable
        t={t}
        data={mismatchTransactions}
        getDataList={handleGetMismatchOrderTransList}
        setSubmitForm={setSubmitForm}
        convertState={convertState}
      />
      {loadingExport && <Loading />}
    </div>
  );
};

export default TransferManageContainer;
