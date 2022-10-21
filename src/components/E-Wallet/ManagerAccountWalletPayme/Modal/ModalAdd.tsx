import { DataGetListCompany } from 'models';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { addManagertAccountWalletPayme } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

interface Props {
  dataCompany: DataGetListCompany[];
  show?: boolean;
  onHide: (type?: string) => void;
  setSubmitForm?: (a: boolean) => void;
}

interface OptionCompany {
  label?: string;
  value?: number;
}

const ModalAdd: React.FC<Props> = ({
  dataCompany,
  show,
  onHide,
  setSubmitForm
}) => {

  const { t } = useTranslation('common')
  const dispatch = useDispatch()

  const formRules = {
    phone: { required: true, minLength: 10, maxLength: 10, isVNumber: true, isPhoneNumber: true },
    accountGroupId: {
      required: true
    }
  };

  const optionCompany: OptionCompany[] = dataCompany.map((value) => ({
    value: value.id,
    label: value.name
  }));

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
    control,
  } = useForm<any>({
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      //accountGroupId: optionCompany[0]?.value || 0,
    },
  });

  const handleSubmitForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();

    dispatch(
      addManagertAccountWalletPayme(data, (state, res) => {
        if (state) {
          alert('success', t(res.message), t);
          reset();
          onHide();
          setSubmitForm && setSubmitForm(true)
        } else {
          alert('error', t(res.message), t);
        }
      })
    )
  }

  return (
    <Modal
      backdrop='static'
      show={show}
      onHide={() => {
        reset();
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <h5>{t('Thêm nhân viên')}</h5>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
          <div className='inputs-group'>
            <div className='form-group'>
              <label>{t('Công ty')}</label>
              <Controller
                control={control}
                name='accountGroupId'
                defaultValue={1}
                render={({ field }) => (
                  <ReactSelect
                    className='select-input-form'
                    classNamePrefix='input-select'
                    placeholder=""
                    onChange={(e: any) => {
                      field.onChange(e.value);
                    }}
                    value={optionCompany.find((value) => value.value === field.value) || null}
                    options={optionCompany}
                  />
                )}
              />
            </div>
            <Input
              type="phone"
              formGroupClassName={`${errors?.phone?.message ? 'input-custom-error' : ''}`}
              label={('Tài khoản nhân viên')}
              register={register}
              errors={errors?.phone}
              clearErrors={clearErrors}
              placeholder={"SĐT Ví PayMe"}
              rules={formRules.phone}
              name="phone"
            />
          </div>
          <div className='inputs-group d-block p-0' style={{ textAlign: 'center' }}>
            <button
              className=' btn btn-primary mr-0'
              style={{ display: 'initial', minWidth: '100px' }}>
              {t('Thêm mới')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalAdd