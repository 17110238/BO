import { GetEwalletServiceBillReportResponed, ServiceBillType } from 'models/ewalletPartnerService';
import numeral from 'numeral';
import React from 'react';
import { useRouter } from 'next/router'
import LoadingInline from 'components/common/Loading/LoadingInline';

interface Props {
  title?: string,
  dataEwallet?: GetEwalletServiceBillReportResponed,
  isLoading? : boolean
}

const DataTableFooter: React.FC<Props> = ({
  title,
  dataEwallet,
  isLoading,
  ...rest
}) => {

  const router = useRouter()
  return (
    <>
    <LoadingInline loading={isLoading}/>
      <div className='partnerService-content pt-0'>
        <div className='partnerService-table table-price'>
          <div className='partnerService-table__header'>
            <h4>{title}</h4>
            <span onClick={() => {
              router.push(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-${title?.toLowerCase()}`)
            }}>Chi Tiết</span>
          </div>
          <div className='partnerService-table__overflow'>
            <table className='partnerService-table__content'>
              <thead>
                <tr>
                  <td>Loại GD</td>
                  <td>Số Lượng</td>
                  <td>Thành Tiền</td>
                </tr>
              </thead>
              <tbody>
                {dataEwallet?.data?.map((item: ServiceBillType, index: number) => {                  
                  return (
                    <tr key={index}>
                      <td style={{textAlign: 'start'}}>{item?.type}</td>
                      <td>{numeral(item?.count).format('0,0')}</td>
                      <td>{numeral(item?.total).format('0,0')} đ</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td>Tổng Cộng</td>
                  <td>{numeral(dataEwallet?.total?.count).format('0,0') || 0} đ</td>
                  <td>{numeral(dataEwallet?.total?.total).format('0,0') || 0} đ</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default DataTableFooter;
