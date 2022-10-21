import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Nodata({ imageDataEmpty = '', messageDataEmpty = '', style = {} }) {
  const { t } = useTranslation('common');
  return (
    <div className='no-data-table text-center' style={{ padding: '150px 0', ...style }}>
      <img src={imageDataEmpty ? imageDataEmpty : '/assets/img/no-data.png'}></img>
      <span className='d-block' style={{ marginLeft: -10, paddingTop: '25px', color: '#a5aeb8' }}>
        {messageDataEmpty ? t(messageDataEmpty) : t('No data')}
      </span>
    </div>
  );
}
