import LoadingInline from 'components/common/Loading/LoadingInline'
import { DataReportAgent, DataReportSystemTransactionResponsed, ReportSystemTransactionResponsed, SumDataReportSystemTransactionResponsed, typeGetTopTransactionByAccountReponsed } from 'models'
import { useRouter } from 'next/router'
import React, { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { useSelector } from 'react-redux'
import { boolean } from 'yup'
import BoxSearchTransaction from './BoxSearchTransaction'




interface propsType {
  isShowFilter: boolean;
}
const TransactionContainer = ({ isShowFilter }: propsType) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [showDay, setShowDay] = useState<boolean>(true);
  const listReportTransaction = useSelector<any, DataReportSystemTransactionResponsed[]>(state => state.ReportSystem?.listReportTransaction.data) || [];
  const listReportTransactionTotal = useSelector<any, SumDataReportSystemTransactionResponsed>(state => state.ReportSystem?.listReportTransaction.sumData) || [];
  const loadingSystem = useSelector<any, boolean>(state => state.ReportSystem?.loadingSystem);
  // amountTotal: 195359831 tổng tiền thanh toán
  //total :191793672   giá trị giao dịch
  // canceledTransactionTotal: 0số giao dịch huy
  // crossCheckAmountTotal: 85511823 tổng tiền đối soát
  // date: "2022-06-15"
  // expiredTransactionTotal: 0 số gd hết hạn
  // failedTransactionTotal: 23 giao dịch thất bại
  // feeTotal: 0 Tổng Phí TT
  // merchantFeeTotal: 3566159 tổng phí xử lí giao dịch
  // refundedAmountTotal: 10000 tổng tiền hoàn
  // refundedTransactionTotal: 1 số gd hoàn
  // 
  // transactionTotal: 89số lượng giao dịch
  // waitingCrosscheckAmountTotal: 444923 tổng tiền chưa đối soát
  //   sumData?.
  // sumAmountTotal: 12103650
  // sumCanceledTransactionTotal: 0
  // sumCrossCheckAmountTotal: 974825
  // sumExpiredTransactionTotal: 0
  // sumFailedTransactionTotal: 0
  // sumFeeTotal: 0
  // sumMerchantFeeTotal: 109980
  // sumRefundedAmountTotal: 650000
  // sumRefundedTransactionTotal: 4
  // sumTotal: 11993670
  // sumTransactionTotal: 20
  // sumWaitingCrosscheckAmountTotal: 7802
  const handleShowDay = () => setShowDay(!showDay);

  return (
    <>
      <BoxSearchTransaction loadingAccount={loadingSystem} isShowFilter={isShowFilter} />
      <LoadingInline loading={loadingSystem} />
      <div className='reportTop-container' >
        {/* {showFilter && <BoxSearchAgent loadingAccount={loadingAccount} isShowFilter={ isShowFilter}/>} */}
        <div className='reportTransaction-content'>
          <table className='reportTransaction-content__tableFixed'>
            <tbody>
              <tr className='tableFixed-head'>
                <td></td>
              </tr>
              <tr>
                <td>{t('Tổng số dư')}</td>
              </tr>
              <tr>
                <td>{t('Tổng Tiền TT')}</td>
              </tr>
              <tr>
                <td>{t('Giá Trị GD')}</td>
              </tr>
              <tr>
                <td>{t('Tổng Phí TT')}</td>
              </tr>
              <tr>
                <td>{t('Tổng Phí Xử Lý GD')}</td>
              </tr>
              <tr>
                <td>{t('Số Lượng GD')}</td>
              </tr>
              <tr>
                <td>{t('Tổng Tiền Hoàn')}</td>
              </tr>
              <tr>
                <td>{t('Số GD Hoàn')}</td>
              </tr>
              <tr>
                <td>{t('Số GD Hủy')}</td>
              </tr>
              <tr>
                <td>{t('Số GD Thất Bại')}</td>
              </tr>
              <tr>
                <td>{t('Số GD Hết Hạn')}</td>
              </tr>
              <tr>
                <td>{t('Tổng Tiền Đối Soát')}</td>
              </tr>
              <tr>
                <td>{t('Tổng Tiền Chưa Đối Soát	')}</td>
              </tr>
            </tbody>
          </table>
          <div className='overflow-table'>
            <table className='reportTransaction-content__table'>
              <tbody>
                <tr style={{ borderTop: ' solid 1px #f1f2f6' }} key={Math.random()}>
                  {listReportTransaction.map((item, index) => (
                    <th className='table-fixedHead' key={index}>{item.date || 'fail'}</th>
                  ))}

                  <th className='table-fixedHead' >Tổng </th>

                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (
                        <th key={Math.random()}>{<NumberFormat
                          value={item?.totalBalance}
                          className='foo'
                          displayType={'text'}
                          thousandSeparator={true} />}</th>
                      );
                    })}
                  <th className='total'></th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (
                        <th key={Math.random()}>{<NumberFormat
                          value={item.amountTotal}
                          className='foo'
                          displayType={'text'}
                          thousandSeparator={true} />}</th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumAmountTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />}</th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (
                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.total}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (
                        <th key={Math.random()}>{<NumberFormat
                          value={item.feeTotal}
                          className='foo'
                          displayType={'text'}
                          thousandSeparator={true} />}</th>
                      );
                    })}
                  <th className='total'>{
                    <NumberFormat
                      value={listReportTransactionTotal?.sumFeeTotal}
                      className='foo'
                      displayType={'text'}
                      thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (
                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.merchantFeeTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>
                  </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (
                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.transactionTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumTransactionTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (

                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.refundedAmountTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumRefundedAmountTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (

                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.refundedTransactionTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumRefundedTransactionTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (

                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.canceledTransactionTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumCanceledTransactionTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (

                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.failedTransactionTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumFailedTransactionTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (
                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.expiredTransactionTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>
                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumExpiredTransactionTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (

                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.crossCheckAmountTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>

                      );
                    })}
                  <th className='total'></th>
                </tr>
                <tr key={Math.random()}>
                  {
                    listReportTransaction.map((item) => {
                      return (

                        <th key={Math.random()}>{
                          <NumberFormat
                            value={item.waitingCrosscheckAmountTotal}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />} </th>

                      );
                    })}
                  <th className='total'>{<NumberFormat
                    value={listReportTransactionTotal?.sumWaitingCrosscheckAmountTotal}
                    className='foo'
                    displayType={'text'}
                    thousandSeparator={true} />} </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(TransactionContainer)