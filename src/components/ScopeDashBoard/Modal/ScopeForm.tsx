import { Role } from 'models/role/listRole';
import { Scope } from 'models/scope';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListRoleAccountMc } from 'redux/actions';
import { getListRole } from 'redux/actions/roleManageAction';
import { Input } from 'ui/Form';
import GroupRole from './GroupRole';

interface ScopeFormProps {
  defaultValue: Scope;
  closeModal: () => void;
  submitForm: (data: object) => void;
  editScopeGroup?: (data: any) => void;
  addScopeGroupItem: (data: any) => void;
  t: (a: string) => string;
}

interface formProps {
  scope: string;
  group: string[];
  service: string;
  description: string;
}

const ScopeForm: FC<ScopeFormProps> = ({
  defaultValue,
  closeModal,
  submitForm,
  editScopeGroup,
  addScopeGroupItem,
  t,
}) => {
  const [roles, setRoles] = useState<[Role]>();
  const {
    register,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<formProps>({ defaultValues: defaultValue });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getListRoleAccountMc((state, role) => {
        if (state) {
          setRoles(role);
        }
      })
    );
  }, []);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Input
        type='text'
        name='scope'
        label='Scope'
        disabled={defaultValue && defaultValue.scope}
        register={register}
        clearErrors={clearErrors}
        errors={errors.scope}
        rules={{ required: true }}
        placeholder={t('Scope')}
      />

      <Input
        type='text'
        name='service'
        label={t('Service')}
        register={register}
        clearErrors={clearErrors}
        errors={errors.service}
        rules={{ required: true }}
        placeholder={t('Service')}
      />

      <Input
        type='text'
        name='description'
        label={t('Note')}
        register={register}
        clearErrors={clearErrors}
        errors={errors.description}
        rules={{ required: true }}
        placeholder={t('Note')}
      />

      <div className='form-group'>
        <label>Group</label>
        <GroupRole
          addScopeGroupItem={addScopeGroupItem}
          rolesData={roles}
          editScopeGroup={editScopeGroup}
          roleList={defaultValue && defaultValue.group}
        />
      </div>

      <div className='d-flex align-items-center justify-content-end mt-5'>
        <button type='button' onClick={closeModal} className='btn btn-filter-active'>
          {t('Cancel')}
        </button>
        <button
          style={{ height: 'fit-content', fontSize: 'medium', lineHeight: '40px' }}
          type='submit'
          className='btn btn-success ml-2'>
          {t('Confirm')}
        </button>
      </div>
    </form>
  );
};

export default ScopeForm;
