import LoadingInline from 'components/common/Loading/LoadingInline'
import { DataReportAgent, ReportAngent, sumData, typeGetTopTransactionByAccountReponsed } from 'models'
import { useRouter } from 'next/router'
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { useSelector } from 'react-redux'
import { boolean } from 'yup'
import BoxSearchAgent from './BoxSearchAgent';
interface propsType {
  isShowFilter: boolean;
}
const AgentContainer = ({ isShowFilter }: propsType) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [showDay, setShowDay] = useState<boolean>(true);
  const loading = useSelector<any, boolean>(state => state.ReportSystem?.loading);
  const listReportAgent = useSelector<any, ReportAngent[]>(state => state.ReportSystem?.listReportAgent.data) || [];
  const listReportAgentTotal = useSelector<any, sumData>(state => state.ReportSystem?.listReportAgent.sumData) || [];
  //  date: "2022-05-23"
  // mcActive: 607
  // mcActiveEnterprise: 392
  // mcActiveIndividual: 215
  // mcApproved: 0
  // mcBlocked: 0
  // mcHasTransaction: 9
  // mcNewRegister: 0
  // mcRejected: 0
  // numberOfTransactions: 93
  // totalMcApproved: 24
  // totalMcBlocked: 0
  // totalMcNewRegister: 41
  // totalMcRejected: 5
  // totalNumberOfTransactions: 1281
  // [[Prototype]]: Object
  const handleShowDay = () => setShowDay(!showDay);
  return (
    <>
      <>
        <BoxSearchAgent loadingAccount={loading} isShowFilter={isShowFilter} />
        <LoadingInline loading={loading } />
        <div className='reportTop-container'>
          {/* {showFilter && <BoxSearchAgent loadingAccount={loadingAccount} isShowFilter={ isShowFilter}/>} */}
          <div className='reportTransaction-content'>
            <table className='reportTransaction-content__tableFixed'>
              <tbody>
                <tr className='tableFixed-head'>
                  <td></td>
                </tr>
                <tr>
                  <td>{t('MC Đăng ký mới')}</td>
                </tr>
                <tr>
                  <td>{t('MC đã duyệt')}</td>
                </tr>
                <tr>
                  <td>{t('MC bị Reject')}</td>
                </tr>
                <tr>
                  <td>{t('MC bị khóa')}</td>
                </tr>
                <tr>
                  <td>{t('MC hoạt động')}</td>
                </tr>
                <tr>
                  <td>{t('MC CN hoạt động')}</td>
                </tr>
                <tr>
                  <td>{t('MC DN hoạt động')}</td>
                </tr>
                <tr>
                  <td>{t('MC có giao dịch')}</td>
                </tr>
                <tr>
                  <td>{t('Số lượng giao dịch')}</td>
                </tr>
              </tbody>
            </table>
            <div className='overflow-table'>
              <table className='reportTransaction-content__table'>
                <tbody>
                  <tr style={{ borderTop: ' solid 1px #f1f2f6' }} key={Math.random()}>
                    {listReportAgent.map((item, index) => (
                      <th className='table-fixedHead' key={index}>{item.date || 'fail'}</th>
                    ))}
                    <th className='table-fixedHead' >Tổng </th>
                  </tr>
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{<NumberFormat
                            value={item.mcNewRegister}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />}</th>
                        );
                      })}
                    <th className='total'>{<NumberFormat
                      value={listReportAgentTotal.totalMcNewRegister}
                      className='foo'
                      displayType={'text'}
                      thousandSeparator={true} />}</th>
                  </tr>
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{<NumberFormat
                            value={item.mcApproved}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />}</th>
                        );
                      })}
                    <th className='total'>{<NumberFormat
                      value={listReportAgentTotal.totalMcApproved}
                      className='foo'
                      displayType={'text'}
                      thousandSeparator={true} />}</th>
                  </tr><tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{<NumberFormat
                            value={item.mcRejected}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />}</th>
                        );
                      })}
                    <th className='total'>{<NumberFormat
                      value={listReportAgentTotal.totalMcRejected}
                      className='foo'
                      displayType={'text'}
                      thousandSeparator={true} />}</th>
                  </tr>
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{<NumberFormat
                            value={item.mcBlocked}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />}</th>
                        );
                      })}
                    <th className='total'>{<NumberFormat
                      value={listReportAgentTotal.totalMcBlocked}
                      className='foo'
                      displayType={'text'}
                      thousandSeparator={true} />}</th>
                  </tr>
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{<NumberFormat
                            value={item.mcActive}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />}</th>
                        );
                      })}
                    <th className='total'></th>
                  </tr> 
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{<NumberFormat
                            value={item.mcActiveIndividual}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />}</th>
                        );
                      })}
                    <th className='total'></th>
                  </tr>
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{
                            <NumberFormat
                              value={item.mcActiveEnterprise}
                              className='foo'
                              displayType={'text'}
                              thousandSeparator={true} />} </th>
                        );
                      })}
                    <th className='total'> </th>
                  </tr>
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{<NumberFormat
                            value={item.mcHasTransaction}
                            className='foo'
                            displayType={'text'}
                            thousandSeparator={true} />}</th>
                        );
                      })}
                     <th className='total'> </th>
                  </tr>
                  <tr key={Math.random()}>
                    {listReportAgent &&
                      listReportAgent.map((item) => {
                        return (
                          <th key={Math.random()}>{
                            <NumberFormat
                              value={item.numberOfTransactions}
                              className='foo'
                              displayType={'text'}
                              thousandSeparator={true} />} </th>
                        );
                      })}
                    <th className='total'>{<NumberFormat
                      value={listReportAgentTotal?.totalNumberOfTransactions}
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
    </>
  )
}
export default memo(AgentContainer)