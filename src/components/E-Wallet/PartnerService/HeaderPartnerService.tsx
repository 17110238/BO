import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  showFilter?: boolean;
  toggleFilter: () => void;
}

const HeaderPartnerService: React.FC<Props> = ({ showFilter, toggleFilter }) => {
  const { t } = useTranslation('common');
  return (
    <div className='header-title-payment'>
      <div className='title-payment'>{t('Đối tác dịch vụ')}</div>
      <div className='box-btn-payment'>
        <button
          className={`btn btn-filter${showFilter ? '-active' : ''}`}
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

export default HeaderPartnerService;
