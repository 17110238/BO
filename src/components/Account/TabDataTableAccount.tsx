// import DataTableTransaction from 'components/TransactionsPage/DataTableTransaction';
// import ContentInfoAccountMc from './InfoAccountMc/ContentInfoAccountMc';
import Nodata from 'components/common/NoData/Nodata';
import { LogsType, TransactionResponse } from 'models';
import { AccountMerchant } from 'models/account/accountMerchant';
import dynamic from 'next/dynamic';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { SearchParams } from './BoxSearchAccount';

const DataTableTransaction = dynamic(import('components/TransactionsPage/DataTableTransaction'));
const HistoryChangeAccountMc = dynamic(import('./HistoryChangeAccountMc/HistoryChangeAccountMc'));
const ContentInfoAccountMc = dynamic(import('./InfoAccountMc/ContentInfoAccountMc'));

interface TabDataAccountMcProps {
  // tabActive? : number;
  dataAccountList?: AccountMerchant[] | undefined;
  transactionList?: TransactionResponse[] | undefined;
  dataLoglist?: LogsType[] | undefined;
  handleToggleModalDetail?: () => void;
  t: (a: string) => string;
  dataSearch?: any;
  handleChangeSearch?: (data: SearchParams) => void;
  totalRow?: number;
  totalRowLogs?: number;
  getListLogs?: any;
  getListTran?: any;
  rest?: any;
  setSubmitForm: (a: any) => void;
  setTabActive: any;
}

const TabDataTableAccount: React.FC<TabDataAccountMcProps> = ({
  // tabActive,
  dataAccountList,
  transactionList,
  dataLoglist,
  setTabActive,
  // getAccountMc,
  handleChangeSearch,
  handleToggleModalDetail,
  t,
  getListLogs,
  getListTran,
  totalRowLogs,
  totalRow,
  dataSearch,
  setSubmitForm,
  ...rest
}) => {
  return (
    <div className='header-datatable-account-mc'>
      <Tabs defaultIndex={0}>
        <TabList id='idTabListAc'>
          <Tab
            onClick={() => {
              setSubmitForm(true);
              setTabActive(0);
            }}>
            <span>{t('Profiles')}</span>
          </Tab>
          <Tab
            onClick={() => {
              setSubmitForm(true);
              setTabActive(1);
            }}>
            <span>{t('Transaction history')}</span>
          </Tab>
          <Tab
            onClick={() => {
              setSubmitForm(true);
              setTabActive(2);
            }}>
            <span>{t('History changed')}</span>
          </Tab>
        </TabList>

        <TabPanel>
          {dataAccountList?.length ? (
            <ContentInfoAccountMc
              data={dataAccountList[0] || []}
              dataSearch={dataSearch}
              handleChangeSearch={handleChangeSearch}
              // getAccountMc={getAccountMc}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Nodata imageDataEmpty={'/assets/img/no-data.png'} messageDataEmpty={'No data'} />
            </div>
          )}
        </TabPanel>
        <TabPanel>
          <div style={{ margin: '50px 0' }}>
            <DataTableTransaction
              t={t}
              totalFilter={totalRow}
              // deleteDefault={true}
              data={transactionList ? transactionList : []}
              getDataList={getListTran}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <HistoryChangeAccountMc
            t={t}
            totalFilter={totalRowLogs}
            data={dataLoglist?.length ? dataLoglist : []}
            getListLogs={getListLogs}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabDataTableAccount;
