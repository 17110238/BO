import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { FilterLoginHistory, InputLoginHistory, LoginHistoryTypes } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';




const queryGraphql: string = `subscription subExportLoginHistory {
SubExport{
  SubExportExcel{
      message
      succeeded
      type
      accountId
      url
      data
    }
  }
}`;
export default function LoginHistoryContainer() {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { t } = useTranslation('common');
  const { reset, control, handleSubmit, formState, register } = useForm<any>({});
  const [totalRow, setTotalRow] = useState<number>(0);
  const [listData, setListData] = useState<Array<LoginHistoryTypes>>([]);
  const [submitForm, setSubmitForm] = useState(false);
  const [filter, setFilter] = useState<FilterLoginHistory>({});
  const [loadingExport, setLoadingExport] = useState(false);
  
  const listBlock = [
    'http://betmomo.club/',
    'http://www/dlthanglong.com/',
    'https://chanle247.com/',
    'https://chanlemomo.win/',
    'https://chanletaixiu.net/',
    'https://cltxuytin.win/',
    'https://momo10s.com/',
    'https://momoloto.club/',
    'http://x102.net/',
    'http://taixiumomo.com/',
    'http://CLMM247.COM',
    'http://MOMO5S.COM',
    'vn88.com',
    'www.vananh.vip',
    'https ://llbet.com/vn',
    'https ://www.138betviet.com/',
    'https://www.letoul.com/vn',
    'https://www.fb88.com',
    'https://www.gdwviet.eom/vi/index.htm',
    'https ://www. 12betng.com',
    'https://www.vwin152.com',
    'https://www.cmd368.com/',
    'https://www.happyluke.com/vi',
    'https://vn.k8.com',
    'https://www.ms3388.com/Mai n/Home.aspx',
    'https://qql88p.com',
    'https://www.w88pro.com',
    'https://www, 188bet.com/vi-vn',
    'https://www.fiin88asia.com/vn /home.htm',
  ]

  return (
    <>
      {loadingExport && <LoadingFullScreen />}
      <div className='loginHistory-container'>
        {/* <LoginHistoryHeader
          t={t}
          control={control}
          formState={formState}
          handleSubmit={handleSubmit}
          handleSearchLoginHistory={handleSearchLoginHistory}
          register={register}
          reset={reset}
          handleExportFile={handleExportFile}
        /> */}
        <div className='loginHistory-header'>
        <div className='loginHistory-header__title'>
          <h3>{t('Danh sách website bị chặn')}</h3>
        </div>
        <div className='loginHistory-header__filter'>
          
        </div>
      </div>
        
        <div className='loginHistory-content' style={{padding: '25px'}}>
        {listBlock.map((item) => {
          return (<div>{item}</div>);
        })}
        
          {/* <LoginHistoryDatatable
            t={t}
            totalRow={totalRow}
            data={listData}
            getDataList={getDataList}
          /> */}
        </div>
      </div>
    </>
  );
}
