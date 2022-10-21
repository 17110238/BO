import dayjs from 'dayjs';
import { AddBankEwalletInput, BanksEwalletType, EditBankEwalletInput } from 'models';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import NumberFormat, { NumberFormatValues, SourceInfo } from 'react-number-format';
import { Input } from 'ui/Form';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface Props {
  show?: boolean;
  bankData?: BanksEwalletType;
  balance: string | undefined;
  onHide: () => void;
  onCreateCoopBank: (data: AddBankEwalletInput) => void;
  onUpdateCoopBank: (data: EditBankEwalletInput) => void;
  onChangeBalance: ((values: NumberFormatValues, sourceInfo: SourceInfo) => void) | undefined;
}

const ModalAddAndUpdateBank: React.FC<Props> = ({
  show,
  onHide,
  onCreateCoopBank,
  onUpdateCoopBank,
  bankData,
  balance,
  onChangeBalance,
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
  } = useForm<AddBankEwalletInput>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const onSubmit = (data: AddBankEwalletInput) => {
    if (!!bankData) {
      const updatePayload: EditBankEwalletInput = {
        ...data,
        activeDate: dayjs(data.activeDate, 'DD/MM/YYYY').toISOString(),
      };

      onUpdateCoopBank(updatePayload);
    } else {
      onCreateCoopBank({
        ...data,
        activeDate: dayjs(data.activeDate, 'DD/MM/YYYY').toISOString(),
        balance: Number(data.balance),
      });
    }
  };

  useEffect(() => {
    if (!!bankData)
      reset({ ...bankData, activeDate: dayjs(bankData.activeDate).format('DD/MM/YYYY') });
  }, [bankData]);

  useEffect(() => {
    setValue('balance', numeral(balance).value()! + bankData?.balance!);
  }, [balance]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop='static'
      //keyboard={false}
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
              name='bankNumber'
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
            <div className={`form-group ${errors?.balance?.message ? 'input-custom-error' : ''}`}>
              <label htmlFor=''>
                Số dư hiện tại <span className='text-danger'> (*)</span>
              </label>
              <Controller
                name='balance'
                control={control}
                rules={{
                  required: {
                    message: 'Vui lòng nhập số dư hiện tại',
                    value: true,
                  },
                }}
                render={({ field }) => (
                  <NumberFormat
                    disabled={!!bankData}
                    value={field.value}
                    thousandSeparator
                    onValueChange={({ value }) => {
                      clearErrors('balance');
                      field.onChange(value);
                    }}
                    className='form-control'
                    placeholder='Nhập số dư hiện tại'
                  />
                )}
              />
              {errors?.balance?.message && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid'></i> {errors?.balance.message}
                </p>
              )}
            </div>

            {!!bankData && (
              <div className={`form-group ${false ? 'input-custom-error' : ''}`}>
                <label htmlFor=''>Giá trị cần thay đổi</label>
                <NumberFormat
                  value={balance}
                  thousandSeparator
                  onValueChange={onChangeBalance}
                  className='form-control'
                  placeholder='Nhập +/- để tăng giảm số dư hiện tại'
                />
              </div>
            )}

            <div className='d-flex justify-content-center mt-5'>
              <button type='button' onClick={onHide} className='btn btn-outline-danger mr-3'>
                Hủy
              </button>
              <button type='submit' className='btn btn-primary'>
                {!!bankData ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddAndUpdateBank;
