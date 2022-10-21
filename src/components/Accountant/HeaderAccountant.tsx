import FileSaver from 'file-saver';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { useRouter } from 'next/router';
import { default as React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  exportAccountantCrossCheck,
  exportAccountantCrossCheckFailure,
  exportAccountantCrossCheckSuccess,
  exportSearchBalanceMerchantActionFailure,
} from 'redux/actions/accountantAction';
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
interface HeaderAccountantProps {
  showFilter?: boolean;
  toggleFilter?: () => void;
  filter: any;
  t: (a: string) => string;
  showModalPayint: () => void;
  showModalDeposit: () => void;
}
interface scopeUserProps {
  scope: string[];
}

const HeaderAccountant: React.FC<HeaderAccountantProps> = ({
  showFilter,
  toggleFilter,
  filter,
  showModalPayint,
  showModalDeposit,
  t,
}) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState('');
  const router = useRouter();
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
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
   

    dispatch(exportAccountantCrossCheck({ ...filter }));
    client?.unsubscribeAll();
    sub.subscribe({
      next({ data }: any) {
        let dataForm = data?.SubExport?.SubExportExcel;
        let urlData = data?.SubExport?.SubExportExcel?.data;
        dispatch(
          handleDowloadSaga({ data: `${urlData}` }, async (state, res) => {
            //  console.log('state,res', dataForm?.accountId);
            // state && dataForm?.accountId === accountIdLogin
            if (state && dataForm?.accountId === accountIdLogin) {
              await FileSaver.saveAs(res, `${new Date().getTime()}.xlsx`);
              dispatch(exportAccountantCrossCheckSuccess());
              alert('success', 'Xuất file thành công', t);
              client?.unsubscribeAll();
            } else {
              dispatch(exportAccountantCrossCheckFailure());
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
      dispatch(exportAccountantCrossCheckFailure());
    };
  }, [router]);

  const checkImportPayinPermission = checkPermission(accountInfo?.scope, ['bo.payin.import']);

  return (
    <div className='header-transaction-container'>
      <p className='header-transaction__title'>{t(' Đối soát doanh nghiệp')}</p>
      <div className='header-transaction__btn-group'>
        <div className='div d-flex'>
          {
            <button className='btn btn-primary mr-2' onClick={showModalPayint}>
              <i className='fa fa-plus' aria-hidden='true'></i>
              {t('Tạo lệnh đối soát')}
            </button>
          }
          {
            <button className='btn btn-primary mr-2' onClick={showModalDeposit}>
              <i className='fa fa-plus' aria-hidden='true'></i>
              {t(' Đối soát')}
            </button>
          }
        </div>
        <div className='div d-flex'>
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
          <button className='export-btn btn ml-2' onClick={() => handleExportExcelFile()}>
            <span className='export-btn__image'></span>
            {t('Xuất File')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderAccountant;
