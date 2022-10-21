import React, { useState, useRef } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import 'react-tabs/style/react-tabs.css';

const Decentralization = dynamic(import('./decentralization/Decentralization'));

interface Props {
  isShowFilter?: {
    walletHistory: boolean;
    transactionHistory: boolean;
    transactionReport: boolean;
    session: boolean;
  };
  onClickFilterWalletHistory?: () => void;
  onClickFilterTransactionHistory?: () => void;
  onClickFilterTransactionReport?: () => void;
  onClickFilterSession?: () => void;
  onHide: () => void;
  tabActive: number;
  merchantId?: any;
}

const TabConfigAccount: React.FC<Props> = ({ tabActive, onHide }) => {
  const { t } = useTranslation('common');

  return (
    <div className='tab-merchant-info-container'>
      <Tabs defaultIndex={tabActive}>
        <TabList id='idTabListAc'>
          <div className='d-flex '>
            <Tab>
              <span style={{ fontWeight: `${tabActive === 0 ? 'bold' : ''}` }}>
                {t('Phân quyền')}
              </span>
            </Tab>
          </div>
        </TabList>
        <TabPanel>
          <Decentralization onHide={onHide} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabConfigAccount;
