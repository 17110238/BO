import React, { useState, useRef } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import 'react-tabs/style/react-tabs.css';
import ModalCreateEmailSms from './Email-sms-config/ModalCreateEmailSms';
import { EmailSmsProductReponse } from 'models/emailSms/emailSms';
import { Router, useRouter } from 'next/router';
const EmailSmsConfigContainer = dynamic(import('./Email-sms-config/EmailSmsConfigContainer'));
const EmailSmsHistoryContainer = dynamic(import('./Email-sms-history/EmailSmsHistoryContainer'));
const EmailSmsMCContainer = dynamic(import('./Email-sms-merchant/EmailSmsMCContainer'));

interface Props {
  isShowFilter?: {
    emailSmsMerchant: boolean;
    emailSmsHistory: boolean;
  };
  onClickFilterMC?: () => void;
  onClickFilterHistory?: () => void;
  tabActive?: number;
  merchantId? : any;
}

const TabEmailSms: React.FC<Props> = ({
  isShowFilter,
  onClickFilterMC,
  onClickFilterHistory,
  tabActive,
  merchantId
}) => {
  const { t } = useTranslation('common');
  const [index, setIndex] = useState<number>(0);
  const [isShow, setIsShow] = useState<boolean>(false);
  const onHide = () => setIsShow(false);
  const router = useRouter()
  return (
    <div className='header-datatable-email-sms'>
      <Tabs
        defaultIndex={tabActive}
        // onSelect={(number, lastIndex, event) => {
        //   setIndex(number);
        // }}
      >
        <TabList id='idTabListAc'>
          <div className='d-flex '>
            <Tab style={{padding : '0px'}} onClick={() => {
              router.push('/cong-thanh-toan/email-sms/quan-ly')
            }}>
              <span style={{ fontWeight : `${tabActive === 0 ? 'bold' : '' }` }}>{t('Gói Email-SMS')}</span>
            </Tab>
            <Tab style={{padding : '0px'}} onClick={() => {}}>
              <Link href='/cong-thanh-toan/email-sms/mc'>
                <span style={{ fontWeight : `${tabActive === 1 ? 'bold' : '' }` }}>{t('SMS & Email Merchant')}</span>
              </Link>
            </Tab>
            <Tab style={{padding : '0px'}} onClick={() => {}}>
              <Link href='/cong-thanh-toan/email-sms/lich-su'>
                <span style={{ fontWeight : `${tabActive === 2 ? 'bold' : '' }` }}>{t('Lịch sử')}</span>
              </Link>
            </Tab>
          </div>
          {tabActive == 0 ? (
            <div className='d-flex' style={{ whiteSpace : 'nowrap'}}>
              <button className='btn btn-secondary btn-search' style={{ width : '35px', height: '35px'}} onClick={() => setIsShow(true)}>
                <i className='fa fa-plus mr-0' style={{ fontSize: '1.5rem' }}></i>
              </button>
            </div>
          ) : (
            <div className='header-merchant__btn-group btn-filter-search' style={{ whiteSpace : 'nowrap', marginLeft: '25px'}}>
              <button
                className={`filter-btn btn ${
                  (tabActive == 1 ? isShowFilter?.emailSmsMerchant : isShowFilter?.emailSmsHistory)
                    ? 'btn-active'
                    : ''
                }`}
                onClick={tabActive == 1 ? onClickFilterMC : onClickFilterHistory}>
                <svg
                  width='14'
                  height='12'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ transition: 'all 0.3s' }}>
                  <path
                    d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                    fill={
                      (
                        tabActive == 1
                          ? isShowFilter?.emailSmsMerchant
                          : isShowFilter?.emailSmsHistory
                      )
                        ? '#00BE00'
                        : '#647081'
                    }
                    fillRule='evenodd'></path>
                </svg>
                {t(
                  ['Filter', 'Hide filter'][
                    +(
                      (tabActive == 1
                        ? isShowFilter?.emailSmsMerchant
                        : isShowFilter?.emailSmsHistory) || 0
                    )
                  ]
                )}
              </button>
            </div>
          )}
        </TabList>
        <TabPanel>
          <EmailSmsConfigContainer isShow={isShow} onHide={onHide} />
        </TabPanel>
        <TabPanel>
          <EmailSmsMCContainer merchantId={merchantId} isShowFilter={isShowFilter?.emailSmsMerchant} />
        </TabPanel>
        <TabPanel>
          <EmailSmsHistoryContainer isShowFilter={isShowFilter?.emailSmsHistory} />
        </TabPanel>
      </Tabs>
      {/* <ModalCreateEmailSms show={isShow} onHide={onHide} /> */}
    </div>
  );
};

export default TabEmailSms;
