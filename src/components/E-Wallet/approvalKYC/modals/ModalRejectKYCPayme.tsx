import { PayloadRejectEKYC, WalletKYC } from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { rejectEKYC, getEKYCList } from 'redux/actions';
import alert from 'utils/helpers/alert';
import { rejectKYCWallet } from '../constants/rejectKYCWallet';

interface Props {
  show?: boolean;
  onHide?: (type?: string) => void;
  kycId?: number;
  updateMerchantInfo?: () => void;
}

const ModalRejectKYCPayme: React.FC<Props> = ({ show, kycId, onHide, updateMerchantInfo }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm<PayloadRejectEKYC>();

  const rejectKYCWalletOption = rejectKYCWallet.map((ele, index) => ({
    label: ele,
    value: ele,
  }));

  const submitFormReject: SubmitHandler<PayloadRejectEKYC> = (data, e) => {
    e?.preventDefault();

    dispatch(
      rejectEKYC(data, (state, res) => {
        updateMerchantInfo && updateMerchantInfo();
        alert(state ? 'success' : 'error', res?.message, t);
        state && onHide && (onHide('RESET_LIST'), reset());
      })
    );
  };

  useEffect(() => {
    if (show) {
      setValue('id', kycId!);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide && onHide();
        setTimeout(() => {
          reset();
        }, 500);
      }}
      className='modal-basic-ui modal-reject-merchant modal-reject-kyc'
      backdrop='static'
      // keyboard={false}
      >
      <Modal.Header closeButton>
        <p>
          Từ chối KYC <span className='highlist--strong'>#ID: {kycId}</span>
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(submitFormReject)}>
          <div className='inputs-group'>
            <div className='form-group-multi-checkbox mb-3'>
              <label>{t('Thông tin không hợp lệ')}</label>
              <div className='checkbox-group'>
                <label className='custom-checkbox'>
                  <input type='checkbox' defaultChecked={false} {...register('imageState')} />
                  <span className='custom-checkbox__checkmark'>Từ chối hình ảnh</span>
                </label>
                <label className='custom-checkbox'>
                  <input type='checkbox' defaultChecked={false} {...register('videoState')} />
                  <span className='custom-checkbox__checkmark'>Từ chối video</span>
                </label>
                <label className='custom-checkbox'>
                  <input type='checkbox' defaultChecked={false} {...register('faceState')} />
                  <span className='custom-checkbox__checkmark'>Từ chối ảnh khuôn mặt</span>
                </label>
                <label className='custom-checkbox'>
                  <input type='checkbox' defaultChecked={false} {...register('merchantState')} />
                  <span className='custom-checkbox__checkmark'>Từ chối giấy phép kinh doanh</span>
                </label>
              </div>
            </div>
            <div className={`form-group ${errors?.reason?.type ? 'input-custom-error' : ''}`}>
              <label>
                {t('Lý do không duyệt')}
                <span className='text-danger'> (*)</span>
              </label>
              <Controller
                control={control}
                name='reason'
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <ReactSelect
                      className='select-input-form'
                      classNamePrefix='input-select'
                      placeholder={t('Chọn lý do')}
                      options={rejectKYCWalletOption}
                      isClearable
                      onChange={(newValue) => {
                        field.onChange(newValue?.value);
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div>
            <button className='btn btn-danger w-25 mt-3 mx-auto'>{t('Reject')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRejectKYCPayme;
