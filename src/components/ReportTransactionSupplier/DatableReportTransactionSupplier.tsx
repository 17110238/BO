/* eslint-disable react-hooks/exhaustive-deps */
import Nodata from 'components/common/NoData/Nodata';
import { useRouter } from 'next/router';
import numeral from 'numeral';
// import { EwalletSearchSessionsResponse } from 'models';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
interface DataTableReportSupplierProps {
  t: (a: string) => string;
  data?: any;
  totalFilter?: number;
  columnTitles?: any;
  reportData?: any;
  walletKYC?: any;
  rest?: any;
  sumWalletKYC?: any;
}

export default function DataTableReportSupplier({
  t,
  data,
  totalFilter,
  reportData,
  columnTitles,
  walletKYC,
  sumWalletKYC,
  ...rest
}: DataTableReportSupplierProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const loading = useSelector<any | boolean>((state) => state?.reportKYCReducer?.loading);

  return (
    <div className='table-data-report-kyc transaction-report-data-table-container'>
      {data && Object.keys(data).length > 0 && (
        <table>
          <thead>
            <th>Nhà mạng</th>
            <th>Sản lượng</th>
          </thead>
          <tbody>
            {data &&
              Object.entries(data).map((el: any) => (
                <tr>
                  <th>{el[0].toUpperCase()}</th>
                  <th style={{ textAlign: 'right' }}>{el[1] ?? '-'}</th>
                </tr>
              ))}
            {Object?.values(data)?.length > 0 && (
              <tr>
                <th>{'TỔNG CỘNG'}</th>

                <th style={{ textAlign: 'right' }}>
                  {' '}
                  {Object?.values(data)?.reduce((a: any, b: any) => a + b)}
                </th>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {(!data || Object.keys(data).length === 0) && (
        <Nodata imageDataEmpty={''} messageDataEmpty={'Không có dữ liệu'} />
      )}
    </div>
  );
}
