import { EmailTemplateResponse, GetEmailTemplateInput, TransactionResponse } from 'models';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListTemplate } from 'redux/actions/templateActions';
import ModalAdd from './add/ModalAdd';
import BoxSearchTemplate, { SearchParams } from './BoxSearchTemplate';
import DataTableTemplate from './DataTableTemplate';
import HeaderTemplate from './HeaderTemplate';

interface Payload {
  filter: {
    method?: string | null;
    state?: string | null;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort: {
    createdAt: number;
  };
}

const TemplateManageContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  // const templateList = useSelector<any, EmailTemplateResponse[]>(
  //   (state) => state?.templateReducer?.templateList
  // );
  const [data, setData] = useState<EmailTemplateResponse[]>([]);
  const [filter, setFilter] = useState({});
  const [isShowAddModal, setShowAddModal] = useState<boolean>(false);

  const handleSubmitSearch = (data: SearchParams) => {
    if (!data.type) {
      delete data.type;
    }

    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleGetListTemplate = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetEmailTemplateInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetListTemplate(payload: GetEmailTemplateInput) {
      dispatch(
        getListTemplate(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            setData(res?.data);
            setTotalRow(res?.data.length);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetListTemplate,
      submitForm,
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
      {showFilter && (
        <BoxSearchTemplate
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
        />
      )}
      <DataTableTemplate
        t={t}
        data={data}
        totalFilter={totalRow}
        getDataList={() => handleGetListTemplate(0, 100)}
        setSubmitForm={setSubmitForm}
      />
      <ModalAdd
        t={t}
        show={isShowAddModal}
        handleClose={() => setShowAddModal(false)}
        handleRefreshTemplateList={() => setSubmitForm(true)}
      />
    </div>
  );
};

export default TemplateManageContainer;
