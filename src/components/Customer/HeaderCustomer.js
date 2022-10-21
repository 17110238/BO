import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function HeaderCustomer({
  onShowAddCustomer,
  isCreateCustomer,
  isFilter,
  openFilter,
}) {
  const { t } = useTranslation('common');
  return (
    <div className='header-customer'>
      <Tabs defaultIndex={0}>
        <TabList>
          <Tab>
            <Link href='/transaction/customer' passHref>
              <a className='title-payment'>{t('Customer')}</a>
            </Link>
          </Tab>
          <Tab>
            <Link href='/transaction/customer-group' passHref>
              <a className='title-payment'>{t('Customer Group')}</a>
            </Link>
          </Tab>
        </TabList>
        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
      </Tabs>
      <div className='customer-action d-flex align-items-center'>
        <a className='a-export mr-3 '>
          <img src='/assets/img/customer/upload-big-arrow.png' />
          {t('Export')}
        </a>
        <a className='a-export mr-3'>
          <img src='/assets/img/customer/group-2.png' />
          {t('Import')}
        </a>
        <button className='customer-filter__btn' onClick={openFilter}>
          <img src='/assets/img/customer/icon.svg' alt='' />
          <span className='customer-filter__title show'>
            {isFilter ? t('Hide Filter') : t('Show Filter')}
          </span>
        </button>
        {isCreateCustomer && (
          <button className='btn btn-primary btn-invite' onClick={onShowAddCustomer}>
            <i className='fas fa-plus mr-2'></i>
            {t('New Customer')}
          </button>
        )}
      </div>
    </div>
  );
}
