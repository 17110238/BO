import React, { useState, useRef } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import 'react-tabs/style/react-tabs.css';
// import ModalCreateEmailSms from './Email-sms-config/ModalCreateEmailSms';
import { EmailSmsProductReponse } from 'models/emailSms/emailSms';
import { Router, useRouter } from 'next/router';

const InfoContainer = dynamic(import('./Info/InfoContainer'));
const LinkedBankContainer = dynamic(import('./LinkedBank/LinkedBankContainer'));
const WalletHistoryContainer = dynamic(import('./WalletHistory/WalletHistoryContainer'));
const TransactionHistoryContainer = dynamic(import('./TransactionHistory/TransactionHistoryContainer'));
const TransactionReportContainer = dynamic(import('./TransactionReport/TransactionReportContainer'));
const SessionContainer = dynamic(import('./Session/SessionContainer'));
const ChangeHistoryContainer = dynamic(import('./ChangeHistory/ChangeHistoryContainer'));

interface Props {
  isShowFilter?: {
    walletHistory: boolean;
    transactionHistory: boolean;
    transactionReport: boolean;
    session: boolean;
  };
  parentSubmit: boolean;
  onClickFilterWalletHistory?: () => void;
  onClickFilterTransactionHistory?: () => void;
  onClickFilterTransactionReport?: () => void;
  onClickFilterSession?: () => void;
 
  // tabActive: number;
}

const TabMerchantInfo: React.FC<Props> = ({
  isShowFilter,
  onClickFilterWalletHistory,
  onClickFilterTransactionHistory,
  onClickFilterTransactionReport,
  onClickFilterSession,
  parentSubmit,
  // tabActive,
}) => {
  const { t } = useTranslation('common');
  const [index, setIndex] = useState<number>(0);
  const [isShow, setIsShow] = useState<boolean>(false);
  const onHide = () => setIsShow(false);
  const router = useRouter();
  const [tabActive, setTabActive] = useState<number>(0);

  const getFilter = (tabActive: number) => {
    switch (tabActive) {
      case 2:
        return {
          show: isShowFilter?.walletHistory,
          handler: onClickFilterWalletHistory,
        };
      case 3:
        return {
          show: isShowFilter?.transactionHistory,
          handler: onClickFilterTransactionHistory,
        };
      case 4:
        return {
          show: isShowFilter?.transactionReport,
          handler: onClickFilterTransactionReport,
        };
      case 5:
        return {
          show: isShowFilter?.session,
          handler: onClickFilterSession,
        };
    }
  };

  const getExtraButton = (tabActive: number) => {
    if ([2, 3, 4, 5].includes(tabActive)) {
      return 'filter';
    } else if (tabActive === 0) {
      return 'manipulation';
    } else {
      return '';
    }
  };

  return (
    <div className='tab-merchant-info-container'>
      <Tabs
        defaultIndex={tabActive}
        // onSelect={(number, lastIndex, event) => {
        //   setIndex(number);
        // }}
      >
        <TabList id='idTabListAc'>
          <div className='d-flex '>
            <Tab onClick={() => setTabActive(0)}>
              <span style={{ fontWeight: `${tabActive === 0 ? 'bold' : ''}` }}>
                {t('Thông tin KH')}
              </span>
            </Tab>
            <Tab onClick={() => setTabActive(1)}>
              <span style={{ fontWeight: `${tabActive === 1 ? 'bold' : ''}` }}>
                {t('NH liên kết')}
              </span>
            </Tab>
            <Tab onClick={() => setTabActive(2)}>
              <span style={{ fontWeight: `${tabActive === 2 ? 'bold' : ''}` }}>
                {t('Lịch sử ví')}
              </span>
            </Tab>
            <Tab onClick={() => setTabActive(3)}>
              <span style={{ fontWeight: `${tabActive === 3 ? 'bold' : ''}` }}>
                {t('Lịch sử GD')}
              </span>
            </Tab>
            <Tab onClick={() => setTabActive(4)}>
              <span style={{ fontWeight: `${tabActive === 4 ? 'bold' : ''}` }}>
                {t('Báo cáo GD')}
              </span>
            </Tab>
            <Tab onClick={() => setTabActive(5)}>
              <span style={{ fontWeight: `${tabActive === 5 ? 'bold' : ''}` }}>
                {t('Phiên đăng nhập')}
              </span>
            </Tab>
            <Tab onClick={() => setTabActive(6)}>
              <span style={{ fontWeight: `${tabActive === 6 ? 'bold' : ''}` }}>
                {t('Lịch sử thay đổi')}
              </span>
            </Tab>
          </div>
          {getExtraButton(tabActive) === 'filter' && (
            <div
              className='header-merchant__btn-group btn-filter-search'
              style={{ whiteSpace: 'nowrap', marginLeft: '25px' }}>
              <button
                className={`filter-btn btn ${getFilter(tabActive)?.show ? 'btn-active' : ''}`}
                onClick={getFilter(tabActive)?.handler}>
                <svg
                  width='14'
                  height='12'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ transition: 'all 0.3s' }}>
                  <path
                    d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                    fill={getFilter(tabActive)?.show ? '#00BE00' : '#647081'}
                    fillRule='evenodd'></path>
                </svg>
                {t(['Filter', 'Hide filter'][+(getFilter(tabActive)?.show || 0)])}
              </button>
            </div>
          )}
        </TabList>
        <TabPanel>
          {/* <EmailSmsConfigContainer isShow={isShow} onHide={onHide} /> */}
          <InfoContainer />
        </TabPanel>
        <TabPanel>
          <LinkedBankContainer parentSubmit={parentSubmit} />
        </TabPanel>
        <TabPanel>
          <WalletHistoryContainer parentSubmit={parentSubmit} isShowFilter={isShowFilter?.walletHistory} />
        </TabPanel>
        <TabPanel>
          <TransactionHistoryContainer parentSubmit={parentSubmit} isShowFilter={isShowFilter?.transactionHistory} />
        </TabPanel>
        <TabPanel>
          <TransactionReportContainer parentSubmit={parentSubmit} isShowFilter={isShowFilter?.transactionReport} />
        </TabPanel>
        <TabPanel>
          <SessionContainer parentSubmit={parentSubmit} isShowFilter={isShowFilter?.session} />
        </TabPanel>
        <TabPanel>
          <ChangeHistoryContainer parentSubmit={parentSubmit} />
        </TabPanel>
      </Tabs>
      {/* <ModalCreateEmailSms show={isShow} onHide={onHide} /> */}
    </div>
  );
};

export default TabMerchantInfo;
