import { GetBankReportReponsed, GetEwalletHistoryReportType } from 'models/ewalletPartnerService';
import numeral from 'numeral';
import React from 'react';
import { useRouter } from 'next/router'
import LoadingInline from 'components/common/Loading/LoadingInline';

interface Props {
  title?: string,
  dataEwallet?: any,
  isLoading?: boolean
}

const DataTable: React.FC<Props> = ({
  title,
  dataEwallet,
  isLoading,
  ...rest
}) => {

  const router = useRouter()

  return (
    <>
      <LoadingInline loading={isLoading} />
      <div className='partnerService-content pt-0'>
        <div className='partnerService-table table-price'>
          <div className='partnerService-table__header'>
            <h4>{title}</h4>
            <span onClick={() => {
              if (title === 'PAY_QRCODE') {
                router.push(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-vnpay`)
              }else if( title === 'SSCC'){
                router.push(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-sscc`)
              } else {
                router.push(`/vi-dien-tu/giao-dich-ngan-hang?gateway=${title === 'NAPAS' ? title : 'PVCB'}`)
              }
            }}>Chi Tiết</span>
          </div>
          <div className='partnerService-table__overflow'>
            <table className='partnerService-table__content'>
              <thead>
                {
                  title === 'PAY_QRCODE' || title === 'SSCC' ?
                    <tr>
                      <td className='w-25'>Số Lượng GD</td>
                      <td className='w-25'>Giá Trị GD</td>
                      <td className='w-25'>Phí</td>
                      <td className='w-25'>Giá Trị Sau Phí</td>
                    </tr> :
                    <tr>
                      <td className='w-25'>Số Lượng Nạp</td>
                      <td className='w-25'>Giá Trị Nạp</td>
                      <td className='w-25'>Số Lượng Rút</td>
                      <td className='w-25'>Giá Trị Rút</td>
                    </tr>
                }
              </thead>
              <tbody>
                {title === 'PAY_QRCODE' || title === 'SSCC' ?
                  dataEwallet.map((item: any, index : number) => {
                    return (
                      <tr key={index}>
                        <td>{numeral(item?.count).format('0,0') || 0} đ</td>
                        <td>{numeral(item?.amount).format('0,0') || 0} đ</td>
                        <td>{numeral(item?.fee).format('0,0') || 0} đ</td>
                        <td>{numeral(item?.total).format('0,0') || 0} đ</td>
                      </tr>
                    )
                  })
                  :
                  <tr>
                    <td>{numeral(dataEwallet?.countDeposit).format('0,0') || 0} đ</td>
                    <td>{numeral(dataEwallet?.totalDeposit).format('0,0') || 0} đ</td>
                    <td>{numeral(dataEwallet?.countWithdraw).format('0,0') || 0} đ</td>
                    <td>{numeral(dataEwallet?.totalWithdraw).format('0,0') || 0} đ</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default DataTable;
