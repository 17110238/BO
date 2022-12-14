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
        <h4>{!!bankData ? t('C???p nh???t ng??n h??ng ?????m b???o') : t('Th??m m???i ng??n h??ng ?????m b???o')}</h4>
      </Modal.Header>
      <Modal.Body className='p-2'>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <div className='inputs-group'>
            <Input
              type='text'
              formGroupClassName={`${errors?.bankName?.message ? 'input-custom-error' : ''}`}
              label={t('T??n ng??n h??ng')}
              register={register}
              errors={errors?.bankName}
              clearErrors={clearErrors}
              placeholder={t('Nh???p t??n ng??n h??ng')}
              rules={{ required: true }}
              name='bankName'
            />

            <Input
              type='text'
              formGroupClassName={`${errors?.serviceName?.message ? 'input-custom-error' : ''}`}
              label={t('D???ch v???')}
              register={register}
              errors={errors?.serviceName}
              clearErrors={clearErrors}
              placeholder={t('Nh???p d???ch v???')}
              rules={{ required: true }}
              name='serviceName'
            />

            <Input
              type='text'
              formGroupClassName={`${errors?.bankNumber?.message ? 'input-custom-error' : ''}`}
              label={t('S??? t??i kho???n')}
              register={register}
              errors={errors?.bankNumber}
              clearErrors={clearErrors}
              placeholder={t('Nh???p s??? t??i kho???n')}
              rules={{ required: true }}
              name='bankNumber'
            />
            <div
              className={`form-group ${errors?.activeDate?.message ? 'input-custom-error' : ''}`}>
              <label htmlFor=''>
                Ng??y ho???t ?????ng <span className='text-danger'> (*)</span>
              </label>
              <Controller
                name='activeDate'
                control={control}
                rules={{
                  required: {
                    message: 'Vui l??ng nh???p ng??y ho???t ?????ng',
                    value: true,
                  },
                }}
                render={({ field }) => (
                  <NumberFormat
                    format='##/##/####'
                    className='form-control'
                    placeholder='Nh???p ng??y ho???t ?????ng'
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
                S??? d?? hi???n t???i <span className='text-danger'> (*)</span>
              </label>
              <Controller
                name='balance'
                control={control}
                rules={{
                  required: {
                    message: 'Vui l??ng nh???p s??? d?? hi???n t???i',
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
                    placeholder='Nh???p s??? d?? hi???n t???i'
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
                <label htmlFor=''>Gi?? tr??? c???n thay ?????i</label>
                <NumberFormat
                  value={balance}
                  thousandSeparator
                  onValueChange={onChangeBalance}
                  className='form-control'
                  placeholder='Nh???p +/- ????? t??ng gi???m s??? d?? hi???n t???i'
                />
              </div>
            )}

            <div className='d-flex justify-content-center mt-5'>
              <button type='button' onClick={onHide} className='btn btn-outline-danger mr-3'>
                H???y
              </button>
              <button type='submit' className='btn btn-primary'>
                {!!bankData ? 'C???p nh???t' : 'Th??m m???i'}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddAndUpdateBank;
