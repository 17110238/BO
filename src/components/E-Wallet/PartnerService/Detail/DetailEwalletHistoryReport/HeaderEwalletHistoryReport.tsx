import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  showFilter?: boolean;
  toggleFilter: () => void;
  title?: string;
}

const HeaderEwalletHistoryReport: React.FC<Props> = ({
  title,
  showFilter,
  toggleFilter,
  ...rest
}) => {
  const { t } = useTranslation('common');
  return (
    <div className='header-title-payment'>
      <div className='title-payment'>{t("Thanh toán dịch vụ Qrcode")}</div>
      <div className='box-btn-payment'>
        <button
          className={`btn btn-filter${showFilter ? '-active' : ''} mr-3`}
          onClick={() => toggleFilter()}>
          <img
            src={`/assets/img/Icon-filter${showFilter ? '_active.png' : '.png'}`}
            className='mr-2'
            alt=''></img>
          {showFilter ? t('Hide filter') : t('Filter')}
        </button>
      </div>
    </div>
  );
};

export default HeaderEwalletHistoryReport;
