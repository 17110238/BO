import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Role, scopeRole, dataCheckBox, Scopes } from 'models/role/listRole';
import { getListRole, getListScope, updateScopeRole } from 'redux/actions/roleManageAction';
import alert from 'utils/helpers/alert';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { useForm, Controller } from 'react-hook-form';

export default function RoleManageContainer(): JSX.Element {
  const { t } = useTranslation('common');
  const { control, setValue } = useForm<any>({});
  const dispatch = useDispatch();
  const [listRole, setListRole] = useState<Array<Role>>([]);
  const [listScope, setListScope] = useState<Array<scopeRole>>([]);
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<dataCheckBox>();
  // Chọn role và kiểm tra scope của role đó với total scope, nếu trùng thì thêm properties isCheck vào object scope để auto check khi isCheck là true
  const handleChangeRole = (roleKey: string): void => {
    setValue('type', roleKey);
    if (roleKey) {
      const data = listRole.filter((item: Role) => item.key === roleKey)[0];
      if (Array.isArray(data.scope) && data.scope.length > 0) {
        const temp: Array<scopeRole> = [];
        listScope.forEach((item: scopeRole) => {
          const tempScope: scopeRole = { ...item };
          const index = data.scope.findIndex((scope: scopeRole) => scope.id === item.id);
          if (index !== -1) {
            tempScope.isCheck = true;
          } else {
            tempScope.isCheck = false;
          }
          temp.push(tempScope);
        });
        if (temp.length > 0) {
          setListScope(temp);
          setIsSelect(true);
        }
      } else {
        const temp = listScope.map((item: scopeRole) => ({ ...item, isCheck: false }));
        setListScope(temp);
        setIsSelect(true);
      }
      setIsChecked({
        roleKey,
      });
    } else {
      setIsSelect(false);
    }
  };
  // Update scope của role mà merchant chọn
  const handleChangeScope = (): void => {
    const scopes: Array<Scopes> = [];
    listScope.forEach((item: scopeRole) => {
      scopes.push({ scopeId: parseInt(item.id), value: item.isCheck ? item.isCheck : false });
    });
    const payload: any = { ...isChecked, scopes };
    dispatch(
      updateScopeRole(payload, (state, data) => {
        if (state) {
          dispatch(
            getListRole((state, role) => {
              if (state) {
                setListRole(role);
                alert('success', data.message, t);
              }
            })
          );
        }
      })
    );
  };
  // dùng useEffect gọi api get list role của merchant đang login và get list scope của bo
  useEffect(() => {
    dispatch(
      getListRole((state, role) => {
        if (state) {
          setListRole(role);
          dispatch(
            getListScope(
              {
                paging: {
                  start: 0,
                  limit: 999,
                },
              },
              (status, scope) => {
                if (status) {
                  setListScope(scope);
                }
              }
            )
          );
        }
      })
    );
  }, []);
  const listRoleOptions = listRole.map((value, index) => ({
    value: value.key,
    label: value.description,
  }));

  return (
    <div className='roleManage-container box-payment'>
      <div className='roleManage-header'>
        <div className='roleManage-header__content'>
          <h4 className='roleManage-header__title'>{t('Quản lý nhóm quyền')}</h4>
        </div>
      </div>
      <div className='roleManage-content'>
        <div className='selected-role'>
          <div className='form-group'>
            {listRole.length > 0 && (
              <Controller
                control={control}
                name={'type'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                    styles={customStyles}
                    value={listRoleOptions.find((val) => val.value === value) || null}
                    placeholder={t('Chọn nhóm quyền')}
                    options={listRoleOptions}
                    onChange={(e: SingleValue<any>) => handleChangeRole(e.value)}
                  />
                )}
              />
            )}
          </div>
        </div>
        <div className='list-scope'>
          <div className='row'>
            {isSelect &&
              listScope?.map((item: scopeRole) => {
                return (
                  <div className='col-lg-4 col-sm-6 p-0 scope' key={item.id}>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={item.id}
                        checked={item.isCheck}
                        onChange={(e) => {
                          // check vào ô checkbox thây đổi isCheck trong scope của role
                          const temp: Array<scopeRole> = [...listScope];
                          const index: number = listScope.findIndex(
                            (scope: scopeRole) => scope.id === item.id
                          );
                          if (index !== -1) {
                            temp[index] = { ...item, isCheck: e.target.checked };
                          }
                          setListScope(temp);
                        }}
                      />
                      <label className='form-check-label' htmlFor={item.id}>
                        {item.description}
                      </label>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {isSelect && (
          <div className='submit-scope'>
            <button onClick={handleChangeScope}>{t('Lưu thay đổi')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
