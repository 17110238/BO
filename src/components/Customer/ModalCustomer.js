import CustomerGroupOption from 'components/common/CustomerGroupOption';
import ModalCustomerGroup from 'components/CustomerGroup/ModalCustomerGroup';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
export default function ModalCustomer({
  show,
  onHide,
  isEdit,
  onSubmitAddCustomer,
  handleSubmit,
  errors,
  register,
  customerGroup,
  handleCustomerGroupOption,
  dropdownRef,
  setError,
  handleChangeCustomerGroup,
  listSelect,
  isSelect,
  openModalCustomerGroup,
  getCustomerGroup,
  isOpen,
}) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const hideModal = () => {
    dispatch(modalCustomerGroup(false));
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      className='modal-addCustomer'
      backdrop='static'
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? `${t('Edit Customer')}` : `${t('Add Customer')}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='modal-customer-container'>
          <form onSubmit={handleSubmit(onSubmitAddCustomer)}>
            <div className='form-group'>
              <label className='label-customer'>{t('Customer Name')}</label>
              <input
                type='text'
                className={`form-control ih-medium ip-light radius-xs b-light px-15 ${
                  errors.name?.type ? 'border-validate invalid' : ''
                }`}
                autoComplete='off'
                placeholder={t('Enter fullname')}
                {...register('name')}
                onChange={(e) => {
                  if (e.target.value) {
                    setError(e.target.name, '');
                  }
                }}
              />
              {errors.name?.type !== 'required' && (
                <div className='err-span d-block' style={{ textAlign: 'left' }}>
                  {errors.name?.message}
                </div>
              )}
            </div>
            <div className='form-group'>
              <label className='label-customer'>{t('Email')}</label>
              <input
                type='text'
                className={`form-control ih-medium ip-light radius-xs b-light px-15 ${
                  errors.email?.message ? 'border-validate invalid' : ''
                }`}
                autoComplete='off'
                placeholder={t('Enter email')}
                {...register('email')}
                onChange={(e) => {
                  if (e.target.value) {
                    setError(e.target.name, '');
                  }
                }}
              />
              {errors.email?.type !== 'required' && (
                <div className='err-span d-block' style={{ textAlign: 'left' }}>
                  {errors.email?.message}
                </div>
              )}
            </div>
            <div className='form-group'>
              <label className='label-customer'>{t('Contact No.')}</label>
              <input
                type='text'
                className={`form-control ih-medium ip-light radius-xs b-light px-15 ${
                  errors.number?.message ? 'border-validate invalid' : ''
                }`}
                autoComplete='off'
                placeholder={t('Contact number')}
                {...register('number')}
                minLength={10}
                maxLength={11}
                onChange={(e) => {
                  if (!new RegExp('^[0-9]+$').test(e.target.value)) {
                    e.target.value = '';
                  } else {
                    setError(e.target.name, '');
                  }
                }}
              />
              {errors.number?.message && (
                <div className='err-span' style={{ textAlign: 'left' }}>
                  {errors.number?.message}
                </div>
              )}
            </div>
            <div className='form-group'>
              <label className='label-customer'>{t('Shipping Address')}</label>
              <input
                type='text'
                className={`form-control ih-medium ip-light radius-xs b-light px-15 ${
                  errors.location?.message ? 'border-validate invalid' : ''
                }`}
                placeholder={t('Enter address')}
                {...register('location')}
                autoComplete='off'
                onChange={(e) => {
                  if (e.target.value) {
                    setError(e.target.name, '');
                  }
                }}
              />
              {errors.location?.type !== 'required' && (
                <div className='err-span' style={{ textAlign: 'left' }}>
                  {errors.location?.message}
                </div>
              )}
            </div>
            <div className='form-group'>
              <ModalCustomerGroup
                isCustomer={true}
                onAfterClose={handleCustomerGroupOption}
                setCustomer={handleChangeCustomerGroup}
                onAfterSave={getCustomerGroup}
              />
              <CustomerGroupOption
                isOpen={customerGroup}
                dropdownRef={dropdownRef}
                listSelect={listSelect}
                handleChangeCustomerGroup={handleChangeCustomerGroup}
                openModalCustomerGroup={openModalCustomerGroup}
                handleCustomerGroupOption={handleCustomerGroupOption}
                isSelect={isSelect}
                t={t}
              />
            </div>
            <div className='form-group'>
              <button className='btn-save' onClick={handleSubmit(onSubmitAddCustomer)}>
                {t('Save')}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
