import { resolve } from 'path/win32';
import React, { FC, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { sendContractMerchant } from 'redux/actions';

import { ActionReducer, MerchantState } from 'models';
import alert from 'utils/helpers/alert';
import { Input } from 'ui/Form';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
interface ModalContractType {
  showModal: boolean;
  merchartId?: string;
  onHide: () => void;
  dataContract: string;
}
interface formProps {
  description: string;
}
export const ModalContract: FC<ModalContractType> = ({ showModal, onHide, dataContract }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const isLoading = useSelector<any, MerchantState>((state) => state.merchantRD?.loadingModal);

  const {
    register,
    clearErrors,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<formProps>();
  const handelSendConstract: SubmitHandler<formProps> = (data, e) => {
    e?.preventDefault();
    dispatch(
      sendContractMerchant(
        {
          merchantId: +dataContract,
          description: data.description,
        },
        (state, res) => {
          if (state) {
            alert('success', t("Gửi hợp đồng thành công."), t);
            reset();
            onHide();
          } else {
            alert('error', res.message, t);
          }
        }
      )
    );
  };
  return (
    <>
      <Modal
        className='modal-account-mc'
        show={showModal}
        onHide={() => {
          onHide();
          reset();
        }}>
        <Modal.Header closeButton>{t('Hợp đồng điện tử')}</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handelSendConstract)} className='inputs-group'>
            <div
              className={`form-group form-input-textarea ${errors?.description ? 'input-custom-error' : ''
                }`}
              style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
              <label>
                {/* {t('Expired time')} */}
                {t('Description')}
                <span className='text-danger'> (*)</span>
              </label>
              <textarea
                className='input-textarea'
                placeholder={t('Nhập mô tả')}
                style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description?.type === 'required' && (
                <p
                  className='mt-10 mb-0 txt-valid align-items-center'
                  style={{ lineHeight: '1.25' }}>
                  <i className='i-valid' />
                  {errors?.description?.message}
                </p>
              )}
            </div>
            <div
              className='btn-info-account-mc'
              style={{ display: 'flex', justifyContent: 'center' }}>
              <button className='btn btn-primary w-100 mt-3'>{t('Gửi')}</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {isLoading && <LoadingFullScreen />}
    </>
  );
};
