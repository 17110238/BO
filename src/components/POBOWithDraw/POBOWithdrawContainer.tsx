import React, { useState, useEffect } from 'react';
import TabPOBOWithdraw from './TabPOBOWithdraw';

const POBOWithdrawContainer: React.FC = () => {
  const [isShowFilter, setIsShowFilter] = useState<{
    emailSmsMerchant: boolean;
    emailSmsHistory: boolean;
  }>({
    emailSmsMerchant: false,
    emailSmsHistory: false,
  });

  const tabActive = 0;

  return (
    <div className='merchant-container pt-1'>
      <TabPOBOWithdraw
        isShowFilter={isShowFilter}
        tabActive={tabActive}
        onClickFilterMC={() => {
          setIsShowFilter({
            ...isShowFilter,
            emailSmsMerchant: !isShowFilter.emailSmsMerchant,
          });
        }}
        onClickFilterHistory={() => {
          setIsShowFilter({
            ...isShowFilter,
            emailSmsHistory: !isShowFilter.emailSmsHistory,
          });
        }}
      />
    </div>
  );
};

export default POBOWithdrawContainer;
