import LoadingInline from 'components/common/Loading/LoadingInline';
import dayjs from 'dayjs';
import { ReportPoboOrderReponsed, ReportPoboOrderType } from 'models/report-bill';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { deleteListReportBill, getListReportBill } from 'redux/actions/reportBill';
import BoxSearchReportTransaction from './BoxSearchReportTransaction';
import HeaderReportTransaction from './HeaderReportTransaction';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export default function ReportTransactionContainer() {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showDeposit, setshowDeposit] = useState<boolean>(false);
  const toggleFilter = () => setShowFilter(!showFilter);
  const ListBill = useSelector<any, ReportPoboOrderReponsed>(state => state.ReportBillReducer?.listReportBill) || [];
  const loading = useSelector<any, boolean>(state => state.ReportBillReducer?.loading);
  let dataBuffer: ReportPoboOrderType[] = ListBill.data?.sort(function (a: any, b: any) {
    a = a?.month.split('-').reverse().join('');
    b = b?.month.split('-').reverse().join('');
    return a > b ? 1 : a < b ? -1 : 0;
  }) || [];
  // useEffect(() => {
  //   const defaultValue = {
  //     createdAt: {
  //       from: dayjs().subtract(2, 'month').startOf('month').utc().format(),
  //       to: dayjs().endOf('month').utc().format(),
  //     },
  //   }
  //   dispatch(getListReportBill(defaultValue))
  //   // return () => {
  //   //   dispatch(deleteListReportBill()) 
  //   // }


  // }, [])

  return (
    <>
      <div className='reportTransactionBill-container'>
        {loading && <LoadingInline loading={loading} />}
        <HeaderReportTransaction showFilter={showFilter}
          toggleFilter={toggleFilter} />
        {showFilter && <BoxSearchReportTransaction loading={loading} />}
        <div className='reportTransaction-content'>
          <table className='reportTransaction-content__tableFixed'>
            <tbody>
              <tr className='tableFixed-head'>
                <td></td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD Thành Công')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD Thành Công')}</td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD Không Thành Công')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD Không Thành Công')}</td>
              </tr>
            </tbody>
          </table>
          <div className='overflow-table'>
            <table className='reportTransaction-content__table'>
              <tbody>
                <tr style={{ borderTop: ' solid 1px #f1f2f6' }} key={Math.random()}>
                  {dataBuffer.map((item, index) => (
                    <th className='table-fixedHead' key={index}>{item.month || 'fail'}</th>
                  ))}

                  <th className='table-fixedHead' >Tổng </th>

                </tr>

                <tr key={Math.random()}>
                  {ListBill?.total &&
                    dataBuffer.map((item) => {
                      return (
                        // <th className='table-fixedHead' key={Math.random()}>
                        //   {dayjs(item.successCount).format('MM-YYYY')}
                        // </th>
                        <th key={item.successCount}>{<NumberFormat
                          value={item.successCount}
                          className='foo'
                          displayType={'text'}
                          thousandSeparator={true} />}</th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={ListBill?.total?.successCount}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />}</th>
                </tr>
                <tr key={Math.random()}>
                  {ListBill?.total &&
                    dataBuffer.map((item) => {
                      return (

                        <th key={item.successAmount}>{
                          <NumberFormat
                            value={item.successAmount}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} đ</th>

                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={ListBill?.total?.successAmount}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} đ</th>
                </tr>
                <tr key={Math.random()}>
                  {ListBill?.total &&
                    dataBuffer.map((item) => {
                      return (

                        <th key={item.failCount}>{<NumberFormat
                          value={item.failCount}
                          className='foo'
                          displayType={'text'}
                          thousandSeparator={true} />}</th>

                      );
                    })}
                  <th className='total'>{
                    <NumberFormat
                      value={ListBill?.total?.failCount}
                      className='foo'
                      displayType={'text'}
                      thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {ListBill?.total &&
                    dataBuffer.map((item) => {
                      return (

                        <th key={item.failAmount}>{
                          <NumberFormat
                            value={item.failAmount}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} đ</th>

                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={ListBill?.total?.failAmount}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} đ</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
