import { DetailRevenue } from 'models';
import numeral from 'numeral';
import React from 'react';
import { useTranslation } from 'react-i18next';
interface Props {
  total: DetailRevenue;
}
const ReportDetailSummaryMerchant: React.FC<Props> = ({ total }) => {
  const { t } = useTranslation('common');
  return (
    <div className='revenue-statistics__summary-revenue detail-revenue__summary-revenue mt-2'>
      <div className='summary-revenue__layout'>
        <div className='summary-revenue__item'>
          {t('Số GD thành công')}
          <p>{numeral(total.succeededCount).format('0,0') || '[ - ]'}</p>
        </div>
        <div className={`summary-revenue__item `}>
          {t('Số GD hủy')}
          <p>{numeral(total.canceledCount).format('0,0') || '[ - ]'}</p>
        </div>
        <div className={`summary-revenue__item `}>
          {t('Số GD hoàn')}
          <p>{numeral(total.refundedCount).format('0,0') || '[ - ]'}</p>
        </div>
        <div className='summary-revenue__item'>
          {t('Tổng tiền GD thành công')}
          <p className={total?.succeededAmount && total?.succeededAmount < 0 ? 'text-danger' : ''}>
            {numeral(total.succeededAmount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className={`summary-revenue__item`}>
          {t('Tổng tiền GD hủy')}
          <p className={total?.canceledAmount && total?.canceledAmount < 0 ? 'text-danger' : ''}>
            {numeral(total.canceledAmount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className='summary-revenue__item'>
          {t('Phí GD')}
          <p className={total?.fee && total?.fee < 0 ? 'text-danger' : ''}>
            {numeral(total.fee).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className='summary-revenue__item'>
          {t('Tổng tiền MC thực nhận')}
          <p className={total?.amount && total?.amount < 0 ? 'text-danger' : ''}>
            {numeral(total.amount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className={`summary-revenue__item`}>
          {t('Tổng đối soát')}
          <p
            className={total?.crossCheckAmount && total?.crossCheckAmount < 0 ? 'text-danger' : ''}>
            {numeral(total.crossCheckAmount).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className='summary-revenue__item'>
          {t('Tổng GD đối soát')}
          <p>{numeral(total.crossCheckCount).format('0,0') || '[ - ]'}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailSummaryMerchant;
