import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import LoadingInline from 'components/common/Loading/LoadingInline';
import { GetBalanceResponsed, GetTotalUserResponsed } from 'models/overviewReportWallet';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getOverviewReportWallet, getTotalUser } from 'redux/actions';
import formatCurrency from 'utils/helpers/formatCurrency';

const styled = {
  borderBottom: 'none',
};

export default function ReportOverviewWalletContainer() {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [data, setData] = useState<GetBalanceResponsed>({});
  const [dataTotalUser, setDataTotalUser] = useState<GetTotalUserResponsed>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    dispatch(
      getOverviewReportWallet((state, res) => {
        if (state) {
          setData(res);
        }
      })
    );
    dispatch(
      getTotalUser((state, res) => {
        if (state) {
          setDataTotalUser(res);
        }
      })
    );
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadingFullScreen />}
      <div className='reportWallet-container cls-top-slgd'>
        <div className='reportWallet-header'>
          <div className='reportWallet-header__content'>
            <div className='reportWallet-header__title'>
              <h2>{t('Báo cáo tổng quan ví điện tử')}</h2>
            </div>
          </div>
        </div>
        <div className='reportWallet-content mt-3 '>
          <table className='reportWallet-content__tableFixed' style={{ width: '100%' }}>
            <tbody>
              <tr className='title'>
                <td
                  className='font-weight-bold text-left'
                  style={{ width: '30%', minWidth: '200px' }}>
                  {t('Tổng số dư ví')}
                </td>
                <td style={{ textAlign: 'right', padding: '15px 10px', minWidth: '200px' }}>
                  {formatCurrency(data?.balance) || 0}
                </td>
              </tr>
              <tr className='odd'>
                <td className='font-weight-bold text-left'>{t('Số ví đã phát hành')}</td>
                <td style={{ textAlign: 'right', padding: '15px 10px' }}>
                  {/* <div className='reportWallet-loader'></div> */}
                  {formatCurrency(dataTotalUser?.userReg) || 0}
                </td>
              </tr>
              <tr className='even'>
                <td className='font-weight-bold text-left'>{t('Số ví đã kích hoạt')}</td>
                <td style={{ textAlign: 'right', padding: '15px 10px' }}>
                  {formatCurrency(dataTotalUser?.userKyc) || 0}
                </td>
              </tr>
              <tr className='odd'>
                <td className='font-weight-bold text-left'>{t('Số ví đang hoạt động')}</td>
                <td style={{ textAlign: 'right', padding: '15px 10px' }}>
                  {formatCurrency(dataTotalUser?.userOpen) || 0}
                </td>
              </tr>
              <tr className='even'>
                <td className='font-weight-bold text-left'>{t('Tổng số dư ví hiện hành')}</td>
                <td style={{ textAlign: 'right', padding: '15px 10px' }}>
                  {formatCurrency(data?.balanceOpen) || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
