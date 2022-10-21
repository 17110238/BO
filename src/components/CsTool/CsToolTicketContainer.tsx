import LoadingInline from 'components/common/Loading/LoadingInline';
import useElementSize from 'hook/useElementSize';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getDataDashBoardTicket } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchTicketCsTool from './BoxSearchTicketCsTool';
import DataTableCsToolTicket from './DataTableCsToolTicket';
import HeaderCsToolTicket from './HeaderCsToolTicket';

const CsToolDashBoardContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [squareRef, { width, height }] = useElementSize();
  const [listDetailDashBoardCs, setlistDetailDashBoardCs] = useState([]);
  const loading = useSelector<boolean>((state: any) => state?.customerSupport?.loading);
  const [filter, setFilter] = useState<any>({});
  const [checkUpdate, setCheckUpdate] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setSubmitForm(true);
  }, []);

  const handleSubmitForm = () => {
    setSubmitForm(true);
  };

  const handleSubmitSearch = (data: any) => {
    const { state, merchantId, phone, email } = data;

    if (merchantId) {
      data.merchantId = +data.merchantId;
    }
    let payload = clearFalsyObject({ ...data });
    setFilter({ ...payload });
    setSubmitForm(true);
  };

  const handleGetDataDashBoard = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetDataDashBoard(payload: any) {
      dispatch(
        getDataDashBoardTicket(payload, (status, res) => {
          setlistDetailDashBoardCs(res);
          setTotalRow(res.length);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetDataDashBoard,
      submitForm,
    };
  };

  useEffect(() => {
    const params = { ...router.query };
    if (Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        merchantId: +router.query?.merchantId!,
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
    <div className='supplierContainer box-content dash-board-customer-support-ticket update-ticket-wrrapper'>
      <HeaderCsToolTicket showFilter={showFilter} toggleFilter={toggleFilter} />

      {showFilter && (
        <BoxSearchTicketCsTool
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          checkUpdate={checkUpdate}
          handleCheckUpdate={handleSubmitForm}
          loading={loading}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
        />
      )}

      <DataTableCsToolTicket
        t={t}
        loading={loading}
        handleCheckUpdate={handleSubmitForm}
        data={listDetailDashBoardCs}
        totalFilter={totalRow}
        getDataList={handleGetDataDashBoard}
        setSubmitForm={setSubmitForm}
      />
      <LoadingInline loading={loading} />
    </div>
  );
};

export default CsToolDashBoardContainer;
