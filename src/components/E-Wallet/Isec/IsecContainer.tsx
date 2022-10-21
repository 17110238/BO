import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TabList, TabPanel, Tabs, Tab } from 'react-tabs';
import IsecManagerContainer from './isecManager/IsecManagerContainer';
import IsecReportContainer from './isecReport/IsecReportContainer';
import IsecReportTransactionContainer from './isecReportTransaction/IsecReportTransactionContainer';

interface Props {
  activeTab?: number;
}

interface scopeUserProps {
  scope: string[];
}

const IsecContainer: React.FC<Props> = ({ activeTab }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);

  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);

  const renderTabs = useCallback(() => {
    const tabs: any[] = [];
    const tabPanels: any[] = [];
    accountInfo.scope.includes('bo.ewalletIsecReportBo.getListCode') &&
      (tabs.push(
        <Tab key={1} onClick={() => router.push('/vi-dien-tu/quan-ly-isec')}>
          <span>Quản lý</span>
        </Tab>
      ),
      tabPanels.push(
        <TabPanel key={1}>
          <IsecManagerContainer isShowFilter={isShowFilter} />
        </TabPanel>
      ));
    accountInfo.scope.includes('bo.ewalletIsecReportBo.reportByDayIsec') &&
      (tabs.push(
        <Tab key={2} onClick={() => router.push('/vi-dien-tu/quan-ly-isec/bao-cao-ngay')}>
          <span>Báo cáo</span>
        </Tab>
      ),
      tabPanels.push(
        <TabPanel key={2}>
          <IsecReportContainer isShowFilter={isShowFilter} />
        </TabPanel>
      ));
    accountInfo.scope.includes('bo.ewalletIsecReportBo.searchIsecBulk') &&
      (tabs.push(
        <Tab key={3} onClick={() => router.push('/vi-dien-tu/quan-ly-isec/bao-cao-giao-dich')}>
          <span>Giao dịch</span>
        </Tab>
      ),
      tabPanels.push(
        <TabPanel key={3}>
          <IsecReportTransactionContainer isShowFilter={isShowFilter} />
        </TabPanel>
      ));

    return {
      tabs,
      tabPanels,
    };
  }, [isShowFilter]);

  const tabs = renderTabs();

  return (
    <Tabs className='custom-ui-react-tab react-tabs isec-container' defaultIndex={activeTab || 0}>
      <TabList id='idTabListAc'>
        <div className='d-flex' style={{ cursor: 'pointer' }}>
          {tabs.tabs.map((tab) => tab)}
        </div>
        <div className='react-tabs__actions-group'>
          <button
            className={`filter-btn btn ${isShowFilter ? 'btn-active' : ''}`}
            onClick={() => {
              setIsShowFilter(!isShowFilter);
            }}
            style={{ minWidth: 100 }}>
            <svg
              width='14'
              height='12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ transition: 'all 0.3s' }}>
              <path
                d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                fill={isShowFilter ? '#00BE00' : '#647081'}
                fillRule='evenodd'></path>
            </svg>
            {t(['Filter', 'Hide filter'][+(isShowFilter || 0)])}
          </button>
        </div>
      </TabList>
      {tabs.tabPanels.map((tabPanel) => tabPanel)}
    </Tabs>
  );
};

export default IsecContainer;
