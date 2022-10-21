import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface SearchType {
  key?: string;
}

interface Props {
  onSubmitForm: (data: SearchType | {}) => void;
}

const BoxSearchAdvancedConfig: React.FC<Props> = ({ onSubmitForm }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, setValue, handleSubmit } = useForm<SearchType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitForm: SubmitHandler<SearchType> = (data, e) => {
    e?.preventDefault();
    data.key === '' && delete data.key;
    onSubmitForm && onSubmitForm(data);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;

    if (target.value.length === 0) {
      onSubmitForm && onSubmitForm({});
    }
  };

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      setValue('key', router.query?.key as string);
    }
  }, [router.query]);

  return (
    <div className='advanced-config-container__box-search'>
      <form onSubmit={handleSubmit(handleSubmitForm)} className='box-search__form'>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Nhập key để tìm kiếm')}
            autoComplete='off'
            {...register('key', {
              onChange: handleInputChange,
            })}
          />
        </Form.Group>

        <div className='search-button-group'>
          <button className='btn btn-primary btn-search px-3 '>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoxSearchAdvancedConfig;
