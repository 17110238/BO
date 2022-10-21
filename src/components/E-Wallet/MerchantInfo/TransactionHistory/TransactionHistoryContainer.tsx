import React, { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'react-tagsinput/react-tagsinput.css';
import DataTableTransactionHistory from './DataTableTransactionHistory';
import BoxSearchTransactionHistory from './BoxSearchTransactionHistory';
import { getMerchantTransactionHistory } from 'redux/actions/merchantInfoActions';
import {
  EWalletTransactionBO,
  FilterEWalletTransactionInput,
  SearchEWalletTransactionInput,
} from 'models/merchantInfo/merchantInfoState';

interface Props {
  isShowFilter?: boolean;
  parentSubmit: boolean;
}

export interface SearchParams {
  publishedAt?: {
    from?: string;
    to?: string;
  };
  createdAt?: {
    from?: string;
    to?: string;
  };
  select?: {
    accountId?: number;
  };
}

const TransactionHistoryContainer: React.FC<Props> = ({ isShowFilter, parentSubmit }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterEWalletTransactionInput | any>({});
  const [transactionHistory, setTransactionHistory] = useState<EWalletTransactionBO[]>([]);
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer?.loadingTransactionHistory
  );
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);

  const handleGetMerchantTransactionHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload: SearchEWalletTransactionInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetMerchantTransactionHistory(payload: SearchEWalletTransactionInput) {
      setSubmitForm(false);
      if (payload.filter?.select?.accountId) {
        dispatch(
          getMerchantTransactionHistory(payload, (status, res) => {
            setTransactionHistory(res);
          })
        );
      } else {
        setTransactionHistory([]);
      }
    }

    return {
      payload,
      getList: handleGetMerchantTransactionHistory,
      submitForm,
    };
  };

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

    if (payload.createdAt && Object.keys(payload.createdAt).length > 0) {
      payload.publishedAt = payload.createdAt;
    }
    delete payload.createdAt;
    // if (payload.createdAt && Object.keys(payload.createdAt).length === 0) delete payload.createdAt;

    payload.select = {
      accountId: parseInt(accountId),
    };

    setFilter({ ...payload });
    setSubmitForm(true);
  };

  return (
    <div className='transaction-history-container'>
      <BoxSearchTransactionHistory
        showFilter={isShowFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        setSubmitForm={setSubmitForm}
        parentSubmit={parentSubmit}
      />
      <DataTableTransactionHistory
        t={t}
        data={transactionHistory}
        getDataList={handleGetMerchantTransactionHistory}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
};

export default TransactionHistoryContainer;
