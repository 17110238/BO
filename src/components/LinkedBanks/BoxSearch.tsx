import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import { Input } from 'ui/Form';
import customStyles from 'utils/helpers/customStylesForReactSelect';

interface Props {
  handleFilter: (data: any) => void;
  isLoading: boolean;
}

const LinkedBanksBoxSearch: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
  const defaultValue = {
    search: '',
    searchType: 'PHONE',
    state: '',
  };
  const router = useRouter();
  const { query }: any = router;
  const [initValue, setInitValue] = useState();
  const {
    register,
    clearErrors,
    reset,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: useMemo(() => {
      return initValue;
    }, [initValue]),
  });
  const searchTypeOptions = [
    { label: 'Số điện thoại', value: 'PHONE' },
    { label: 'Mã tài khoản', value: 'ACCOUNT_ID' },
    { label: 'Số thẻ', value: 'BANK_ACCOUNT' },
  ];

  const stateOptions = [
    { label: 'Tất cả', value: '' },
    { label: 'Mới', value: 'NEW' },
    { label: 'Đã liên kết', value: 'LINKED' },
    { label: 'Hủy liên kết', value: 'UNLINK' },
    { label: 'Đã khóa', value: 'LOCKED' },
    { label: 'Thất bại', value: 'FAILED' },
    { label: 'Yêu cầu OTP', value: 'REQUIRED_OTP' },
    { label: 'Yêu cầu xác thực', value: 'REQUIRED_VERIFY' },
  ];

  useEffect(() => {
    reset(initValue);
    handleFilter(initValue);
  }, [initValue]);

  useEffect(() => {
    setInitValue(query);
  }, [query]);

  const onSubmit = (data: any) => {
    router.push({ query: { ...data } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='box-search-container'>
      <Input
        type='text'
        style={{ height: '2.5rem' }}
        label=''
        register={register}
        name='search'
        errors={errors}
        clearErrors={clearErrors}
        placeholder='Nhập thông tin tìm kiếm'
        rules={{}}
      />
      <div className='form-group'>
        <Controller
          control={control}
          name='searchType'
          defaultValue={'PHONE'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ label: 'Số điện thoại', value: 'PHONE' }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={searchTypeOptions}
                value={searchTypeOptions.find((val) => {
                  if (typeof value === 'object') return val.value === '';
                  else {
                    return val.value === value;
                  }
                })}
                placeholder=''
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            </div>
          )}
        />
      </div>
      <div className='form-group'>
        <Controller
          control={control}
          name='state'
          defaultValue={''}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ label: 'All', value: '' }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={stateOptions}
                value={stateOptions.find((val) => {
                  if (typeof value === 'object') return val.value === '';
                  else {
                    return val.value === value;
                  }
                })}
                placeholder='Trạng thái'
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            </div>
          )}
        />
      </div>
      <div className='d-flex align-items-center'>
        <button type='submit' className='btn btn-primary btn-search' disabled={isLoading}>
          <i className='fas fa-search'></i>
          {t('Tìm kiếm')}
        </button>
        <button
          className='btn btn-clear ml-2'
          type='button'
          onClick={() => {
            reset(defaultValue);
            router.replace('/vi-dien-tu/quan-li-nguoi-dung/lien-ket-ngan-hang', undefined, {
              shallow: true,
            });
            handleFilter(defaultValue);
          }}
          disabled={isLoading}>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </form>
  );
};

export default LinkedBanksBoxSearch;
