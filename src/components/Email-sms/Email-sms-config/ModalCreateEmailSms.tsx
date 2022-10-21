import { CreateEmailSmsProductInput } from 'models/emailSms/emailSms';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { createEmailSmsProduct, getEmailSmsProduct } from 'redux/actions/emailSmsAction';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean | undefined;
  onHide: (type?: string) => void;
  setSubmitForm?: (a: boolean) => void;
}

const ModalCreateEmailSms: React.FC<Props> = ({ show, onHide, setSubmitForm }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const option = [
    { value: true, label: t('Hoạt động') },
    { value: false, label: t('Ngưng hoạt động') },
  ];

  const formRules = {
    title: { required: true },
    mail: {},
    sms: {},
    amount: { required: true },
    note: { required: true },
  };

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
    control,
  } = useForm<CreateEmailSmsProductInput>({
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      isVisible: option[0].value,
    },
  });

  const handleSubmitForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();

    const payload: CreateEmailSmsProductInput = {
      ...data,
      amount: +data?.amount,
      package: {
        sms: +data?.package?.sms,
        mail: +data?.package?.mail,
      },
    };
    dispatch(
      createEmailSmsProduct(payload, (status, res) => {
        if (status) {
          alert('success', t(res.message), t);
          reset();
          onHide && onHide();
          setSubmitForm && setSubmitForm(true);
        } else {
          alert('error', t(res.message), t);
        }
      })
    );
  };

  return (
    <Modal
      backdrop='static'
      className='modal-create-email-sms'
      show={show}
      onHide={() => {
        reset();
        onHide && onHide();
      }}>
      <Modal.Header closeButton>
        <h5>{t('Thêm mới gói')}</h5>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
          <div className='inputs-group'>
            <Input
              type='text'
              formGroupClassName={`${errors?.title?.message ? 'input-custom-error' : ''}`}
              label={t('Tên gói')}
              register={register}
              errors={errors?.title}
              clearErrors={clearErrors}
              placeholder={t('Nhập tên gói')}
              rules={formRules.title}
              name='title'
            />
            <Input
              type='number'
              formGroupClassName={`${errors?.package?.sms?.message ? 'input-custom-error' : ''}`}
              label={t('Số lượng SMS')}
              register={register}
              errors={errors?.package?.sms}
              clearErrors={clearErrors}
              placeholder={t('Nhập số lượng SMS')}
              rules={formRules.sms}
              name='package.sms'
            />
            <Input
              type='number'
              formGroupClassName={`${errors?.package?.mail?.message ? 'input-custom-error' : ''}`}
              label={t('Số lượng Email')}
              register={register}
              errors={errors?.package?.mail}
              clearErrors={clearErrors}
              placeholder={t('Nhập số lượng Email')}
              rules={formRules.mail}
              name='package.mail'
            />
            <Input
              type='number'
              formGroupClassName={`${errors?.amount?.message ? 'input-custom-error' : ''}`}
              label={t('Tổng giá trị')}
              register={register}
              errors={errors?.amount}
              clearErrors={clearErrors}
              placeholder={t('Nhập tổng giá trị')}
              rules={formRules.amount}
              name='amount'
            />
            <div className='form-group'>
              <label>{t('Trạng thái')}</label>
              <Controller
                control={control}
                name='isVisible'
                render={({ field }) => (
                  <ReactSelect
                    className='select-input-form'
                    classNamePrefix='input-select'
                    placeholder={t('Loại kết nối')}
                    onChange={(e: any) => {
                      field.onChange(e.value);
                    }}
                    value={option.find((value) => value.value === field.value) || null}
                    options={option}
                  />
                )}
              />
            </div>
            <div
              className={`form-group form-input-textarea ${errors?.description?.message ? 'input-custom-error' : ''
                }`}>
              <label>
                {/* {t('Expired time')} */}
                <label className='mr-0'>{t('Ghi chú')}</label>
                <span className='text-danger'> (*)</span>
              </label>
              <textarea
                className='input-textarea'
                placeholder={t('Nhập ghi chú')}
                style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                {...register('description', {
                  required: `${t('Description is required')}`,
                })}
              />
              <p className='mt-10 mb-0 txt-valid'>
                {errors?.description && (
                  <>
                    <i className='i-valid' />
                    {errors?.description?.message}
                  </>
                )}
              </p>
            </div>
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
  );
};

export default ModalCreateEmailSms;
