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
import numeral from 'numeral';

interface ModalAddProps {
  show: boolean;
  handleClose: () => void;
  handleRefreshTransferListHistory: () => void;
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
  company: { required: false },
  campaignCode: { required: false },
};

const ModalPayrollTransaction = ({
  show,
  handleClose,
  handleRefreshTransferListHistory,
}: ModalAddProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [data, setData] = useState<object[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const schema = yup.object({
    amount: yup.number().min(1000).max(999999999999).required(),
  }).required()

  const { register, control, handleSubmit, reset, formState: { errors }, clearErrors, setValue } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
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

  const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '')
  }

  return (
    <Modal
      className='modal-multitransfer add-staff'
      show={show}
      onHide={handleCloseModal}
    >
      <div className='modal-multitransfer__title'>
        <p>{t('Ghi nhận giao dịch nạp lương')}</p>
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
            <Input
              type='text'
              label={t('Công ty')}
              value="PayME"
              disabled
              register={register}
              name='phone'
              errors={errors.company}
              clearErrors={clearErrors}
              rules={rulesForm?.company}
              placeholder="PayME"
              autoComplete='off'
            />
            <Input
              type='text'
              label={t('Mã chiến dịch')}
              value="AZ748392"
              disabled
              register={register}
              name='campaignCode'
              errors={errors.campaignCode}
              clearErrors={clearErrors}
              rules={rulesForm?.campaignCode}
              placeholder="AZ748392"
              autoComplete='off'
            />
            <Form.Group className='form-group'>
              <Form.Label>
                {t('Hình thức chuyển')}
                <span className='text-danger'> (*)</span>
              </Form.Label>
              <Controller
                control={control}
                name={'transferType'}
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
            <Form.Group className={`form-group ${errors?.amount ? 'form-group__error' : ''}`}>
              <Form.Label>
                {t('Số tiền')} (đ)
                <span className='text-danger'> (*)</span>
              </Form.Label>
              <Controller
                control={control}
                name='amount'
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Form.Control
                    placeholder='Nhập số tiền'
                    className='mb-1'
                    maxLength={12}
                    onChange={(e) => onChange(+allowOnlyNumber(e.target.value))}
                    value={
                      value ? numeral(value).format('0,0') : ''
                    }
                  />
                )}
              />
            </Form.Group>
          </div>
          <div className="btn-group">
            <button
              type='submit'
              className='btn btn-primary'
            >
              Ghi nhận
            </button>
          </div>
        </form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalPayrollTransaction;
