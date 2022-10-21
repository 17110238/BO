import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerGroupList } from 'redux/actions';
import { showModalKYCConfirm } from 'redux/actions/index.js';
import checkPermission from 'utils/helpers/checkPermission';
import HeaderCustomerGroup from './HeaderCustomerGroup';
import ModalCustomerGroup from './ModalCustomerGroup';
import DataTableCustomerGroup from './DataTableCustomerGroup';

export default function CustomerGroupContainer() {
  const { t } = useTranslation('common');
  const accountInfo = useSelector((state) => state.auth.accountInfo);
  const dispatch = useDispatch();
  const [modalAddCustomer, setModalAddCustomer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [customerGroup, setCustomerGroup] = useState();

  //pagination
  const [totalRows, setTotalRows] = useState(0);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(20);
  const stateKYC = useSelector((state) => state?.auth?.profile.data?.state);
  const [dataCustomerGroup, setDataCustomerGroup] = useState();

  const handleChangePage = (page) => {
    setStart((page - 1) * limit);
  };

  const handleChangeRowsPerPage = async (newRowsPerPage, page) => {
    setLimit(newRowsPerPage);
    setStart(0);
  };

  const onEditCustomerGroup = (data) => {
    setIsEdit(true);
    setCustomerGroup(data);
    setModalAddCustomer(true);
  };

  const getListCustomerGroup = (start, limit) => {
    const data = {
      paging: {
        start,
        limit,
      },
      sort: {
        createdAt: -1,
      },
    };
    dispatch(
      getCustomerGroupList(data, (status, data) => {
        if (status) {
          setDataCustomerGroup(data.data);
          setTotalRows(data.totalRow);
        } else {
          // console.log('data', data);
        }
      })
    );
  };
  useEffect(() => {
    getListCustomerGroup(start, limit);
  }, [start, limit]);

  const onShowAddCustomer = () => {
    if (stateKYC === 'APPROVED') {
      setModalAddCustomer(true);
    } else {
      dispatch(showModalKYCConfirm());
    }
  };

  const onHideAddCustomer = () => {
    setModalAddCustomer(false);
    setIsEdit(false);
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
    <>
      <div className='customer-container'>
        <HeaderCustomerGroup
          onShowAddCustomerGroup={onShowAddCustomer}
          isCreateCustomerGroup={arrPermession.isCreate}
        />
        {arrPermession.isRead && (
          <DataTableCustomerGroup
            isUpdateCustomerGroup={arrPermession.isUpdate}
            onEditCustomerGroup={onEditCustomerGroup}
            dataCustomerGroup={dataCustomerGroup}
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            onChangePage={handleChangePage}
            nameDataTable='colCustomer'
          />
        )}
        <ModalCustomerGroup
          show={modalAddCustomer}
          onHide={onHideAddCustomer}
          isEdit={isEdit}
          customerGroup={customerGroup}
          onAfterSave={getListCustomerGroup}
        />
      </div>
    </>
  );
}
