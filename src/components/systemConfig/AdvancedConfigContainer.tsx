import { PayloadGetSettingSystem, SettingSystemType } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getAdvancedConfig } from 'redux/actions';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchAdvancedConfig from './commons/AdvancedConfig/BoxSearchAdvancedConfig';
import DataTableAdvancedConfig from './commons/AdvancedConfig/DataTableAdvancedConfig';

const ModalUpdateSettingSystem = dynamic(() => import('./modals/ModalUpdateSettingSystem'), {
  ssr: false,
});

const AdvancedConfigContainer = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();

  const [settingList, setSettingList] = useState<SettingSystemType[]>([]);
  const [filter, setFilter] = useState<{ key?: string }>({});
  const [settingSelected, setSettingSelected] = useState<SettingSystemType>();
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [modalUpdate, setModalUpdate] = useState<boolean>(false);
  const [loadingTable, setLoaingTable] = useState<boolean>(false);

  const handleSubmitSearch = (data: { key?: string }) => {
    setFilter(data);

    setRefreshList(true);
  };

  const handleSearchData = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadGetSettingSystem = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: -1,
      },
    };

    const getList = (payload: PayloadGetSettingSystem) => {
      setLoaingTable(true);
      dispatch(
        getAdvancedConfig(payload, (state, res) => {
          setSettingList(res.data);
          setRefreshList(false);
          setLoaingTable(false);
        })
      );
    };
    return {
      payload,
      getList,
      submitForm: refreshList,
    };
  };

  const handleRowSelected = (data: SettingSystemType) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
      setSettingSelected(data);
      setModalUpdate(true);
    };

    return result;
  };

  useEffect(() => {
    if (Object.keys(router.query).length) {
      const filter = clearFalsyObject({
        key: router.query?.key as string,
      });
      setFilter(filter);
    }
    setRefreshList(true);
  }, []);

  return (
    <>
      <button
        className='btn btn-back btn-back-system-config'
        onClick={() => {
          router.push('/cong-thanh-toan/he-thong');
        }}>
        <i className='fas fa-arrow-left btn-back__icon'></i>Trở về
      </button>
      <div className='system-config-container advanced-config-container'>
        <div className='advanced-config-container__header-block'>
          {t('Cấu hình hệ thống nâng cao')}
        </div>
        <BoxSearchAdvancedConfig loading={loadingTable} onSubmitForm={handleSubmitSearch} />
        <DataTableAdvancedConfig
          data={settingList}
          getDataList={handleSearchData}
          handleClickRow={handleRowSelected}
          {...{ isLoading: loadingTable }}
        />
      </div>
      <ModalUpdateSettingSystem
        show={modalUpdate}
        onHide={(type?: string) => {
          setModalUpdate(false);
          type === 'RESET_LIST' && setRefreshList(true);
        }}
        data={settingSelected}
      />
    </>
  );
};

export default AdvancedConfigContainer;
