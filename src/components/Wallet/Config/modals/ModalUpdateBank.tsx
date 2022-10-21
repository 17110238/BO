import { BankListType, BankUpdateType } from 'models';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';

import ReactSelect from 'react-select';

interface Props {
  show: boolean;
  onHide: () => void;
  bankData: BankListType;
  onUpdateBankRow: (data: BankUpdateType) => void;
}

const ModalAddProvider: React.FC<Props> = ({ show, onHide, bankData, onUpdateBankRow }) => {
  const { t } = useTranslation('common');

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<BankUpdateType>({ reValidateMode: 'onSubmit', shouldFocusError: false });

  const onSubmit = (data: BankUpdateType) => {
    onUpdateBankRow(data);
  };

  useEffect(() => {
    if (show) {
      setValue('bankCodeList.bankCodeId', bankData.bankCodeId);
      setValue('bankCodeList.isActive', bankData.isActive);
      setValue('bankCodeList.gateway', bankData.link.gateway);
      setValue('bankCodeList.requiredDate', bankData.requiredDate);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop='static'
      // keyboard={false}
      dialogClassName='modal-add-provider'>
      <Modal.Header closeButton>
        <h4>{t('Cập nhật ngân hàng')}</h4>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <div className='inputs-group'>
            <div className='form-group'>
              <label htmlFor=''>{t('Swift code')}</label>
              <input
                type='text'
                disabled
                className='form-control'
                defaultValue={bankData.swiftCode}
              />
            </div>
            <div className='form-group'>
              <label htmlFor=''>{t('Tên')}</label>
              <input
                type='text'
                disabled
                className='form-control'
                defaultValue={bankData.shortName}
              />
            </div>
            <div className='form-group form-input-checkbox'>
              <label>{t('Trạng thái')}</label>
              <label className='switch'>
                <input type='checkbox' {...register('bankCodeList.isActive')} />
                <span className='slider around'></span>
              </label>
            </div>
            <Input
              errors={errors}
              type='text'
              label={t('Cổng')}
              register={register}
              clearErrors={clearErrors}
              placeholder={t('Nhập Gateway')}
              rules={{ require: false }}
              name='bankCodeList.gateway'
            />
            <div className='form-group'>
              <label>Dịch vụ</label>
              <Controller
                name='bankCodeList.requiredDate'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <ReactSelect
                    value={options.find((item) => item.value === field.value) || null}
                    className='select-input-form'
                    classNamePrefix='input-select'
                    options={options}
                    onChange={(newVl) => field.onChange(newVl?.value)}
                  />
                )}
              />
            </div>
            <div className='d-flex justify-content-center mt-5'>
              <button type='button' className='btn btn-outline-danger mr-3' onClick={onHide}>
                Đóng
              </button>
              <button type='submit' className='btn btn-primary'>
                Cập nhật
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const options = [
  { label: 'NONE', value: 'NONE' },
  { label: 'EXPIRED_DATE', value: 'EXPIRED_DATE' },
  { label: 'ISSUE_DATE', value: 'ISSUE_DATE' },
];

export default ModalAddProvider;
