import { useRouter } from 'next/router';
import { reset } from 'numeral';
import React, { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';

interface SearchType {
  key?: string;
}

interface Props {
  loading?: boolean;
  onSubmitForm: (data: SearchType | {}) => void;
}

const BoxSearchAdvancedConfig: React.FC<Props> = ({ loading, onSubmitForm }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<SearchType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitForm: SubmitHandler<SearchType> = (data, e) => {
    e?.preventDefault();
    if (loading) return;

    const formatData = clearFalsyObject(data);

    handleReplaceUrl(formatData, router);

    onSubmitForm && onSubmitForm(formatData);
  };

  useEffect(() => {
    if (Object.keys(router.query).length) {
      const filter = clearFalsyObject({
        key: router.query?.key as string,
      });

      reset(filter, { keepDefaultValues: true });
    }
  }, []);

  return (
    <div className='advanced-config-container__box-search'>
      <form onSubmit={handleSubmit(handleSubmitForm)} className='box-search__form'>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Nhập key để tìm kiếm')}
            autoComplete='off'
            {...register('key')}
          />
        </Form.Group>

        <div className='search-button-group'>
          <button
            className='btn btn-primary btn-search px-3 '
            style={{ minWidth: '150px' }}
            disabled={loading}>
            {loading ? (
              <i className='fas fa-spinner fa-pulse'></i>
            ) : (
              <>
                <i className='fas fa-search'></i>
                {t('Tìm kiếm')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoxSearchAdvancedConfig;
