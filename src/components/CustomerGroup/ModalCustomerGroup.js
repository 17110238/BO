import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomerGroup, updateCustomerGroup, modalCustomerGroup } from 'redux/actions';
import alert from 'utils/helpers/alert';
import PropTypes from 'prop-types';

const validate = {
  required: 'Customer Group Required',
  max: 'Customer Group Max',
};

export default function ModalCustomerGroup({
  show,
  onHide,
  isEdit,
  customerGroup,
  onAfterSave,
  onAfterClose,
  setCustomer,
}) {
  ModalCustomerGroup.propTypes = {
    onAfterSave: PropTypes.func,
    onAfterClose: PropTypes.func,
    setCustomer: PropTypes.func,
  };
  const isOpen = useSelector((state) => state.customerGroupReducer?.isModal);
  const stateProfile = useSelector((state) => state?.auth?.profile);
  const { t } = useTranslation('common');
  const schema = yup.object().shape({
    name: yup.string().required(t(validate.required)).max(50, t(validate.max)),
  });
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (isEdit) {
      setValue('name', customerGroup?.name);
    }
  }, [customerGroup]);
  const onSubmitAddCustomer = (values) => {
    if (stateProfile?.data?.state !== 'APPROVED') {
      dispatch(showModalKYCConfirm());
    } else {
      if (isEdit && Object.keys(customerGroup).length > 0) {
        const data = { ...values, id: customerGroup.id };
        dispatch(
          updateCustomerGroup(data, (status, data) => {
            if (status) {
              onAfterSave && onAfterSave(0, 999);
              handleCloseModal();
              alert('success', `${t('Update customer group successfully')}`, t);
            } else {
              alert('error', data.message || `${t('Server connection error')}`, t);
            }
          })
        );
      } else {
        dispatch(
          createCustomerGroup(values, (status, data) => {
            if (status) {
              if (setCustomer) {
                onAfterSave();
                setCustomer && setCustomer(values);
                handleCloseModal();
              } else {
                onAfterSave && onAfterSave(0, 999);
                handleCloseModal();
                alert('success', `${t('Add customer group successfully')}`, t);
              }
            } else {
              alert('error', data.message || `${t('Server connection error')}`, t);
            }
          })
        );
      }
    }
  };
  const handleCloseModal = () => {
    reset();
    if (isOpen) {
      dispatch(modalCustomerGroup(false));
    } else {
      onHide();
    }
    onAfterClose && onAfterClose();
  };
  return (
    <Modal
      show={isOpen ? isOpen : show}
      backdropClassName='backdrop-customerGroup'
      onHide={handleCloseModal}
      className='modal-customerGroup'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? `${t('Edit Customer Group')}` : `${t('Add Customer Group')}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='modal-customer-container'>
          <form onSubmit={submitForm(onSubmitAddCustomer)}>
            <div className='form-group'>
              <label className='label-customer__group'>{t('Customer Group')}</label>
              <input
                type='text'
                className={`form-control ih-medium ip-light radius-xs b-light px-15 ${
                  errors.name?.message ? 'border-validate invalid' : ''
                }`}
                autoComplete='off'
                placeholder={t('Enter customer group name')}
                {...register('name')}
                onChange={(e) => {
                  if (e.target.value) {
                    setError(e.target.name, '');
                  }
                }}
              />
              {errors.name && (
                <div className='err-span d-block' style={{ textAlign: 'left' }}>
                  {errors.name.type !== 'required' ? errors.name.message : ''}
                </div>
              )}
            </div>
            <div className='form-group customer-group__btn'>
              <button className='btn-save' onClick={submitForm(onSubmitAddCustomer)}>
                {t('Save')}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
