import { Scope, scopeFilterInterface } from 'models/scope';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListRole } from 'redux/actions';
import { getScopeList, createScope, updateScope, deleteScope } from 'redux/actions/scopeAction';
import alert from 'utils/helpers/alert';
import DataTableScope from './DataTableScope';
import FilterScope from './FilterScope';
import HeaderScope from './HeaderScope';
import ModalCreateScope from './ModalCreate';
import ModalDeleteScope from './ModalDelete';
import ModalUpdateScope from './ModalUpdate';

interface ScopeProps {}

interface formProps {
  scope: string;
  group: [string];
  description: string;
}

const ScopeContainer: FC<ScopeProps> = () => {
  const initScopeObj = {
    id: '',
    scope: '',
    service: '',
    description: '',
    group: [],
  };

  const { t } = useTranslation('common');
  const [isFilter, setIsFilter] = useState<boolean>(true);
  const [isCreateModalShow, setIsCreateModalShow] = useState<boolean>(false);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState<boolean>(false);
  const [isUpdateModalShow, setIsUpdateModalShow] = useState<boolean>(false);
  const [scopeObj, setScopeObj] = useState<Scope>(initScopeObj);
  const [listRole, setListRole] = useState<Object[]>([]);
  const [filter, setFilter] = useState({});
  const [submitForm, setSubmitForm] = useState(true);
  const [isLoad, setIsLoad] = useState(false);
  const [scopes, setScopes] = useState<Scope[]>([]);

  const dispatch = useDispatch();

  // const scopes = useSelector<any, Scope[]>((state) => state.scopeReducer.scopes);

  useEffect(() => {
    dispatch(
      getListRole((state, role) => {
        if (state) {
          setListRole(role);
        }
      })
    );
  }, [dispatch, getListRole]);

  const showFilter = () => {
    setIsFilter(!isFilter);
  };

  // Create modal
  const hideCreateModal = () => {
    setIsCreateModalShow(false);
    setScopeObj(initScopeObj);
  };
  const showCreateModal = () => {
    setIsCreateModalShow(true);
  };

  // Delete modal
  const hideDeleteModal = () => {
    setIsDeleteModalShow(false);
    setScopeObj(initScopeObj);
  };
  const showDeleteModal = (data: Scope) => {
    if (data.group === null) {
      setScopeObj({ ...data, group: [] });
    } else {
      setScopeObj(data);
    }
    setIsDeleteModalShow(true);
  };

  // Update modal
  const hideUpdateModal = () => {
    setIsUpdateModalShow(false);
    setScopeObj(initScopeObj);
  };
  const showUpdateModal = (data: Scope) => {
    if (data.group === null) {
      setScopeObj({ ...data, group: [] });
    } else {
      setScopeObj(data);
    }
    setIsUpdateModalShow(true);
  };
  const createNewScope = (payload: Scope) => {
    const _payload = {
      scope: payload.scope,
      group: scopeObj.group,
      description: payload.description,
    };
    dispatch(
      createScope(_payload, (status, data) => {
        if (status) {
          alert('success', data.message, t);
          hideCreateModal();
          setSubmitForm(true);
        } else {
          alert('error', data.message, t);
        }
      })
    );
  };

  const handleFilter = (data: any) => {
    const _payload = {
      scope: data?.scope?.trim(),
      description: data?.description?.trim(),
    };
    setFilter(_payload);
    setSubmitForm(true);
  };

  const handleDeleteScope = (payload: Scope) => {
    dispatch(
      deleteScope(payload, (status, data) => {
        if (status) {
          alert('success', data.message, t);
          hideDeleteModal();
          handleFilter({});
          setSubmitForm(true);
        } else {
          alert('error', data.message, t);
        }
      })
    );
  };

  const EditScope = (payload: Scope) => {
    const _payload = {
      scope: payload.scope,
      group: scopeObj.group,
      description: payload.description,
    };
    dispatch(
      updateScope(_payload, (status, data) => {
        if (status) {
          alert('success', data.message, t);
          hideUpdateModal();
          setSubmitForm(true);
        } else {
          alert('error', data.message, t);
        }
      })
    );
  };

  const handleGetScopeList = (start?: number, limit?: number) => {
    const payload: scopeFilterInterface = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetScopeList(payload: scopeFilterInterface) {
      setIsLoad(true);
      dispatch(
        getScopeList(payload, (status, res) => {
          setIsLoad(false);
          setSubmitForm(false);
          if (status) {
            setScopes(res);
          } else {
            setScopes([]);
          }
        })
      );
    }

    return {
      payload,
      getList: handleGetScopeList,
      submitForm,
    };
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

  return (
    <div className='linkedbank-container'>
      <HeaderScope
        showCreateModal={showCreateModal}
        isShowFilter={isFilter}
        onShowFilter={showFilter}
      />
      {isFilter && (
        <FilterScope handleFilter={handleFilter} isLoading={isLoad} setSubmitForm={setSubmitForm} />
      )}
      <DataTableScope
        data={scopes}
        totalFilter={10}
        listRole={listRole}
        showDeleteModal={showDeleteModal}
        handleGetScopeList={handleGetScopeList}
        showUpdateModal={showUpdateModal}
        isLoad={isLoad}
      />
      <ModalCreateScope
        defaultValue={scopeObj}
        onSubmit={createNewScope}
        editScopeGroup={removeScopeGroupItem}
        addScopeGroupItem={addScopeGroupItem}
        showModal={isCreateModalShow}
        closeModal={hideCreateModal}
      />
      <ModalDeleteScope
        data={scopeObj}
        handleDeleteScope={handleDeleteScope}
        showModal={isDeleteModalShow}
        closeModal={hideDeleteModal}
      />
      <ModalUpdateScope
        onSubmit={EditScope}
        addScopeGroupItem={addScopeGroupItem}
        editScopeGroup={removeScopeGroupItem}
        showModal={isUpdateModalShow}
        closeModal={hideUpdateModal}
        defaultValue={scopeObj}
      />
    </div>
  );
};

export default ScopeContainer;
