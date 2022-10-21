import useElementSize from 'hook/useElementSize';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BoxSearch, { SearchParams } from './BoxSearch';
import DataTable from './DataTable';
import Header from './Header';
import _ from 'lodash';
import {
  createMCScope,
  deleteMCScope,
  getListMCScope,
  updateMCScope,
} from 'redux/actions/scopeAction';
import { CreateScopeMCInput, DeleteScopeBoInput, Scope, UpdateScopeMCInput } from 'models/scope';
import { getListRoleAccountMc } from 'redux/actions';
import UpdateScopeModal from './Modal/UpdateScope';
import DeleteScopeModal from './Modal/DeleteScope';
import CreateScopeModal from './Modal/CreateScope';
import alert from 'utils/helpers/alert';
import { GetListMCScopeInput } from 'models';

const Container: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [mcScopeList, setMCScopeList] = useState<Scope[]>([]);
  const [filter, setFilter] = useState({});
  const [squareRef, { width, height }] = useElementSize();
  const [listScopeGroup, setListScopeGroup] = useState<any>([]);
  const [isShowUpdateModal, setIsShowUpdateModal] = useState<boolean>(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);
  const [isShowCreateModal, setIsShowCreateModal] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const UPDATE = 'UPDATE';
  const DELETE = 'DELETE';
  const initScopeObj = {
    id: '',
    scope: '',
    service: '',
    description: '',
    group: [],
  };
  const [scopeObj, setScopeObj] = useState<Scope>(initScopeObj);

  const handleSubmitSearch = (data: SearchParams) => {
    let newDataFilter: any = {
      group: data.group === t('ALL') ? '' : data.group,
      [data.type]: data?.search && data.search.trim(),
    };

    for (let key in newDataFilter) {
      if (newDataFilter.hasOwnProperty(key)) {
        if (!newDataFilter[key]) {
          delete newDataFilter[key];
        }
      }
    }
    setFilter({ ...newDataFilter });
    setSubmitForm(true);
  };

  const handleGetListMCScope = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetListMCScopeInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetListMCScope(payload: GetListMCScopeInput) {
      setLoading(true);
      dispatch(
        getListMCScope(payload, (status, res) => {
          setSubmitForm(false);
          setMCScopeList(res);
          setLoading(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetListMCScope,
      submitForm,
    };
  };

  useEffect(() => {
    dispatch(
      getListRoleAccountMc((status, listScope) => {
        if (status) {
          let scopeMCArray: any = [];
          listScope.map((scope: any) => {
            let scopeObj: any = {};
            scopeObj.value = scope.key;
            scopeObj.label = scope.name;
            scopeMCArray.push(scopeObj);
          });
          setListScopeGroup(scopeMCArray);
        }
      })
    );
  }, []);

  const handleShowCreateScopeModal = () => {
    setIsShowCreateModal(true);
  };

  const hideCreateModal = () => {
    setIsShowCreateModal(false);
  };

  const handleOpenModal = (modalOpen: string, data: Scope) => {
    if (data.group === null) {
      setScopeObj({ ...data, group: [] });
    } else {
      setScopeObj(data);
    }
    modalOpen === UPDATE ? setIsShowUpdateModal(true) : setIsShowDeleteModal(true);
  };

  const createNewScope = (payload: CreateScopeMCInput) => {
    const _payload = {
      scope: payload.scope,
      group: scopeObj.group,
      description: payload.description,
      service: payload.service,
    };
    setLoading(true);
    dispatch(
      createMCScope(_payload, (status, data) => {
        if (status) {
          alert('success', data.message, t);
          hideCreateModal();
          setSubmitForm(true);
        } else {
          alert('error', data.message, t);
        }
        setLoading(false);
      })
    );
  };

  const EditScope = (payload: UpdateScopeMCInput) => {
    const _payload = {
      id: +payload.id,
      group: scopeObj.group,
      description: payload.description,
      service: payload.service,
    };
    setLoading(true);
    dispatch(
      updateMCScope(_payload, (status, data) => {
        if (status) {
          alert('success', data.message, t);
          hideUpdateModal();
          setSubmitForm(true);
        } else {
          alert('error', data.message, t);
        }
        setLoading(false);
      })
    );
  };

  const handleDeleteScope = (payload: DeleteScopeBoInput) => {
    setLoading(true);
    dispatch(
      deleteMCScope(payload, (status, data) => {
        if (status) {
          alert('success', data.message, t);
          hideDeleteModal();
          setSubmitForm(true);
        } else {
          alert('error', data.message, t);
        }
        setLoading(false);
      })
    );
  };

  const removeScopeGroupItem = (groupItem: string) => {
    const filteredItem = scopeObj.group.findIndex((item: string) => item === groupItem);
    scopeObj.group.splice(filteredItem, 1);
    setScopeObj({ ...scopeObj, group: scopeObj.group });
  };

  const addScopeGroupItem = (groupItem: string) => {
    if (scopeObj.group) {
      scopeObj.group.push(groupItem);
    }
    setScopeObj({ ...scopeObj, group: scopeObj.group });
  };

  const hideDeleteModal = () => {
    setIsShowDeleteModal(false);
    setScopeObj(initScopeObj);
  };

  const hideUpdateModal = () => {
    setIsShowUpdateModal(false);
    setScopeObj(initScopeObj);
  };

  return (
    <div className='box-content scope-dashboard-container'>
      <Header
        showFilter={showFilter}
        toggleFilter={toggleFilter}
        t={t}
        setSubmitForm={setSubmitForm}
        handleShowCreateScopeModal={handleShowCreateScopeModal}
      />
      {showFilter && (
        <BoxSearch
          t={t}
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
          filter={filter}
          listScopeGroup={listScopeGroup}
          isLoading={isLoading}
        />
      )}
      <DataTable
        t={t}
        data={mcScopeList}
        getDataList={handleGetListMCScope}
        setSubmitForm={setSubmitForm}
        heightBoxSearch={height + 1}
        handleOpenModal={handleOpenModal}
        listScopeGroup={listScopeGroup}
        isLoading={isLoading}
      />

      <CreateScopeModal
        defaultValue={scopeObj}
        onSubmit={createNewScope}
        editScopeGroup={removeScopeGroupItem}
        addScopeGroupItem={addScopeGroupItem}
        showModal={isShowCreateModal}
        closeModal={hideCreateModal}
        t={t}
        isLoading={isLoading}
      />

      <UpdateScopeModal
        onSubmit={EditScope}
        addScopeGroupItem={addScopeGroupItem}
        editScopeGroup={removeScopeGroupItem}
        showModal={isShowUpdateModal}
        closeModal={hideUpdateModal}
        defaultValue={scopeObj}
        t={t}
        isLoading={isLoading}
      />

      <DeleteScopeModal
        data={scopeObj}
        handleDeleteScope={handleDeleteScope}
        showModal={isShowDeleteModal}
        closeModal={hideDeleteModal}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Container;
