import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {}

const HeaderEmailSmsHistory: React.FC<Props> = ({}) => {
  const { t } = useTranslation('common');
  return (
    <div className='header-merchant-container'>
      <p className='header-merchant__title'>{t('Lịch sử Email-sms ')}</p>
      {/* <div className='header-merchant__btn-group'>
        <button className='btn btn-secondary btn-search'>
          <i className='fa fa-plus mr-0' style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div> */}
    </div>
  );
};

export default HeaderEmailSmsHistory;
