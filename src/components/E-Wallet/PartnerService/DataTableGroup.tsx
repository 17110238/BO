import { EwalletGateReportDataType, EwalletGateReportReponsed, EwalletGateReportType } from 'models/ewalletPartnerService';
import numeral from 'numeral';
import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getListEWalletTransaction } from 'redux/actions/eWalletTransactionHistoryActions';
import { SearchEWalletTransactionInput } from 'models/eWalletTransaction'
import { ServiceEWalletTransactionBOEnum, StateEWalletTransactionBoEnum } from 'models';
import { useRouter } from 'next/router'
import LoadingInline from 'components/common/Loading/LoadingInline';

interface Props {
  title?: string;
  dataEwallet?: EwalletGateReportReponsed,
  isLoading?: boolean
}

const DataTableGroup: React.FC<Props> = ({ title, dataEwallet, isLoading, ...rest }) => {
  const dispatch = useDispatch()

  const router = useRouter()

  return (
    <>
      <LoadingInline loading={isLoading} />
      <div className='partnerService-content pt-0'>
        <div className='partnerService-table table-price'>
          <div className='partnerService-table__overflow'>
            <table className='partnerService-table__content'>
              <thead>
                <tr className='title_gate-group'>
                  <td className='w-25'>Nhà Mạng</td>
                  <td className='w-25'>Sản Lượng</td>
                  <td className='w-25'>Thành Tiền</td>
                  <td className='w-25'>Thành Tiền Sau Chiết Khấu</td>
                </tr>
              </thead>
              <tbody>
                {dataEwallet?.data?.map((part: EwalletGateReportType, count: number) => {
                  return (
                    <Fragment key={count}>
                      <tr>
                        <td colSpan={4} className='p-0'>
                          <div className='partnerService-table__header'>
                            <h4>{part?.type}</h4>
                            <span onClick={() => {
                              router.push(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-${part?.type?.toLowerCase() === 'mobile_topup' ? 'topup' : part?.type?.toLowerCase()}`)
                            }}>Chi Tiết</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="p-0">
                          <div className='partnerService-table__overflow'>
                            <table className='partnerService-table__content'>
                              <thead>
                                <tr>
                                  <td className='w-25'>Số Lượng Nạp</td>
                                  <td className='w-25'>Giá Trị Nạp</td>
                                  <td className='w-25'>Số Lượng Rút</td>
                                  <td className='w-25'>Giá Trị Rút</td>
                                </tr>
                              </thead>
                              <tbody>
                                {part?.data?.map((item: EwalletGateReportDataType, index: number) => {
                                  return (
                                    <tr key={index}>
                                      <td className='text-left'>{item?.supplier}</td>
                                      <td>{numeral(item?.count).format('0,0') || 0} đ</td>
                                      <td>{numeral(item?.amount).format('0,0') || 0} đ</td>
                                      <td>{numeral(item?.total).format('0,0') || 0} đ</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td className='w-25'>Tổng Cộng</td>
                                  <td className='w-25'>{numeral(part?.total?.count).format('0,0') || 0} đ</td>
                                  <td className='w-25'>{numeral(part?.total?.amount).format('0,0') || 0} đ</td>
                                  <td className='w-25'>{numeral(part?.total?.total).format('0,0') || 0} đ</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className='w-25' style={{ textDecoration: 'underline' }}>TỔNG CỘNG</td>
                  <td className='w-25'>{numeral(dataEwallet?.total?.count).format('0,0') || 0} đ</td>
                  <td className='w-25'>{numeral(dataEwallet?.total?.amount).format('0,0') || 0} đ</td>
                  <td className='w-25'>{numeral(dataEwallet?.total?.total).format('0,0') || 0} đ</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default DataTableGroup;