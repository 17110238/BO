import dayjs from 'dayjs';
import { BalanceReportWallet } from 'models';
import numeral from 'numeral';
import React from 'react';
import { useTranslation } from 'react-i18next';
interface Props {
  total: BalanceReportWallet;
}

const ReportSummarySocial: React.FC<Props> = ({ total }) => {
  const { t } = useTranslation('common');

  const roundNumber = (num?: number) => {
    const length = num?.toString().split('.')[1]?.length;
    const fixedNumber = Math.pow(10, length || 1);
    return num ? Math.round(num * fixedNumber) / fixedNumber : 0;
  };

  return (
    <div
      className='summary-custom-ui-basic report-social-container__report-summary'
      style={{ position: 'relative', marginBottom: '2rem' }}>
      <div className='summary-custom-ui-basic__layout report-summary__layout'>
        <div className='summary-custom-ui-basic__item report-summary__item'>
          {t('Tổng số dư hiện tại')}
          <p>{numeral(roundNumber(total?.balance)).format('0,0') || '[ - ]'} VND</p>
        </div>
        <div className='summary-custom-ui-basic__item report-summary__item'>
          {t('Tổng số tiền ví đang hoạt động')}
          <p className={total?.balanceOpen && total?.balanceOpen < 0 ? 'text-danger' : ''}>
            {numeral(roundNumber(total?.balanceOpen)).format('0,0') || '[ - ]'} VND
          </p>
        </div>
        <div className='summary-custom-ui-basic__item report-summary__item'>
          {t('Tổng số tiền ví bị khóa')}
          <p className={total?.balanceLock && total?.balanceLock < 0 ? 'text-danger' : ''}>
            {numeral(roundNumber(total?.balanceLock)).format('0,0') || '[ - ]'} VND
          </p>
        </div>
      </div>
      <div
        className='text-last-update'
        >
        <span>
          Dữ liệu cập nhật đến {dayjs(new Date()).subtract(1, 'days').format('DD-MM-YYYY')} 23:59:59
        </span>
      </div>
    </div>
  );
};

export default ReportSummarySocial;
