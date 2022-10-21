import { conforms } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCustomerAction,
  getListCustomerAction,
  updateCustomerAction,
} from 'redux/actions/gapi';
import { getCustomerGroupList, modalCustomerGroup } from 'redux/actions';
import { kyc, showModalKYCConfirm } from 'redux/actions/index.js';
import alert from 'utils/helpers/alert';
import checkEmail from 'utils/helpers/checkEmail';
import checkPhone from 'utils/helpers/checkValidatePhoneNumber';
import checkPermission from 'utils/helpers/checkPermission';
import DataTableCustomer from './DataTableCustomer';
import HeaderCustomer from './HeaderCustomer';
import ModalCustomer from './ModalCustomer';
import { useOnClickOutside } from 'utils/hooks/useOnClickOutside';
import { useHookFormCustom } from 'components/common/ValidateInput';
import FilterCustomer from './FilterCustomer';

export default function CustomerContainer({}) {
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useHookFormCustom(t);
  const dispatch = useDispatch();
  const accountInfo = useSelector((state) => state.auth.accountInfo);
  const isOpen = useSelector((state) => state.customerGroupReducer?.isModal);
  const [modalAddCustomer, setModalAddCustomer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idCustomer, setIdCustomer] = useState();
  const dropdownRef = useRef(null);
  const [listSelect, setListSelect] = useState([]);
  const [isSelect, setSelect] = useState();
  const [isFilter, setFilter] = useState(false);

  //pagination
  const [totalRows, setTotalRows] = useState(0);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(20);

  const stateProfile = useSelector((state) => state?.auth?.profile);
  const stateKYC = useSelector((state) => state?.auth?.profile.data?.state);

  const pagination = {
    paging: {
      start,
      limit,
    },
    sort: {
      createdAt: -1,
    },
  };

  const [dataCustomer, setDataCustomer] = useState();

  const [customerGroup, setCustomerGroup] = useState(false);

  const handleChangePage = (page) => {
    setStart((page - 1) * limit);
  };

  const handleChangeRowsPerPage = async (newRowsPerPage, page) => {
    console.log(456);
    setLimit(newRowsPerPage);
    setStart(page);
  };

  const setDefaultValueForm = (data, group) => {
    setValue('name', data.name);
    setValue('email', data.email);
    setValue('number', data.number);
    setValue('location', data.location);
    setSelect(group);
  };

  const onEditCustomer = (data) => {
    setIsEdit(true);
    setDefaultValueForm(data, listSelect.filter((item) => item.id === data.customerGroupId)[0]);
    setIdCustomer(data?.id);
    setModalAddCustomer(true);
  };

  const getListCustomer = (start, limit) => {
    dispatch(
      getListCustomerAction(pagination, (status, data) => {
        if (status) {
          dispatch(
            getCustomerGroupList(
              { ...pagination, paging: { start: 0, limit: 999 } },
              (status, res) => {
                if (status) {
                  const customer = [];
                  data.data.forEach((item, indx) => {
                    const temp = res.data.filter((cus) => {
                      if (cus.id === item.customerGroupId) return cus;
                    });
                    if (Array.isArray(temp) && temp.length > 0) {
                      item.customerGroupName = temp[0].name;
                    }
                    customer.push({ ...item, index: start + indx + 1 });
                  });
                  setDataCustomer(customer);
                  setListSelect(res.data);
                  setTotalRows(data.totalRow);
                } else {
                  console.log(res);
                }
              }
            )
          );
        } else {
          console.log('data', data);
        }
      })
    );
  };
  useEffect(() => {
    getListCustomer(start, limit);
  }, [start, limit]);

  const onSubmitAddCustomer = (values) => {
    //call api add customer or edit customer
    if (stateProfile?.data?.state !== 'APPROVED') {
      dispatch(showModalKYCConfirm());
    } else {
      const index = listSelect.findIndex(
        (item) => isSelect?.name && item.name.toLowerCase() === isSelect?.name.toLowerCase()
      );
      let data = {
        ...values,
        customerGroupId: isSelect?.id !== undefined ? isSelect.id : listSelect[index]?.id,
      };
      if (isEdit) {
        data = { ...data, id: idCustomer };
        dispatch(
          updateCustomerAction(data, (status, data) => {
            if (status) {
              setIsEdit(false);
              getListCustomer();
              onHideAddCustomer();
              alert('success', `${t('Update customer successfully')}`, t);
            } else {
              alert('error', data.message || `${t('Server connection error')}`, t);
            }
          })
        );
      } else {
        dispatch(
          createCustomerAction(data, (status, data) => {
            if (status) {
              getListCustomer();
              onHideAddCustomer();
              alert('success', data.message || `${t('Add customer successfully')}`, t);
            } else {
              alert('error', data.message || `${t('Server connection error')}`, t);
            }
          })
        );
      }
    }
  };

  const onDeleteCustomer = (data) => {
    console.log('delete', data);
    // const data = {
    //   id
    // }
    // dispatch(deleteCustomerAction(data, (status, data) => {
    //   if (status) {
    //     console.log('delete data customer', data);
    //     showAlert("success", data.message || "Delete customer successfully");
    //   } else {
    //     console.log('data', data);
    //     showAlert("error", data.message || "Có lỗi xảy ra");
    //   }
    // }));
  };

  const getCustomerGroup = () => {
    dispatch(
      getCustomerGroupList(pagination, (status, res) => {
        if (status) {
          setListSelect(res.data);
        } else {
          console.log(res);
        }
      })
    );
  };

  const onShowAddCustomer = () => {
    if (stateKYC === 'APPROVED') {
      setModalAddCustomer(true);
      if (!isEdit) setModalAddCustomer(true);
    } else {
      dispatch(showModalKYCConfirm());
    }
  };

  const onHideAddCustomer = () => {
    setModalAddCustomer(false);
    setSelect('');
    reset();
  };

  const handleCustomerGroupOption = (e) => {
    setCustomerGroup(!customerGroup);
  };
  useOnClickOutside(dropdownRef, () => setCustomerGroup(false));

  const handleChangeCustomerGroup = (customerGroup) => {
    setSelect(customerGroup);
    setCustomerGroup(!customerGroup);
  };

  const openModalCustomerGroup = () => {
    dispatch(modalCustomerGroup(true));
  };

  const openFilter = () => {
    setFilter(!isFilter);
  };

  const updateStatusCustomer = (values) => {
    const data = { ...values, isActive: !values.isActive };
    dispatch(
      updateCustomerAction(data, (status, data) => {
        if (status) {
          getListCustomer();
          alert('success', `${t('Update status customer successfully')}`, t);
        } else {
          alert('error', data.message || `${t('Server connection error')}`, t);
        }
      })
    );
  };

  const arrPermession = useMemo(() => {
    return {
      isRead: checkPermission(accountInfo?.data?.scope, ['mc.customer.list']),
      isUpdate: checkPermission(accountInfo?.data?.scope, ['mc.customer.update']),
      isCreate: checkPermission(accountInfo?.data?.scope, ['mc.customer.add']),
      isRemove: checkPermission(accountInfo?.data?.scope, ['mc.customer.remove']),
    };
  }, [accountInfo?.data?.scope]);
  return (
    <Fragment>
      <div className='customer-container'>
        <HeaderCustomer
          onShowAddCustomer={onShowAddCustomer}
          isCreateCustomer={arrPermession.isCreate}
          isFilter={isFilter}
          openFilter={openFilter}
        />
        <FilterCustomer isFilter={isFilter} />
        {arrPermession.isRead && (
          <DataTableCustomer
            isUpdateCustomer={arrPermession.isUpdate}
            isRemoveCustomer={arrPermession.isRemove}
            onEditCustomer={onEditCustomer}
            onDeleteCustomer={onDeleteCustomer}
            dataCustomer={dataCustomer}
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            onChangePage={handleChangePage}
            customerGroup={listSelect}
            updateStatusCustomer={updateStatusCustomer}
            start={start}
            nameDataTable='colCustomer'
          />
        )}
        {modalAddCustomer && (
          <ModalCustomer
            show={modalAddCustomer}
            onHide={onHideAddCustomer}
            onSubmitAddCustomer={onSubmitAddCustomer}
            isEdit={isEdit}
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
            customerGroup={customerGroup}
            handleCustomerGroupOption={handleCustomerGroupOption}
            dropdownRef={dropdownRef}
            setError={setError}
            handleChangeCustomerGroup={handleChangeCustomerGroup}
            listSelect={listSelect}
            isSelect={isSelect}
            openModalCustomerGroup={openModalCustomerGroup}
            getCustomerGroup={getCustomerGroup}
            isOpen={isOpen}
          />
        )}
      </div>
      {/* <ModalAlertNoneKYC show={modalErrorNoneKYC.status} message={modalErrorNoneKYC.message} onHide={closeModalErrorNoneKYC} onKYCNow={onKYCNow} /> */}
    </Fragment>
  );
}
