import Link from 'next/link';
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next';
const TopTransactionHeader = () => {
  const { t } = useTranslation('common');
  return (
    <div className='topTransaction-header'>
      <div className='topTransaction-header__content'>
        <div className='topTransaction-header__title'>
          <h2>{t(' TOP TOP')}</h2>
        </div>
        <div className='topTransaction-header__filter' style={{ height: '44px' }}>
          <Link href='/payme/monitor/topTransaction/advance'>
          <button >
            {t("Thống kê nâng cao")}
            </button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(TopTransactionHeader)

