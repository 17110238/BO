import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { FilterLoginHistory, InputLoginHistory, LoginHistoryTypes } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import { exportFileLoginHistory, getLoginHistory } from 'redux/actions/loginHistory';
import { updateURLParameter } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import LoginHistoryDatatable from './LoginHistoryDatatable';
import LoginHistoryHeader from './LoginHistoryHeader';

const queryGraphql: string = `subscription subExportLoginHistory {
SubExport{
  SubExportExcel{
      message
      succeeded
      type
      accountId
      url
      data
    }
  }
}`;
export default function LoginHistoryContainer() {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { t } = useTranslation('common');
  const { reset, control, handleSubmit, formState, register } = useForm<any>({});
  const [totalRow, setTotalRow] = useState<number>(0);
  const [listData, setListData] = useState<Array<LoginHistoryTypes>>([]);
  const [submitForm, setSubmitForm] = useState(false);
  const [filter, setFilter] = useState<FilterLoginHistory>({});
  const [loadingExport, setLoadingExport] = useState(false);
  const [socket, setSocket] = useState('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });
  const handleSearchLoginHistory = (data: any) => {
    if (data && Object.keys(data).length > 0) {
      const payload: InputLoginHistory = {
        filter: data,
        paging: {
          start: 0,
          limit: 21,
        },
        sort: {
          createdAt: 1,
        },
      };
      const temp = { ...data, from: data?.createdAt.from, to: data?.createdAt.to };
      delete temp?.createdAt;
      for (const key in temp) {
        if (temp[key]) {
          window.history.replaceState(
            '',
            '',
            updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
          );
        } else {
          const parseUrl = window.location.search.split('?')[1];
          const params = new URLSearchParams(parseUrl);
          params.delete(key);
          const URI = parseUrl
            ? `/cong-thanh-toan/lich-su-dang-nhap?${params.toString()}`
            : '/cong-thanh-toan/lich-su-dang-nhap';
          window.history.replaceState('', '', URI);
        }
      }
      dispatch(
        getLoginHistory(payload, (state, res) => {
          if (state) {
            setFilter(data);
            setListData(res);
          }
        })
      );
    }
  };
  const getDataList = (start?: number, limit?: number, sort?: {}) => {
    const payload: InputLoginHistory = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: 1,
      },
    };
    function handleGetLoginHistory(payload: InputLoginHistory) {
      dispatch(
        getLoginHistory(payload, (state, res) => {
          if (state) {
            setListData(res);
          }
        })
      );
    }
    return {
      payload,
      getList: handleGetLoginHistory,
      submitForm,
      setSubmitForm,
    };
  };
  const handleExportFile = () => {
    setLoadingExport(true);
    dispatch(exportFileLoginHistory({ filter }, (state, res) => {}));
    client?.unsubscribeAll();
    client?.request({ query: queryGraphql }).subscribe({
      next({ data }: any) {
        let urlData = data?.SubExport?.SubExportExcel?.data;
        client?.unsubscribeAll();
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            setLoadingExport(false);
            if (state) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              client?.unsubscribeAll();
              alert('success', 'Xuất file thành công', t);
            } else {
              client?.unsubscribeAll();
              alert('error', 'Xuất file thất bại', t);
            }
          })
        );
      },
    });
  };
  useEffect(() => {
    setSubmitForm(true);
  }, []);
  useEffect(() => {
    let initialState: any = {};
    if (query?.txtSearch) {
      initialState = { ...initialState, txtSearch: query?.txtSearch.toString() };
    }
    if (query?.typeSearch) {
      initialState = { ...initialState, typeSearch: query?.typeSearch.toString() };
    }
    if (query?.from) {
      initialState = {
        ...initialState,
        from: dayjs(query?.from.toString()).startOf('date').toISOString(),
      };
    }
    if (query?.to) {
      initialState = {
        ...initialState,
        to: dayjs(query?.to.toString()).endOf('date').toISOString(),
      };
    }
    if (Object.keys(initialState).length > 0) reset(initialState);
  }, [query]);
  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);
  return (
    <>
      {loadingExport && <LoadingFullScreen />}
      <div className='loginHistory-container'>
        <LoginHistoryHeader
          t={t}
          control={control}
          formState={formState}
          handleSubmit={handleSubmit}
          handleSearchLoginHistory={handleSearchLoginHistory}
          register={register}
          reset={reset}
          handleExportFile={handleExportFile}
        />
        <div className='loginHistory-content'>
          <LoginHistoryDatatable
            t={t}
            totalRow={totalRow}
            data={listData}
            getDataList={getDataList}
          />
        </div>
      </div>
    </>
  );
}
