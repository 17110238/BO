import React, { useState, memo, useEffect, useMemo } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useSelector } from 'react-redux';
import { createUserType, createUserScopeType } from 'models/user/userState';
import alert from 'utils/helpers/alert';
import { useTranslation } from 'react-i18next';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { log } from 'console';
import _ from 'lodash'
interface IUser {
  checked: string[] | [];
  expanded: string[];
}
interface FormLoginSubmit {
  username?: string;
  password: string;
  repassword?: string;
  fullname?: string;
  phone?: number | string;
  email?: string;
  gender?: any;
  birthday?: Date | null;
  isActive?: any;
  role?: string[];
  group?: string[] | any;
  scope: string[];
}
interface ListRole {
  key: string;
  name: string;
  description: string;
  scope: {
    id: string;
    service: string;
    scope: string;
    description: string;
  }[];
}
interface scope {
  scope: {
    id: string;
    service: string;
    scope: string;
    description: string;
  };
}
interface CheckBoxTreeProps {
  id: number;
  handlelistRoleCheckBox: (data: any[]) => void;
  rest?: any;
  listScopeOfRole?: any;
  isCheckTreeByRole?: boolean;
  scopeOfRole? : any
}
const CheckBoxScope = ({ handlelistRoleCheckBox, id, listScopeOfRole, isCheckTreeByRole, scopeOfRole }: CheckBoxTreeProps) => {
  const { t } = useTranslation('common');
  const ListRole = useSelector<any, ListRole[]>((state) => state.authReducers?.listRole) || [];
  const ListScopeAuth = useSelector<any, []>((state) => state.authReducers?.accountInfo.scope) || [];
  const detailUser = useSelector<any, FormLoginSubmit>((state) => state.userReducers?.detailUser) || {};
  const [isCheck, setIsCheck] = useState<boolean>(false)
  let a: any[] = [];

  for (let item of ListRole) {
    item.scope.forEach((item: any) => {
      a.push(item);
    });
  }

  let newArr : any = []

  newArr = a.filter(function (item) {
    return newArr.includes(item?.scope) ? '' : newArr.push(item?.scope)
  })

  let ListScopeAuthFormat: any[] = [];
  if (isCheckTreeByRole) {
    newArr?.forEach((item : any, index : any) => {
      ListScopeAuthFormat.push({ value: item?.scope, label: item?.description });
  });
  } else {
    ListScopeAuth.forEach((item, index) => {
      let result = a.find((p) => p?.scope == item);
      if (result?.scope && result?.description) {
        ListScopeAuthFormat.push({ value: result?.scope, label: result?.description });
      }
    });
  }

  useMemo(() => ListScopeAuthFormat, [ListScopeAuth, listScopeOfRole]);

  const [checkBoxTree, setCheckboxTree] = useState<IUser>({
    checked: ListScopeAuthFormat.map((item, index) => item.value),
    expanded: [],
  });

  useEffect(() => {
    handlelistRoleCheckBox(checkBoxTree.checked);
  }, [isCheck]);

  useEffect(() => {
    let duplicates = ListScopeAuthFormat.filter(function (val) {
      return detailUser?.scope?.indexOf(val?.value) != -1;
    });
    if(scopeOfRole === (detailUser?.group && detailUser?.group[0])){
      setCheckboxTree({ checked: detailUser?.scope, expanded: [] });
      handlelistRoleCheckBox(detailUser?.scope);
    }else {
      setCheckboxTree({ checked: listScopeOfRole?.map((item: any) => item?.scope), expanded: [] });
      handlelistRoleCheckBox(listScopeOfRole?.map((item: any) => item?.scope));
    }
  }, [listScopeOfRole])

  useEffect(() => {
    if (id) {
      setCheckboxTree({ checked: detailUser?.scope, expanded: [] });
    }
  }, [id, detailUser]);

  return (
    <CheckboxTree
      icons={{
        check: <i className='fas fa-check-square text-success'></i>,
        uncheck: <i className='far fa-square'></i>,
        halfCheck: <i className='fas fa-minus text-disabled'></i>,
      }}
      nodes={[
        {
          value: 'all',
          label: t('Danh sách quyền'),
          icon: <></>,
          children: [...ListScopeAuthFormat],
        }
      ]}
      checked={checkBoxTree?.checked}
      expanded={['all']}
      iconsClass='fa5'
      onCheck={(checked) => {
        setIsCheck(!isCheck)
        // let check = checked
        // if (check.length == 0) {
        //   alert('error', ('Tài khoản cần ít nhất 1 quyền để hoạt động'), t);
        //   return
        // }
        setCheckboxTree({ ...checkBoxTree, checked });
      }}
      onExpand={(expanded) => setCheckboxTree({ ...checkBoxTree, expanded })}></CheckboxTree>
  );
};
export default memo(CheckBoxScope);
