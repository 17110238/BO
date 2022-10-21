import React from 'react';
import { useTranslation } from 'react-i18next';

function NoDataV2() {
  const { t } = useTranslation('common');
  return (
    <div className='d-flex align-items-center justify-content-center flex-column'>
      <img src='/assets/img/no_data_v2.png' alt='' />
      <p className='fs-15 color-silver-64'>{t('No data')}</p>
    </div>
  );
}

export default NoDataV2;
