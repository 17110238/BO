import React, { useState } from 'react';
import TabEmailSms from './TabEmailSms';


interface Props {
  tabActive? : number,
  merchantId? : any;
}


const EmailSmsContainer : React.FC<Props> = ({ tabActive, merchantId }) => {
  const [isShowFilter, setIsShowFilter] = useState<{
    emailSmsMerchant : boolean,
    emailSmsHistory : boolean
  }>({
    emailSmsMerchant : true,
    emailSmsHistory: true
  });


  return (
    <div className='merchant-container pt-1'>
      {/* <HeaderEmailSms
        isShowFilter={isShowFilter}
        onClickFilter={() => {
          setIsShowFilter(!isShowFilter);
        }}
      /> */}
      <TabEmailSms 
        isShowFilter={isShowFilter}
        tabActive={tabActive}
        merchantId={merchantId}
        onClickFilterMC={() => {
          setIsShowFilter({
            ...isShowFilter,
            emailSmsMerchant : !isShowFilter.emailSmsMerchant
          });
        }}
        onClickFilterHistory={() => {
          setIsShowFilter({
            ...isShowFilter,
            emailSmsHistory : !isShowFilter.emailSmsHistory
          });
        }}
      />
    </div>
  )
}

export default EmailSmsContainer