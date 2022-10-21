import React, { useState, useRef } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import { Router, useRouter } from 'next/router';
import POBOTransactionPageContainer from './POBOTransaction/POBOTransactionPageContainer';
import WithdrawalTransactionPageContainer from './WithdrawalTransaction/WithdrawalTransactionPageContainer';

interface Props {
  isShowFilter?: {
    emailSmsMerchant: boolean;
    emailSmsHistory: boolean;
  };
  onClickFilterMC?: () => void;
  onClickFilterHistory?: () => void;
  tabActive?: number;
}

const TabPOBOWithdraw: React.FC<Props> = ({ tabActive }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const WITHDRAW = 'WITHDRAW';
  const POBO = 'POBO';
  const [isActive, setIsActive] = useState<string>(POBO);
  const handleChangeTab = (tab: string) => {
    setIsActive(tab);
  };
  return (
    <div className='header-datatable-email-sms'>
      <Tabs defaultIndex={tabActive}>
        <TabList id='idTabListAc'>
          <div className='d-flex ' style={{ cursor: 'pointer' }}>
            <Tab
              onClick={() => {
                router.push('/cong-thanh-toan/dich-vu-chi-ho-rut-tien');
                handleChangeTab(POBO);
              }}
              className='p-2'>
              <p
                className={`${isActive === POBO ? 'font-weight-bold ' : ''} px-3`}
                onClick={() => {
                  handleChangeTab(POBO);
                }}>
                {t('Payments_on_behalf_management')}
              </p>
            </Tab>
            <Tab onClick={() => handleChangeTab(WITHDRAW)} className='p-2'>
              <p className={`${isActive === WITHDRAW ? 'font-weight-bold ' : ''} px-3`}>
                {t('Withdrawal_management')}
              </p>
            </Tab>
          </div>
        </TabList>
        <TabPanel>
          <POBOTransactionPageContainer />
        </TabPanel>
        <TabPanel>
          <WithdrawalTransactionPageContainer />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabPOBOWithdraw;
