import numeral, { reset } from 'numeral';
import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface SearchType {
  codeContent: string;
  from: number;
  to: number;
}

interface Props {
  loading?: boolean;
  onSubmitForm: (data: SearchType | {}) => void;
}

const BoxSearchTransactionValue: React.FC<Props> = ({ loading, onSubmitForm }) => {
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
    control,
  } = useForm<SearchType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitForm: SubmitHandler<SearchType> = (data, e) => {
    e?.preventDefault();
    if (loading) return;

    Object.keys(data).forEach((key) => {
      !data[key as keyof SearchType] && delete data[key as keyof SearchType];
    });

    if (data?.from && +data?.from > +data?.to) {
      setError('from', {
        type: 'required',
        message: '',
      });
      return;
    }

    onSubmitForm && onSubmitForm(data);
  };

  return (
    <div className='box-search-transaction-value'>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className='box-search-transaction-value__form'>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Mã MCC / Tên hình thức (VN/EN)')}
            autoComplete='off'
            {...register('codeContent')}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Giá trị từ')}</Form.Label> */}
          <Controller
            control={control}
            name='from'
            render={({ field }) => {
              return (
                <input
                  className={`form-control ${errors?.from ? 'border-danger' : ''}`}
                  type='text'
                  placeholder='Giá trị từ'
                  autoComplete='off'
                  {...field}
                  maxLength={15}
                  onChange={(e) => {
                    if (!/^[0-9]|,*$/.test(e.target.value)) {
                      field.onChange(numeral(field.value).value());
                    } else {
                      field.onChange(numeral(e.target.value).value());
                      clearErrors('from');
                    }
                  }}
                  value={field.value ? numeral(field.value).format('0,0') : ''}
                />
              );
            }}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Giá trị đến')}</Form.Label> */}
          <Controller
            control={control}
            name='to'
            render={({ field }) => {
              return (
                <input
                  className='form-control'
                  type='text'
                  placeholder='Giá trị đến'
                  autoComplete='off'
                  {...field}
                  maxLength={15}
                  onChange={(e) => {
                    if (!/^[0-9]|,*$/.test(e.target.value)) {
                      field.onChange(numeral(field.value).value());
                    } else {
                      field.onChange(numeral(e.target.value).value());
                    }
                  }}
                  value={field.value ? numeral(field.value).format('0,0') : ''}
                />
              );
            }}
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
          <div
            className={`btn btn-clear px-3 mr-3 ${loading && 'btn--disabled'}`}
            onClick={() => {
              if (loading) return;
              reset();
              onSubmitForm && onSubmitForm({});
            }}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BoxSearchTransactionValue;
