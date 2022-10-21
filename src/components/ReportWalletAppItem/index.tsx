import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAppReportAction } from 'redux/actions/reportEwalletAction';
import alert from 'utils/helpers/alert';
import ReportEwalletServiceItemDatatable from './Datatable';
import _ from 'lodash';

const ReportWalletAppItem = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [submitForm, setSubmitForm] = useState(true);

  const handleGetEwalletServiceItem = (start?: number, limit?: number) => {
    const payload: any = { appId: query.id, name: query.name };
    function handleGetEwalletServiceItem(payload: any) {
      setLoading(true);
      dispatch(
        getAppReportAction(_.omit(payload, ['paging']), (state, res) => {
          setLoading(false);
          if (state) {
            setData(res);
          } else {
            alert('error', res.message);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetEwalletServiceItem,
      submitForm,
      setSubmitForm,
    };
  };

  return (
    <div>
      <Link href='/vi-dien-tu/thong-ke-vi/dich-vu-vi'>
        <a>
          <i className='fa fa-chevron-left' aria-hidden='true'></i>
          <span className='ml-2'>
            {data && data.length > 0 ? data[0].appName : 'Chi tiết ứng dụng'}
          </span>
        </a>
      </Link>
      <div className='mt-2'>
        <ReportEwalletServiceItemDatatable
          handleGetEwalletServiceItemReport={handleGetEwalletServiceItem}
          data={data}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ReportWalletAppItem;
