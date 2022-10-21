import { SumRevenueReport } from 'models';
import numeral from 'numeral';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const ReportSummaryRevenue = () => {
  const { t } = useTranslation('common');
  const sumReport = useSelector<any, SumRevenueReport>((state) => state.reportMerchant.sumReport);
  return (
    <div className='revenue-statistics__summary-revenue'>
      <div className='summary-revenue__layout'>
        <div className='summary-revenue__item'>
          {t('Merchant')}
          <p>{numeral(sumReport.totalMerchant).format('0,0') || '[ - ]'}</p>
        </div>
        <div className={`summary-revenue__item `}>
          {t('Tổng thanh toán')}
          <p className={sumReport?.amount && sumReport?.amount < 0 ? 'text-danger' : ''}>
            {numeral(sumReport.amount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className={`summary-revenue__item `}>
          {t('Tổng phí')}
          <p className={sumReport?.fee && sumReport?.fee < 0 ? 'text-danger' : ''}>
            {numeral(sumReport.fee).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className='summary-revenue__item'>
          {t('Tổng số giao dịch')}
          <p>{numeral(sumReport.count).format('0,0') || '[ - ]'}</p>
        </div>
        <div className={`summary-revenue__item`}>
          {t('Tổng đối soát')}
          <p
            className={
              sumReport?.crossCheckAmount && sumReport?.crossCheckAmount < 0 ? 'text-danger' : ''
            }>
            {numeral(sumReport.crossCheckAmount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className='summary-revenue__item'>
          {t('Số giao dịch đối soát')}
          <p>{numeral(sumReport.crossCheckCount).format('0,0') || '[ - ]'}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryRevenue;
