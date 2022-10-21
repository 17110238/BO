import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { exportSearchBalanceMerchantActionFailure, exportSearchBalanceMerchantActionRequest, exportSearchBalanceMerchantActionSuccess } from 'redux/actions/accountantAction';
import { handleDowloadSaga } from 'redux/actions/handleDowloadActions';
import alert from 'utils/helpers/alert';
import checkPermission from 'utils/helpers/checkPermission';

const query1 = `subscription subExportMc {
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
interface HeaderAccountBalanceProps {
  showFilter?: boolean;
  toggleFilter?: () => void;
  onClickExport?: () => void;
  t: (a: string) => string;
  showModalPayint: () => void;
  filter: any;
}

interface scopeUserProps {
  scope: string[];
}

const HeaderReportTop: React.FC<HeaderAccountBalanceProps> = ({
  showFilter,
  toggleFilter,
  onClickExport,
  showModalPayint,
  filter,
  t,
}) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState('');
  const router = useRouter();

  const accountIdLogin = useSelector<any>(
    (state) => state?.authReducers?.accountInfo?.profile.accountId
  );

  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });


  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);
  useEffect(() => {
    dispatch(exportSearchBalanceMerchantActionFailure());
  }, []);
  const sub: any = client.request({ query: query1 });
  const handleExportExcelFile = async () => {
    dispatch(exportSearchBalanceMerchantActionRequest({ ...filter }));
    client?.unsubscribeAll();
    sub.subscribe({
      next({ data }: any) {
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            if (state && dataForm?.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              dispatch(exportSearchBalanceMerchantActionSuccess());
              alert('success', 'Xuất file thành công', t);
              client?.unsubscribeAll();
            } else {
              dispatch(exportSearchBalanceMerchantActionFailure());
              alert('error', 'Xuất file thất bại', t);
              client?.unsubscribeAll();
            }
          })
        );
      },
    });
  };
  useEffect(() => {
    return () => {
      dispatch(exportSearchBalanceMerchantActionFailure());
    };
  }, [router]);
  // export const exportSearchBalanceMerchantActionRequest = () => {
  //   return {
  //     type: types.EXPORT_SEARCH_ACCOUNTANT.REQUEST,
  //   };
  // };

  // export const exportSearchBalanceMerchantActionPending = () => {
  //   return {
  //     type: types.EXPORT_SEARCH_ACCOUNTANT.PENDING,
  //   };
  // };
  // export const exportSearchBalanceMerchantActionFailure = () => {
  //   return {
  //     type: types.EXPORT_SEARCH_ACCOUNTANT.FAILURE,
  //   };
  // };
  // export const exportSearchBalanceMerchantActionSuccess = () => {
  //   return {
  //     type: types.EXPORT_SEARCH_ACCOUNTANT.SUCCESS,
  //   };
  // };

  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const checkImportPayinPermission = checkPermission(accountInfo?.scope, ['bo.payin.import']);

  return (
    // <div className='header-transaction d-flex box-header justify-content-between pt-2 px-2'>
    //   <div className='ml-2'>
    //     <h5>{t("Quản lý giao dịch")}</h5>
    //   </div>
    //   <div className='d-flex'>
    //     <button
    //       className={`btn btn-filter${showFilter ? '-active' : ''} mb-2 mr-2`}
    //       onClick={toggleFilter}>
    //       <img
    //         src={`/assets/img/Icon-filter${showFilter ? '_active.png' : '.png'}`}
    //         className='mr-2'
    //         alt=''></img>
    //       {showFilter ? t('Hide filter') : t('Filter')}
    //     </button>

    //     <button className="export-btn btn" onClick={onClickExport}>
    //       <span className="export-btn__image"></span>
    //       {t("Export")}
    //     </button>
    //   </div>
    // </div>

    <div className='header-transaction-container'>
      <p className='header-transaction__title'>{t(' Thống kê top')}</p>
      <div className='header-transaction__btn-group'>

        <button
          className={`filter-btn btn ${showFilter ? 'btn-active' : ''}`}
          onClick={toggleFilter}>
          <svg
            width='14'
            height='12'
            xmlns='http://www.w3.org/2000/svg'
            style={{ transition: 'all 0.3s' }}>
            <path
              d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
              fill={showFilter ? '#00BE00' : '#647081'}
              fillRule='evenodd'></path>
          </svg>
          {t(['Filter', 'Hide filter'][+(showFilter || 0)])}
        </button>
      </div>
    </div>
  );
};

export default memo(HeaderReportTop);
