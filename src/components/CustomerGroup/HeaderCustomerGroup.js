import React from 'react';
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function HeaderCustomerGroup({ onShowAddCustomerGroup, isCreateCustomerGroup }) {
  const { t } = useTranslation('common');
  return (
    <div className='header-customer__group'>
      <Tabs defaultIndex={1}>
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
      <div className='customer-group__action d-flex align-items-center justify-content-end'>
        {isCreateCustomerGroup && (
          <button className='btn btn-primary btn-invite' onClick={onShowAddCustomerGroup}>
            <i className='fas fa-plus mr-2'></i>
            {t('New Customer Group')}
          </button>
        )}
      </div>
    </div>
  );
}
