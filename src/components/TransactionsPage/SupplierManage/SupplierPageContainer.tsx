import LoadingInline from 'components/common/Loading/LoadingInline';
import useElementSize from 'hook/useElementSize';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailSupplierManage, getListSupplierManage } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchSupplier from './BoxSearchSupplier';
import DataTableSupplier from './DataTableSupplier';
import HeaderSupplier from './HeaderSupplier';
interface Payload {
  filter: {
    method?: string | null;
    state?: string | null;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort: {
    createdAt: number;
  };
}
interface supplierDetailProps {
  id: number;
}
const SupplierPageContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [squareRef, { height }] = useElementSize();
  const [listDetailSupplier, setListDetailSupplier] = useState([]);
  const loading = useSelector<boolean>((state: any) => state.supplierManageReducers.loading);
  const [filter, setFilter] = useState<any>({});
  const filterPayload = useSelector<any>((state) => state.supplierManageReducers.filter);
  const router = useRouter();

  const handleClearDetailManage = () => {
    setListDetailSupplier([]);
  };

  const handleSubmitSearch = (data: any) => {
    const { supplierId, method, state, merchantId, searchText, searchType } = data;
    if (method === '') {
      delete data.method;
    }
    if (state === '') {
      delete data.state;
    }
    if (merchantId) {
      data.merchantId = +data.merchantId;
    }
    if (!merchantId || merchantId === '') {
      delete data.merchantId;
    }
    if (searchText === '' || !searchText) {
      delete data.searchText;
      delete data.searchType;
    }
    if (searchText) data.searchText = data.searchText.trim();
    if (searchType === '') {
      delete data.searchType;
    }
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetDetailSupperlier = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetDetailSupperlier(payload: any) {
      setSubmitForm(false);
      if (payload?.filter?.supplierId) {
        dispatch(
          getDetailSupplierManage(payload, (status, res) => {
            if (status) {
              setListDetailSupplier(res);
              setTotalRow(res.length);
            } else {
              setListDetailSupplier(res);
              setTotalRow(res.length);
            }
          })
        );
      }
    }

    return {
      payload,
      getList: handleGetDetailSupperlier,
      submitForm,
    };
  };

  useEffect(() => {
    dispatch(getListSupplierManage((status, response) => {}));
  }, [dispatch]);

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (router.query?.supplierId && Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        supplierId: +router.query?.supplierId!,
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
    <div className='supplierContainer box-content'>
      <HeaderSupplier showFilter={showFilter} toggleFilter={toggleFilter} />

      {showFilter && (
        <BoxSearchSupplier
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          handleClearForm={handleClearDetailManage}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
          loading={loading}
        />
      )}

      <DataTableSupplier
        filter={filterPayload}
        supplierId={filter?.supplierId}
        data={listDetailSupplier}
        totalFilter={totalRow}
        getDataList={handleGetDetailSupperlier}
        setSubmitForm={setSubmitForm}
        heightBoxSearch={height + 1}
        loading={loading}
      />
      <LoadingInline loading={loading} />
    </div>
  );
};

export default SupplierPageContainer;
