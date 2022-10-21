/* eslint-disable react-hooks/exhaustive-deps */
import Nodata from 'components/common/NoData/Nodata';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
interface DataTableReportKYC {
  t: (a: string) => string;
  data?: any;
  totalFilter?: number;
  columnTitles?: any;
  reportData?: any;
  walletKYC?: any;
  rest?: any;
  sumWalletKYC?: any;
}

export default function DataTableReportKYC({
  t,
  data,
  totalFilter,
  reportData,
  columnTitles,
  walletKYC,
  sumWalletKYC,
  ...rest
}: DataTableReportKYC) {
  return (
    <div className='table-data-report-kyc transaction-report-data-table-container'>
      {data?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>

              {columnTitles?.map((col: any, index: number) => (
                <th key={index}>{col}</th>
              ))}
              <th>Tổng cộng</th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              <tr>
                <th>
                  <span>{'Ví KYC trong ngày'}</span>
                </th>
                {walletKYC?.map((col: any, index: number) => (
                  <td key={index}>{numeral(col).format('0,0.[0000]')}</td>
                ))}
                <td>{walletKYC.reduce((a: number, b: number) => a + b, 0)}</td>
              </tr>
              <tr>
                <th>
                  <span>{'Tổng ví đã KYC'}</span>
                </th>
                {sumWalletKYC?.map((col: any, index: number) => (
                  <td key={index}>{numeral(col).format('0,0.[0000]')}</td>
                ))}
                 <td ></td>
              </tr>
            </Fragment>
          </tbody>
        </table>
      )}
      {(!data || data?.length === 0) && (
        <Nodata imageDataEmpty={''} messageDataEmpty={'Không có dữ liệu'} />
      )}
    </div>
  );
}
