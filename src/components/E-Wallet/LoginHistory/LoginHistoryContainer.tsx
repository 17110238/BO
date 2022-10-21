import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAppInfo, getListSearchLoginHistory } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchLoginHistory from './BoxSearchLoginHistory';
import DataTableLoginHistory from './DataTableLoginHistory';
import HeaderLoginHistory from './HeaderLoginHistory';

interface SearchSessionsInput {
  txtSearch?: string | undefined;
  searchType?: string | undefined;
  appId?: number | any;
  createdAt?:
    | {
        from?: any;
        to?: any;
      }
    | any;
}

const LoginHistoryContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [dataLoginHistory, setDataLoginHistory] = useState<any>([]);
  const [dataApplication, setDataApplication] = useState<any>([]);
  const boxSearchRef = useRef();
  const [filter, setFilter] = useState({});
  const loading = useSelector<any | boolean>((state) => state?.eWalletHistoryLoginReducer?.loading);
  const router =useRouter()
  
  useEffect(()=>{
    setSubmitForm(true)
  },[])

  const handleSubmitSearch = (data: SearchSessionsInput) => {
    !data?.txtSearch && delete data?.txtSearch;
    !data?.appId && delete data?.appId;
    if (data?.appId) {
      data.appId = +data.appId;
    }
    !data?.searchType && delete data?.searchType;
    if (!data?.createdAt?.from && !data?.createdAt?.to) {
      delete data?.createdAt;
    }
    data?.createdAt && Object.keys(data?.createdAt).length === 0 && delete data?.createdAt;
    if (data?.searchType && !data?.txtSearch) return;
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetListLoginHistory = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListLoginHistory(payload: any) {
      dispatch(
        getListSearchLoginHistory(payload, (status, res) => {
          if (status) {
            setDataLoginHistory(res);
            setTotalRow(res?.length);
            setSubmitForm(false);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetListLoginHistory,
      submitForm,
      setSubmitForm,
    };
  };

  useEffect(() => {
    dispatch(
      getAppInfo((status, response) => {
        if (status) {
          const { store } = response[0];
          let optionDataApplication = [
            ...store?.map((el: any) => ({ value: el.id, label: el.name })),
          ];
          setDataApplication(optionDataApplication);
        }
      })
    );
  }, []);

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (router.query?.appId && Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        appId: +router.query?.appId!,
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      });
      setFilter(payload);
      setSubmitForm(true);
    }
  }, []);

  return (
    <div className='box-content login-history-container'>
      <HeaderLoginHistory showFilter={showFilter} toggleFilter={toggleFilter} />
      {showFilter && (
        <BoxSearchLoginHistory
          loading={loading}
          optionsApplication={dataApplication}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          boxSearchRef={boxSearchRef}
          setSubmitForm={setSubmitForm}
        />
      )}
      <DataTableLoginHistory
        t={t}
        data={dataLoginHistory}
        totalFilter={totalRow}
        getDataList={handleGetListLoginHistory}
        setSubmitForm={setSubmitForm}
        isNotHaveTotalRow={true}
      />
    </div>
  );
};
export default LoginHistoryContainer;
