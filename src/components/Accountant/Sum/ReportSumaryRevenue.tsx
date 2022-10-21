import { AccountantCrossCheckFormat, SumRevenueReport } from 'models';
import numeral from 'numeral';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface TypeReportSummaryRevenue {
  data: AccountantCrossCheckFormat[]
}
const ReportSummaryRevenue = (props:TypeReportSummaryRevenue) => {
  const { t } = useTranslation('common');
  const {data}=props
let numberDespositAmount:number =0
let sumTransition:number =0
let sumAmount:number =0
data?.map((item)=>{
  numberDespositAmount=numberDespositAmount + item?.amountEdit
  sumAmount =sumAmount +item.amount;
  sumTransition= sumTransition + item?.totalTransaction
})
  
  
  return (
    <div className='revenue-accountant__summary-revenue' >
      <div className='summary-revenue__layout'style={{marginRight:'0px'}}>
       
      <div className='summary-revenue__item'>
          {t('Tổng số giao dịch')}
          <p>{numeral(sumTransition).format('0,0') || '[ - ]'}</p>
        </div>
        <div className={`summary-revenue__item`}>
          {t('Tổng số đối soát')}
          <p
            className={
              sumAmount < 0 ? 'text-danger' : ''
            }>
          {numeral(numberDespositAmount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className={`summary-revenue__item `}>
          {t('Tổng số tạm tính')}
          <p className={numberDespositAmount < 0 ? 'text-danger' : ''}>
            
            {numeral(sumAmount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default ReportSummaryRevenue;
