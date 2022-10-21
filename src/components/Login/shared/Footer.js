import React from 'react';
import { useTranslation } from 'react-i18next';
import DropdownLanguage from './DropdownLanguage';

function Footer() {
  const { t } = useTranslation('common');
  return (
    <div className='footer'>
      {/* <a href="https://merchant.payme.vn" target="_blank" rel="noreferrer">
        © PayME Merchant
      </a>
      <i className="dot" /> */}
      <a href='https://payme.vn/web/contact' target='_blank' rel='noreferrer'>
        {t('Contact')}
      </a>
      <i className='dot' />
      <a
        href='https://payme.vn/web/pages/chinh-sach-bao-mat-payme'
        target='_blank'
        rel='noreferrer'>
        {t('Privacy & terms')}
      </a>
      <DropdownLanguage />
    </div>
  );
}

export default Footer;
