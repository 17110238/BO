import React, { useEffect, useState } from 'react';
import DatatableStoreManage from './DatatableStoreManage';
import { useTranslation } from 'react-i18next';
import HeaderManageStore from './HeaderManageStore';
import BoxSearchStoreManage from './BoxSearchStoreManage';
import { useDispatch } from 'react-redux';
import { getListStore } from 'redux/actions';
import { SearchStoreInput, StoreMerchant } from 'models';
import { useRouter } from 'next/router';

export default function StoreManageContainer(): JSX.Element {
  const { t } = useTranslation('common');
  const [isShowFilter, setShowFilter] = useState<boolean>(true);
  const [isShowFilterAdvanced, setShowFilterAdvanced] = useState<boolean>(false);
  const [listStore, setListStore] = useState<Array<StoreMerchant>>([]);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [filter, setFilter] = useState<any>({});
  const [loadingSearch, setLoadingSearch] = useState(false);

  const dispatch = useDispatch();
  const { query }: any = useRouter();
  const handleGetListStore = (payload: SearchStoreInput) => {
    setLoadingSearch(true);
    dispatch(
      getListStore(payload, (state, res) => {
        if (state) {
          setListStore(res.data);
          setTotalRow(res.totalRow);
        }
        setLoadingSearch(false);
      })
    );
  };
  const handleSearchStore = (start?: number, limit?: number, sort?: {}) => {
    const payload: SearchStoreInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: 1,
      },
    };
    function getListStores(payload: SearchStoreInput) {
      dispatch(
        getListStore(payload, (state, res) => {
          if (state) {
            setListStore(res.data);
            setTotalRow(res.totalRow);
          }
        })
      );
    }
    return {
      payload,
      getList: getListStores,
      submitForm,
      setSubmitForm,
    };
  };

  useEffect(() => {
    if (Object.keys(query)?.length > 0) {
      let payload: SearchStoreInput = {
        filter: {},
        paging: {
          start: 0,
          limit: 20,
        },
        sort: {
          createdAt: 1,
        },
      };
      if (query?.search)
        payload = { ...payload, filter: { ...payload.filter, search: query.search } };
      if (query?.merchantId)
        payload = {
          ...payload,
          filter: { ...payload.filter, merchantId: parseInt(query.merchantId) },
        };
      if (query?.from && !query?.to)
        payload = {
          ...payload,
          filter: { ...payload.filter, createdAt: { from: query.from } },
        };
      if (!query?.from && query?.to)
        payload = {
          ...payload,
          filter: { ...payload.filter, createdAt: { to: query.to } },
        };
      if (query?.from && query?.to)
        payload = {
          ...payload,
          filter: { ...payload.filter, createdAt: { from: query.from, to: query.to } },
        };
      setFilter(payload.filter);
    }
  }, [query?.search, query?.merchantId, query?.from, query?.to]);

  useEffect(() => {
    setSubmitForm(true);
  }, []);

  return (
    <div className='storeManage-content'>
      <HeaderManageStore
        isShowFilter={isShowFilter}
        isClickFilter={() => {
          setShowFilter(!isShowFilter);
          setShowFilterAdvanced(false);
        }}
      />
      {isShowFilter && (
        <BoxSearchStoreManage
          isShowFilterAdvanced={isShowFilterAdvanced}
          setShowFilterAdvanced={(e) => {
            e.preventDefault();
            setShowFilterAdvanced(!isShowFilterAdvanced);
          }}
          onAfter={handleGetListStore}
          loadingSearch={loadingSearch}
        />
      )}
      <DatatableStoreManage
        t={t}
        data={listStore}
        getDataList={handleSearchStore}
        totalRow={totalRow}
        onAfter={handleSearchStore}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
}
