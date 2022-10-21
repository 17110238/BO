import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { GetReportLinkedBankPayLoad } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { getListBank } from 'redux/actions/manualBankAction';

interface Props {
  onSearch: (data: GetReportLinkedBankPayLoad) => void;
}

const BoxSearchReportBank: React.FC<Props> = ({ onSearch }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();

  const [bankOptions, setBankOptions] = useState<{ label: string; value: string }[]>([]);

  const { control, handleSubmit, reset, setValue } = useForm({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
  });

  const onSubmitSearch = (formValue: GetReportLinkedBankPayLoad) => {
    onSearch(formValue);
  };

  const onClearSearch = useCallback(() => {
    reset({});
  }, [reset]);

  useEffect(() => {
    dispatch(
      getListBank((stt, res) => {
        if (stt)
          setBankOptions(
            res?.map((item: any) => ({ label: item?.bankName, value: item?.swiftCode }))
          );
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      setValue('filter.swiftCode', router.query?.swiftCode);
      setValue('filter.dateFilter.from', router.query?.from);
      setValue('filter.dateFilter.to', router.query?.to);
    }
  }, []);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmitSearch)}
      className='row form-search-link-bank pt-3 px-3'>
      <div className='form-group form-date col-xl-6 col-lg-auto'>
        <div className='date-picker-custom'>
          <DatePickerCustomV2
            placeholder={'DD/MM/YYYY'}
            control={control}
            inputNameFrom={'filter.dateFilter.from'}
            inputNameTo={'filter.dateFilter.to'}
          />
        </div>
      </div>
      <div className='form-group col-xl-3 col-lg-auto'>
        <Controller
          name='filter.swiftCode'
          control={control}
          render={({ field }) => (
            <ReactSelect
              value={bankOptions.find((item) => item?.value === field.value) || null}
              options={bankOptions}
              onChange={(currentValue) => field.onChange(currentValue?.value)}
              placeholder={t('Tất cả ngân hàng')}
              className='select-input-form'
              classNamePrefix='input-select'
              isClearable
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 2 }),
                control: (provided) => ({ ...provided, borderRadius: 8 }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#495057',
                  borderColor: '#9fa4b9',
                }),
                placeholder: (provided) => ({ ...provided, color: '#9fa4b9' }),
              }}
            />
          )}
        />
      </div>
      <div className='form-group col-xl-3 col-lg-auto d-flex align-items-center px-xl-0'>
        <button className='btn btn-primary btn-search' type='submit'>
          <i className='fas fa-search'></i>
          {t('Thống kê')}
        </button>
        <button className='btn btn-default btn-clear ml-3' onClick={onClearSearch}>
          <i className='fas fa-eraser mr-2' />
          {t('Xóa')}
        </button>
      </div>
    </form>
  );
};

export default React.memo(BoxSearchReportBank);
