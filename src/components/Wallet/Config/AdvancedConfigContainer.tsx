import { GetSettingWalletAdvancePayload, SettingWalletAdvanceType } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getWalletSettingAdvanced } from 'redux/actions';
import alert from 'utils/helpers/alert';
import BoxSearchAdvancedConfig from './commons/AdvancedConfig/BoxSearchAdvancedConfig';
import DataTableAdvancedConfig from './commons/AdvancedConfig/DataTableAdvancedConfig';

const ModalUpdateSettingAdvance = dynamic(
  () => import('./commons/AdvancedConfig/ModalUpdateSettingAdvance'),
  {
    ssr: false,
  }
);

const AdvancedConfigContainer = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();

  const [settingList, setSettingList] = useState<SettingWalletAdvanceType[]>([]);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [filter, setFilter] = useState<{ key?: string }>({});
  const [settingSelected, setSettingSelected] = useState<SettingWalletAdvanceType>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [modalUpdate, setModalUpdate] = useState<boolean>(false);

  const handleSubmitSearch = (data: { key?: string }) => {
    setFilter(data);
    router.replace({
      query: data,
    });
    setSubmitForm(true);
  };

  const handleSearchData = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetSettingWalletAdvancePayload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    const getList = (payload: GetSettingWalletAdvancePayload) => {
      dispatch(
        getWalletSettingAdvanced(payload, (state, res) => {
          setSubmitForm(false);
          if (state) {
            setSettingList(res.data);
            setTotalRow(res.totalRow);
          } else {
            alert('error', res?.message, t);
          }
        })
      );
    };
    return {
      payload,
      getList,
      submitForm,
    };
  };

  const handleRowSelected = (data: SettingWalletAdvanceType) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
      setSettingSelected(data);
      setModalUpdate(true);
    };

    return result;
  };

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      setFilter(router.query);
    }
    setSubmitForm(true);
  }, []);

  return (
    <>
      <button className='btn btn-back btn-back-system-config' onClick={() => router.back()}>
        <i className='fas fa-arrow-left btn-back__icon'></i>Trở về
      </button>
      <div className='system-config-container advanced-config-container'>
        <div className='advanced-config-container__header-block'>
          {t('Cấu hình hệ thống nâng cao')}
        </div>
        <BoxSearchAdvancedConfig onSubmitForm={handleSubmitSearch} />
        <DataTableAdvancedConfig
          t={t}
          data={settingList}
          getDataList={handleSearchData}
          totalFilter={totalRow}
          handleClickRow={handleRowSelected}
          {...{ isLoading: submitForm }}
        />
      </div>
      <ModalUpdateSettingAdvance
        show={modalUpdate}
        onHide={(type?: string) => {
          setModalUpdate(false);
          type === 'RESET_LIST' && setSubmitForm(true);
        }}
        data={settingSelected}
      />
    </>
  );
};

export default AdvancedConfigContainer;
