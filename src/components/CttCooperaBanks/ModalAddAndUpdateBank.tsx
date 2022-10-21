import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BanksCooperaType, EditBankCooperaInput, AddBankCooperaInput } from 'models';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { Input } from 'ui/Form';

dayjs.extend(customParseFormat);

interface Props {
  show?: boolean;
  bankData?: BanksCooperaType;
  onHide: () => void;
  onCreateCoopBank: (data: AddBankCooperaInput) => void;
  onUpdateCoopBank: (data: EditBankCooperaInput) => void;
}

const ModalAddAndUpdateBank: React.FC<Props> = ({
  show,
  onHide,
  onCreateCoopBank,
  onUpdateCoopBank,
  bankData,
}) => {
  const { t } = useTranslation('common');

  const {
    register,
    handleSubmit,
    clearErrors,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const onSubmit = (data: any) => {
    if (!!bankData) {
      const updatePayload: EditBankCooperaInput = {
        id: bankData.id,
        bankNumber: data.bankNumber,
        activeDate: dayjs(data.activeDate, 'DD/MM/YYYY').toISOString(),
        serviceName: data.serviceName,
        bankName: data.bankName,
        currency: data.currency,
      };
      onUpdateCoopBank(updatePayload);
    } else {
      onCreateCoopBank({
        ...data,
        activeDate: dayjs(data.activeDate, 'DD/MM/YYYY').toISOString(),
      });
    }
  };

  useEffect(() => {
    if (!!bankData)
      reset({ ...bankData, activeDate: dayjs(bankData.activeDate).format('DD/MM/YYYY') });
  }, [bankData]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop='static'
      // keyboard={false}
      dialogClassName='modal-add-issuer'>
      <Modal.Header closeButton>
        <h4>{!!bankData ? t('Cập nhật ngân hàng đảm bảo') : t('Thêm mới ngân hàng đảm bảo')}</h4>
      </Modal.Header>
      <Modal.Body className='p-2'>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <div className='inputs-group'>
            <Input
              type='text'
              formGroupClassName={`${errors?.bankName?.message ? 'input-custom-error' : ''}`}
              label={t('Tên ngân hàng')}
              register={register}
              errors={errors?.bankName}
              clearErrors={clearErrors}
              placeholder={t('Nhập tên ngân hàng')}
              rules={{ required: true }}
              name='bankName'
            />

            <Input
              type='text'
              formGroupClassName={`${errors?.serviceName?.message ? 'input-custom-error' : ''}`}
              label={t('Dịch vụ')}
              register={register}
              errors={errors?.serviceName}
              clearErrors={clearErrors}
              placeholder={t('Nhập dịch vụ')}
              rules={{ required: true }}
              name='serviceName'
            />

            <Input
              type='text'
              formGroupClassName={`${errors?.bankNumber?.message ? 'input-custom-error' : ''}`}
              label={t('Số tài khoản')}
              register={register}
              errors={errors?.bankNumber}
              clearErrors={clearErrors}
              placeholder={t('Nhập số tài khoản')}
              rules={{ required: true }}
              name={'bankNumber'}
            />

            <div
              className={`form-group ${errors?.activeDate?.message ? 'input-custom-error' : ''}`}>
              <label htmlFor=''>
                Ngày hoạt động <span className='text-danger'> (*)</span>
              </label>
              <Controller
                name='activeDate'
                control={control}
                rules={{
                  required: {
                    message: 'Vui lòng nhập ngày hoạt động',
                    value: true,
                  },
                }}
                render={({ field }) => (
                  <NumberFormat
                    format='##/##/####'
                    className='form-control'
                    placeholder='Nhập ngày hoạt động'
                    value={field.value}
                    onValueChange={({ value, formattedValue }) => {
                      field.onChange(formattedValue);
                    }}
                  />
                )}
              />
              {errors?.activeDate?.message && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid'></i> {errors?.activeDate.message}
                </p>
              )}
            </div>

            <Input
              type='text'
              formGroupClassName={`${errors?.currency?.message ? 'input-custom-error' : ''}`}
              label={t('Loại tiền')}
              register={register}
              errors={errors?.currency}
              clearErrors={clearErrors}
              placeholder={t('Nhập loại tiền')}
              rules={{ required: true }}
              name='currency'
            />
          </div>

          <div className='d-flex justify-content-center mt-2'>
            <button type='button' onClick={onHide} className='btn btn-outline-danger mr-3'>
              Hủy
            </button>
            <button type='submit' className='btn btn-primary'>
              {!!bankData ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddAndUpdateBank;
