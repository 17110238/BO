import { yupResolver } from '@hookform/resolvers/yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { useState } from 'react';
import { Col, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { Input } from 'ui/Form';
import * as yup from 'yup';

interface ModalAddProps {
  show: boolean;
  handleClose: () => void;
  handleRefreshStaffList: () => void;
}

const templateTypes = [
  {
    label: 'Email',
    value: 'EMAIL'
  },
  {
    label: 'SMS',
    value: 'SMS'
  },
  {
    label: 'Thông báo',
    value: 'NOTIFICATION'
  },
];

const rulesForm = {
  company: { required: true },
  phone: { required: true, minLength: 10, maxLength: 10, isVNumber: true, isPhoneNumber: true },
};

const ModalAddStaff = ({
  show,
  handleClose,
  handleRefreshStaffList
}: ModalAddProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [data, setData] = useState<object[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const schema = yup.object({
    company: yup.string().required(),
    phone: yup.string().matches(new RegExp('[0-9]{7}'))
  }).required()

  const { register, control, handleSubmit, reset, formState: { errors }, clearErrors, setValue } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    // resolver: yupResolver<any>(schema),
  });

  const handleCloseModal = () => {
    handleClose();
    reset();
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data, e) => {
    console.log({ data });

  }

  return (
    <Modal
      className='modal-multitransfer add-staff'
      show={show}
      onHide={handleCloseModal}
    >
      <div className='modal-multitransfer__title'>
        <p>{t('Thêm nhân viên')}</p>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleCloseModal}
          alt='close icon'
        />
      </div>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          className="multitransfer-form-container"
        >
          <div className="inputs-group">
            <Form.Group className='form-group'>
              <Form.Label>
                {t('Công ty')}
                <span className='text-danger'> (*)</span>
              </Form.Label>
              <Controller
                control={control}
                name={'company'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    defaultValue={templateTypes[0]}
                    className='select-input-form'
                    classNamePrefix='input-select'
                    options={templateTypes}
                    value={templateTypes.find((item: any) => item.value === value)}
                    onChange={(e: SingleValue<any>) => {
                      onChange(e.value);
                    }}
                  />
                )}
              />
            </Form.Group>
            <Input
              type='text'
              formGroupClassName={`${errors?.phone ? 'form-group__error' : ''}`}
              label={t('Tài khoản nhân viên')}
              register={register}
              name='phone'
              errors={errors.phone}
              clearErrors={clearErrors}
              rules={rulesForm?.phone}
              placeholder={t('SĐT ví PayME')}
              autoComplete='off'
            />
          </div>
          <div className="btn-group">
            <button
              type='submit'
              className='btn btn-primary'
            >
              Thêm nhân viên
            </button>
          </div>
        </form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalAddStaff;
