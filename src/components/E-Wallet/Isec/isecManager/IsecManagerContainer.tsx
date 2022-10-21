import { EWalletManager, FilterSearchIsecManage, IsecEnum, PayloadSearchIsecManage } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListCodeIsecReport } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import HeaderIsecBlock from '../HeaderIsecBlock';
import BoxSearchIsecManager from './BoxSearchIsecManager';
import DatatableIsecManager from './DatatableIsecManager';

interface Props {
  isShowFilter: boolean;
}

const IsecManagerContainer: React.FC<Props> = ({ isShowFilter }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<FilterSearchIsecManage>({
    state: IsecEnum.PENDING,
  });
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [dataList, setDataList] = useState<EWalletManager[]>([]);

  const handleSubmitSearch = (data: FilterSearchIsecManage) => {
    setFilter(data);

    setSubmitForm(true);
  };

  const handleSearchSocialPay = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadSearchIsecManage = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(searchFilter: PayloadSearchIsecManage) {
      setLoadingTable(true);

      dispatch(
        getListCodeIsecReport(searchFilter, (state, res) => {
          setDataList(res);
          setLoadingTable(false);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm: submitForm,
    };
  };

  useEffect(() => {
    if (Object.keys(router?.query).length) {
      const query: any = clearFalsyObject({
        ...router.query,
        createdAt: {
          from: router?.query?.from as string,
          to: router?.query?.to as string,
        },
      });

      delete query.to;
      delete query.from;

      setFilter(query);
    }
    setSubmitForm(true);
  }, []);

  return (
    <>
      <div className='approval-merchant-container isec-container-manage'>
        {/* <HeaderIsecBlock
          isShowFilter={isShowFilter}
          onClickExport={() => {}}
          onClickFilter={() => {
            setIsShowFilter(!isShowFilter);
          }}
        /> */}
        <div className='box-payment'>
          {isShowFilter && (
            <BoxSearchIsecManager loading={loadingTable} handleSubmitSearch={handleSubmitSearch} />
          )}
          <DatatableIsecManager
            data={dataList}
            getDataList={handleSearchSocialPay}
            {...{ isLoading: loadingTable }}
          />
        </div>
      </div>
    </>
  );
};

export default IsecManagerContainer;
