import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import HeaderSocialBlock from '../HeaderSocialBlock';
import BoxAutoSearchSocialPay from './BoxSearchSocialLink';
import DataTableSocialPay from './DatatableSocialLink';
const SocialLinkContainer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    state: 'PENDING',
  });
  const [loadingTable, setLoadingTable] = useState<boolean>(true);

  const handleSubmitSearch = (data: any) => {
    setFilter(data);
  };

  const handleSearchSocialPay = (start?: number, limit?: number, sort?: {}) => {
    const payload = {};

    function getList(payload: any) {}

    return {
      payload,
      getList,
    };
  };

  useEffect(() => {
    setTimeout(function () {
      setLoadingTable(false);
    }, 3000);
  }, []);

  return (
    <>
      <div className='approval-merchant-container'>
        <HeaderSocialBlock
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        />
        <div className='box-payment'>
          {isShowFilter && <BoxAutoSearchSocialPay handleSubmitSearch={handleSubmitSearch} />}
          <DataTableSocialPay
            t={t}
            data={[]}
            getDataList={handleSearchSocialPay}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
    </>
  );
};

export default SocialLinkContainer;
