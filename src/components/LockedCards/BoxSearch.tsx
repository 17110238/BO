import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export interface SearchParams {
  serialNumber?: string;
}

interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  setSubmitForm: (a: boolean) => void;
  onLockCard: () => void;
  getPayloadFromURL: () => any;
}

export default function BoxSearch({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm,
  setSubmitForm,
  onLockCard,
  getPayloadFromURL,
}: Props) {
  const { t } = useTranslation('common');
  const query = useRouter().query;

  const { register, getValues, control, handleSubmit, reset, clearErrors, setFocus } =
    useForm<SearchParams>();

  const isLoading = useSelector<any, boolean>((state) => state?.lockedCardReducer?.loading);

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && isLoading && e.preventDefault();
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any) => {
    handleSubmitSearch && handleSubmitSearch(data);
  };

  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [query]);

  useEffect(() => {
    const payload = getPayloadFromURL();
    reset(payload);
  }, []);

  return (
    <>
      {showFilter && (
        <div className='box-search-locked-cards-list'>
          <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
            <div className='box-search-locked-card'>
              <Form.Group as={Col} className='form-search' xl='2' sm='2'>
                <Form.Label></Form.Label>
                <Form.Control
                  type='text'
                  placeholder={`${t('Enter')}: ${
                    t('Số thẻ').charAt(0).toLocaleLowerCase() + t('Số thẻ').slice(1)
                  }`}
                  autoComplete='off'
                  {...register('serialNumber')}
                />
              </Form.Group>

              <div className='d-flex align-items-center search-button-group'>
                <button className='btn btn-primary' disabled={isLoading}>
                  <i className='fas fa-search'></i>
                  <p>{t('Tìm')}</p>
                </button>
              </div>
            </div>

            <div className='lock-card'>
              <div className='d-flex align-items-center search-button-group'>
                <div className='btn btn-primary btn-lock' onClick={onLockCard}>
                  <i className='fas fa-lock'></i>
                  <p>{t('Khóa')}</p>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}
