import { DataReportCustomer, ReportCustomerResponsed } from 'models/eWalletReportService';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import formatCurrency from 'utils/helpers/formatCurrency';
import LoadingInline from 'components/common/Loading/LoadingInline';

interface Props {
  data?: ReportCustomerResponsed
  isLoading? : boolean
}

const DataTableReportCustomer: React.FC<Props> = ({
  data,
  isLoading
}) => {

  const { t } = useTranslation('common');

  return (
    <>
      <LoadingInline loading={isLoading} />
      <div className='reportTransaction-content pt-0'>
        <table className='reportTransaction-content__tableFixed'>
          <tbody>
            <tr className='tableFixed-head'>
              <td style={{ height: '51px' }}></td>
            </tr>
            <tr>
              <td>{t('Ví đăng kí mới')}</td>
            </tr>
            <tr>
              <td>{t('Ví đã KYC')}</td>
            </tr>
            <tr>
              <td>{t('Ví đã reject')}</td>
            </tr>
            <tr>
              <td>{t('Tổng ví đã KYC')}</td>
            </tr>
            <tr>
              <td>{t('Tổng ví hoạt động')}</td>
            </tr>
            <tr>
              <td>{t('Tổng ví cá nhân')}</td>
            </tr>
            <tr>
              <td>{t('Tổng ví doanh nghiệp')}</td>
            </tr>
            <tr>
              <td>{t('Số dư ví cá nhân')}</td>
            </tr>
            <tr>
              <td>{t('Số dư ví doanh nghiệp')}</td>
            </tr>
            <tr>
              <td>{t('Số lượng giao dịch')}</td>
            </tr>
          </tbody>
        </table>
        <div className='overflow-table'>
          <table className='reportTransaction-content__table'>
            <tbody>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index} className='table-fixedHead'>{dayjs(item?.date).format('DD/MM/YYYY')}</th>
                  )
                })}
                <th className='table-fixedHead'>{t('Total')}</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.totalNewWallet)}</th>
                  )
                })}
                <th>{formatCurrency(data?.sumData?.sumAllNewWallet)}</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.walletKyc)}</th>
                  )
                })}
                <th>{formatCurrency(data?.sumData?.sumAllWalletKyc)}</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.rejectedWallet)}</th>
                  )
                })}
                <th>0</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.sumWalletKyc)}</th>
                  )
                })}
                <th>0</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.allWalletActive)}</th>
                  )
                })}
                <th>0</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.allUserWalletActive)}</th>
                  )
                })}
                <th>0</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.allBusinessWalletActive)}</th>
                  )
                })}
                <th>0</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(Math.round(item?.totalBalanceUser! * 100) / 100)} đ</th>
                  )
                })}
                <th>0</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.totalBalanceBusiness)} đ</th>
                  )
                })}
                <th>0</th>
              </tr>
              <tr>
                {data?.data?.map((item, index) => {
                  return (
                    <th key={index}>{formatCurrency(item?.totalTransactions)}</th>
                  )
                })}
                <th>{formatCurrency(data?.sumData?.sumAllTransaction)}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DataTableReportCustomer;
