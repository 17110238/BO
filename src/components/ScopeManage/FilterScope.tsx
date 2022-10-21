import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

interface ScopeProps {
  handleFilter: (data: any) => void;
  isLoading: boolean;
  setSubmitForm: (a: boolean) => void;
}

const FilterScope: FC<ScopeProps> = ({ handleFilter, isLoading }) => {
  const defaultValue = {
    scope: '',
    description: '',
  };
  const [initValue, setInitValue] = useState();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: useMemo(() => {
      return initValue;
    }, [initValue]),
  });
  const router = useRouter();
  const { query }: any = router;
  const { t } = useTranslation('common');

  useEffect(() => {
    reset(initValue);
    handleFilter(initValue);
  }, [initValue]);

  useEffect(() => {
    setInitValue(query);
  }, [query]);

  const onSubmit = (data: any) => {
    if (data.scope !== '' || data.description !== '') {
      router.push({ query: { ...data } });
      return;
    }
    router.replace('/cong-thanh-toan/quan-li-quyen', undefined, { shallow: true });
    handleFilter(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='box-search-container'>
      <div className='form-group mb-3'>
        <Form.Control
          type='text'
          placeholder={t('Nhập scope')}
          autoComplete='off'
          {...register('scope')}
        />
      </div>
      <div className='form-group mb-3'>
        <Form.Control
          type='text'
          placeholder={t('Nhập mô tả scope')}
          autoComplete='off'
          {...register('description')}
        />
      </div>
      <div className='d-flex align-items-center mb-3'>
        <button type='submit' className='btn btn-primary btn-search mt-0' disabled={isLoading}>
          <i className='fas fa-search'></i>
          {t('Tìm kiếm')}
        </button>

        <button
          type='button'
          disabled={isLoading}
          className='btn-clear ml-2'
          onClick={() => {
            reset(defaultValue);
            router.replace('/cong-thanh-toan/quan-li-quyen', undefined, { shallow: true });
          }}>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </Form>
  );
};

export default FilterScope;
