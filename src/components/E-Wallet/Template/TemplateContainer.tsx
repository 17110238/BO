import HeaderTemplate from 'components/E-Wallet/Template/HeaderTemplate';
import React, { useEffect, useState } from 'react';
import AddTemplate from './AddTemplate/AddTemplate';
import BoxSearchTemplate from './BoxSearchTemplate';
import DataTableTemplate from './DataTableTemplate';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SearchParams } from 'components/Template/BoxSearchTemplate';
import { EwalletTemplateBoType, GetEwalletTemplateInput } from 'models';
import { getListTemplateWallet } from 'redux/actions';

interface Props {}

const TemplateContainer: React.FC<Props> = ({}) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [filter, setFilter] = useState({});
  const [isShowAddModal, setShowAddModal] = useState<boolean>(false);
  const [templateList, setTemplateList] = useState<EwalletTemplateBoType[]>([]);
  const templateListEWallet = useSelector<any, EwalletTemplateBoType[]>(
    (state) => state?.templateReducer?.templateListWallet
  );

  const dispatch = useDispatch();

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleSubmitSearch = (data: SearchParams) => {
    if (!data.type) {
      delete data.type;
    }

    setFilter({ ...data });
    setSubmitForm(true)
  };


  const handleGetListTemplate = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetEwalletTemplateInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetListTemplate(payload: GetEwalletTemplateInput) {
      dispatch(
        getListTemplateWallet(payload, (status, res) => {
          if (status) {
            setTemplateList(res.data)
            setSubmitForm(false);
            setTotalRow(res?.data.length);
          }
        })
      );
    }
    return {
      payload,
      getList: handleGetListTemplate,
      submitForm
    };
  };

  return (
    <div className='template-manage-container'>
      <HeaderTemplate
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        onClickExport={() => {}}
        t={t}
        onClickOpenAddModal={() => setShowAddModal(true)}
      />
      <BoxSearchTemplate
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
        />
      <DataTableTemplate
        t={t}
        data={templateList}
        totalFilter={totalRow}
        getDataList={handleGetListTemplate}
        setSubmitForm={setSubmitForm}
      />
      <AddTemplate
        t={t}
        show={isShowAddModal}
        handleClose={() => setShowAddModal(false)}
        handleRefreshTemplateList={() => setSubmitForm(true)}
      />
    </div>
  );
};

export default TemplateContainer;
