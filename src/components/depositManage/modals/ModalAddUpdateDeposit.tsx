import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import { SettingDeposit } from 'models';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
  type: string;
  data?: SettingDeposit;
  onSubmitForm: (data: SettingDeposit) => void;
}

const ModalAddUpdateDeposit: React.FC<Props> = ({
  show,
  type,
  data = {},
  onSubmitForm,
  onHide,
}) => {
  const { t } = useTranslation('common');
  const rules = {
    date: { required: true, isVNumber: true, maxLength: 2, min: 1 },
    rate: { required: true, isVNumber: true, maxLength: 3, min: 1, max: 100 },
  };
  const {
    control,
    register,
    formState: { errors },
    clearErrors,
    getValues,
    reset,
    handleSubmit,
  } = useForm<SettingDeposit>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitFormDeposit: SubmitHandler<SettingDeposit> = (data, e) => {
    e?.preventDefault();

    data.sumBalanceDay = +data.sumBalanceDay!;
    data.minBalanceRate = +data.minBalanceRate!;

    onSubmitForm && onSubmitForm(data);
  };

  useEffect(() => {
    if (show && type === 'UPDATE') {
      reset(data);
    }
  }, [show, data]);

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide && onHide();
        setTimeout(() => {
          reset();
        }, 500);
      }}
      backdrop='static'
      // keyboard={false}
      className='modal-add-update-deposit'>
      <Modal.Header closeButton>
        <p>
          {t(type === 'CREATE' ? 'Thêm mới ký quỹ' : 'Cập nhật ký quỹ')}
          {type === 'UPDATE' && <span className='highlist--strong'>#{data?.merchantName}</span>}
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitFormDeposit)}>
          <div className='inputs-group'>
            {type === 'CREATE' && (
              <div className={`form-group ${errors?.merchantId ? 'input-custom-error' : ''}`}>
                <label>
                  {t('Đối tác')}
                  <span className='text-danger'> (*)</span>
                </label>
                <AsyncSelect
                  asyncType='MERCHANT'
                  disableQuery
                  control={control}
                  name='merchantId'
                  keyReturn='merchantId'
                  clearError={clearErrors}
                  rules={{ required: true }}
                  isAllowSearchAll={false}
                  {...{
                    className: 'search-merchant-select async-select--none-style-label',
                    classNamePrefix: 'merchant-async-select',
                  }}
                />
              </div>
            )}
            <Input
              formGroupClassName={`form-group ${errors?.sumBalanceDay ? 'input-custom-error' : ''}`}
              type='text'
              label={t('Số ngày tính doanh thu (Ngày)')}
              register={register}
              errors={errors?.sumBalanceDay}
              clearErrors={clearErrors}
              placeholder={t('Số ngày')}
              rules={rules.date}
              name='sumBalanceDay'
            />
            <Input
              formGroupClassName={`form-group ${
                errors?.minBalanceRate ? 'input-custom-error' : ''
              }`}
              type='text'
              label={t('Phần trăm tạm giữ (%)')}
              register={register}
              errors={errors?.minBalanceRate}
              clearErrors={clearErrors}
              placeholder={t('Phần trăm')}
              rules={rules.rate}
              name='minBalanceRate'
            />
            <div className={`form-group ${errors?.merchantId ? 'input-custom-error' : ''}`}>
              <label>
                {t('Ký quỹ (VND)')}
                <span className='text-danger'> (*)</span>
              </label>
              <Controller
                control={control}
                name='minBalanceAmount'
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      field.onChange(numeral(target.value).value());
                    }}
                    placeholder={'*,000,000'}
                    maxLength={14}
                    value={field?.value ? numeral(+field?.value).format('0,0') : ''}
                  />
                )}
              />
              {errors?.merchantId?.type && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid' />
                  {'Kỹ quỹ không được rỗng'}
                </p>
              )}
            </div>
            <div
              className={`form-group form-input-textarea `}
              style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
              <label>{t('Description')}</label>
              <textarea
                className='input-textarea'
                placeholder={t('Diễn giải')}
                style={{ width: '100%', maxHeight: '250px', minHeight: '100px' }}
                {...register('description')}
              />
            </div>
          </div>
          <div className='btn-form-group'>
            <button className='btn btn-primary w-100'>
              {type === 'CREATE' ? <i className='fas fa-plus'></i> : <i className='fa fa-save'></i>}
              {t(type === 'CREATE' ? 'Tạo mới' : 'Cập nhập')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddUpdateDeposit;
