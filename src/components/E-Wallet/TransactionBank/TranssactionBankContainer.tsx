import dayjs from 'dayjs';
import {
  EwalletTransactionBank,
  FilterListEwalletBankTransaction,
  PayloadListEwalletBankTransaction,
} from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  exportEwalletBankTransaction,
  exportFileTransaction,
  getListEwalletBankTransaction,
} from 'redux/actions';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchTransactionBank from './BoxSearchTranssactionBank';
import DataTableTransactionBank from './DatatableTranssactionBank';
import HeaderTranssactionBank from './HeaderTranssactionBank';
import { exportQuery } from './utils/queryExportTransaction';
import alert from 'utils/helpers/alert';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import FileSaver from 'file-saver';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import _ from 'lodash';
const TranssactionBankContainer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const initFilter: FilterListEwalletBankTransaction = {
    transactionType: 'TOPUP',
    createdAt: {
      from: dayjs().subtract(1, 'month').startOf('date').toISOString(),
      to: dayjs().endOf('date').toISOString(),
    },
  };

  const LoginId = useSelector<any>((state) => state?.authReducers?.accountInfo?.profile.accountId);

  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterListEwalletBankTransaction>({});
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [transList, setTransList] = useState<EwalletTransactionBank[]>([]);
  const handleSubmitSearch = (data: FilterListEwalletBankTransaction) => {
    setFilter(data);

    setSubmitForm(true);
  };

  const handleSearchSocialPay = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadListEwalletBankTransaction = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(payloadSearch: PayloadListEwalletBankTransaction) {
      setLoadingTable(true);
      dispatch(
        getListEwalletBankTransaction(payloadSearch, (state, res) => {
          setTransList(res?.data);
          setLoadingTable(false);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm: submitForm,
    };
  };

  const handleExportBankTransaction = () => {
    const client = new SubscriptionClient(
      `${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`,
      {
        reconnect: true,
        lazy: true,
        connectionCallback: (error, result) => {
          error && console.error(error);
        },
      }
    );

    const sub = client.request({ query: exportQuery });

    setLoadingExport(true);

    dispatch(exportEwalletBankTransaction({ filter }));

    sub.subscribe({
      next({ data }: any) {
        const { succeeded, message, data: dataExport, accountId } = data?.SubExport?.SubExportExcel;
        setLoadingExport(false);
        if (!succeeded) {
          alert('error', message, t);
          return;
        }
        dispatch(
          handleDowloadSaga({ data: `${dataExport}` }, async (state, res) => {
            if (!state) {
              alert('error', res?.message, t);
              return;
            }
            if (accountId !== LoginId) return;
            await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
            client?.unsubscribeAll();
          })
        );
      },
    });
  };

  useEffect(() => {
    const params = _.merge(initFilter, router.query);
    // if (Object.keys(router.query).length) return;

    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      createdAt: {
        from: (router.query?.from as string) ?? initFilter.createdAt?.from,
        to: (router.query?.to as string) ?? initFilter.createdAt?.to,
      },
    });

    setFilter(payload);
    setSubmitForm(true);
  }, []);

  return (
    <>
      <div className='approval-merchant-container ewallet-bank-transaction'>
        <HeaderTranssactionBank
          isShowFilter={isShowFilter}
          onClickExport={handleExportBankTransaction}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment '>
          {isShowFilter && (
            <BoxSearchTransactionBank
              loading={loadingTable}
              handleSubmitSearch={handleSubmitSearch}
            />
          )}
          <DataTableTransactionBank
            data={transList}
            getDataList={handleSearchSocialPay}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
      {loadingExport && <LoadingFullScreen />}
    </>
  );
};

export default TranssactionBankContainer;
