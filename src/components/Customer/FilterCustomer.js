import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FilterCustomer({ isFilter }) {
  const { t } = useTranslation('common');
  return (
    <div className={isFilter ? 'customer-filter customer-filter__show' : 'customer-filter'}>
      <div className='customer-filter__index'>
        <label htmlFor='filter-index' className='form-label'>
          {t('Filter Customer Index')}
        </label>
        <input
          type='text'
          className='form-control index'
          placeholder={t('Filter Customer Index')}
        />
      </div>
      <div className='customer-filter__id'>
        <label htmlFor='filter-id' className='form-label'>
          {t('Filter Customer Id')}
        </label>
        <input type='text' className='form-control index' placeholder={t('Filter Customer Id')} />
      </div>
      <div className='customer-filter__name customer-filter__item'>
        <label htmlFor='filter-id' className='form-label'>
          {t('Filter Customer Name')}
        </label>
        <input type='text' className='form-control index' placeholder={t('Filter Customer Name')} />
      </div>
      <div className='customer-filter__phone customer-filter__item'>
        <label htmlFor='filter-id' className='form-label'>
          {t('Filter Customer Phone')}
        </label>
        <input
          type='text'
          className='form-control index'
          placeholder={t('Filter Customer Phone')}
        />
      </div>
      <div className='customer-filter__group customer-filter__item'>
        <label htmlFor='filter-id' className='form-label'>
          {t('Filter Customer Group')}
        </label>
        <input
          type='text'
          className='form-control index'
          placeholder={t('Filter Customer Group')}
        />
      </div>
      <div className='customer-filter__seach'>
        <button>{t('Filter Customer')}</button>
      </div>
      <div className='customer-filter__clear'>
        <a href=''>{t('Filter Clear')}</a>
      </div>
    </div>
  );
}
