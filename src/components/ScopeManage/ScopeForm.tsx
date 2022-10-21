import { Role } from 'models/role/listRole';
import { Scope } from 'models/scope';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListRole } from 'redux/actions/roleManageAction';
import { Input } from 'ui/Form';
import GroupRole from './GroupRole';

interface ScopeFormProps {
  defaultValue: Scope;
  closeModal: () => void;
  submitForm: (data: object) => void;
  editScopeGroup?: (data: any) => void;
  addScopeGroupItem: (data: any) => void;
}

interface formProps {
  scope: string;
  group: string[];
  description: string;
}

const ScopeForm: FC<ScopeFormProps> = ({
  defaultValue,
  closeModal,
  submitForm,
  editScopeGroup,
  addScopeGroupItem,
}) => {
  const [roles, setRoles] = useState<[Role]>();

  const { t } = useTranslation('common');
  const {
    register,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<formProps>({ defaultValues: defaultValue });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getListRole((state, role) => {
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
      <div className='form-group'>
        <label>Group</label>
        <GroupRole
          addScopeGroupItem={addScopeGroupItem}
          rolesData={roles}
          editScopeGroup={editScopeGroup}
          roleList={defaultValue && defaultValue.group}
        />
      </div>
      <Input
        type='text'
        name='description'
        label='Description'
        register={register}
        clearErrors={clearErrors}
        errors={errors.description}
        rules={{ required: true }}
        placeholder={t('Description')}
      />
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
