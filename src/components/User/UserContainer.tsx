import React, { useState, useEffect, useRef } from 'react';
import BoxSearchAccount, { searchParams } from './BoxSearchUser';
import DataTableAccount from './DataTableUser';
import HeaderAccount from './HeaderAccount';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { AccountMerchant } from 'models/account/accountMerchant';
import alert from 'utils/helpers/alert';
import LoadingInline from 'components/common/Loading/LoadingInline';
import {
  getListRoleUser,
  searchUser,
  updateUser,
  deleteUserBoList,
  deleteUser,
} from 'redux/actions/userAction';
import Router from 'next/router';
import BoxSearchUser from './BoxSearchUser';
interface Payload {
  filter: {
    search: any;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort: {
    createdAt: number;
  };
}
interface Role {
  key?: string;
  name?: string;
}

const UserContainer: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(20);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({});
  const userBoList = useSelector<any, AccountMerchant[]>(
    (state) => state?.userReducers.userBoInfoArray
  );
  const submitAccountId = useSelector<any, Role[]>((state) => state.authReducers?.accountInfo?.profile?.accountId);
  // setFilter({ submitAccountId: submitAccountId })
  const ListRole = useSelector<any, Role[]>((state) => state.authReducers?.listRole);
  const initPayload: Payload = {
    filter: filter,
    paging: {
      start: start,
      limit: limit,
    },
    sort: {
      createdAt: -1,
    },
  };
  const [payload, setPayload] = useState<Payload>(initPayload);
  const isLoading = useSelector<any, boolean>((state) => state.userReducers?.loading) || false;
  useEffect(() => {
    if (ListRole.length == 0) {
      dispatch(getListRoleUser());
      return () => {
        dispatch(deleteUserBoList());
      };
    }
    // return () => {
    //   dispatch(deleteUserBoList());
    // };
  }, []);

  const handleChangeSearch = ({ search }: searchParams) => {
    setFilter({ search });
    setSubmitForm(true);
  };
  const handleSubmitUpdateUser = (e: any, data: string) => {
    e.preventDefault;
    const { checked } = e.target;
    const params: any = {
      id: +data,
      isActive: checked,
    };
    dispatch(
      updateUser(params, (status: boolean, response: any) => {
        if (response.data.Account.Update?.succeeded) {
          // const payload: any = {
          //   filter,
          //   paging: {
          //     start: start!,
          //     limit: limit!,
          //   },
          //   sort: {
          //     createdAt: -1,
          //   },
          // };
          // console.log('payload------------------------', payload);
          // dispatch(
          //   searchUser(payload, (status, response) => {
          //     if (status) {
          //       setTotalRow(response.data.Account.GetList.totalRow);
          //       setSubmitForm(false);
          //     } else {
          //       setSubmitForm(false);
          //     }
          //   })
          // );
          alert('success', response.data.Account.Update?.message, t);
          handleGetListUser(start, limit);
        } else {
          alert('error', response.data.Account.Update?.message, t);
        }
      })
    );
  };

  const handleGetListUser = (start?: number, limit?: number, sort?: {}) => {
    const payload: any = {
      // filter: { ...filter, submitAccountId: submitAccountId },
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: {
        createdAt: -1,
      },
    };

    function handleGetListUser(payload: any) {
      dispatch(
        searchUser(payload, (status, res) => {
          setSubmitForm(false);
          if (status) {
            // setTotalRow(res.data.Account.GetList.totalRow);
            setTotalRow(res.data.Account.GetList.data.length);
          }
        })
      );
    }
    return {
      payload,
      getList: handleGetListUser,
      submitForm,
    };
  };
  useEffect(() => {
    if (Object.keys(Router.query).length != 0) {
      setFilter(Router.query);
    }

  }, []);

  const handleDeleteUser = (id : number) => {
    dispatch(
      deleteUser({id}, (state, res) => {
        if(state){
          alert('success', res?.message, t);
          setSubmitForm(true);
        }else {
          alert('error', res?.message, t);
        }
      })
    )
  }

  return (
    <>
      <div className='box-payment'>
        <HeaderAccount
          handleSubmitSearch={handleChangeSearch}
          submitForm={submitForm}
        />
        <BoxSearchUser 
          submitForm={submitForm} 
          handleSubmitSearch={handleChangeSearch}  
          loading={isLoading}
          setSubmitForm={setSubmitForm}
        />
        {/* <LoadingInline loading={isLoading} /> */}
        <DataTableAccount
          totalFilter={totalRow}
          data={userBoList}
          t={t}
          onChangeActiveUser={handleSubmitUpdateUser}
          getDataList={handleGetListUser}
          loading={isLoading}
          handleDeleteUser={handleDeleteUser}
        />
      </div>
    </>

  );
};

export default UserContainer;
