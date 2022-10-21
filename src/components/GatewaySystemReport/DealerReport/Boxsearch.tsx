import DatePickerCustom from 'components/common/DatePickerCustom/DatePickerBackUp';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import i18next from 'i18next';
import React, { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import { Input } from 'ui/Form';
import customStyles from 'utils/helpers/customStylesForReactSelect';

dayjs.extend(utc);

interface Props {
  handleFilter: (data: any) => void;
  isLoading?: boolean;
}

const DealerBoxsearch: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
  const { reset, handleSubmit, control } = useForm();
  const [dateRange, setDateRange] = useState();

  const stateOptions = [
    { label: 'Hôm nay', value: '' },
    { label: '7 ngày gần đây', value: '7' },
    { label: '30 ngày gần đây', value: '30' },
    { label: '90 ngày gần đây', value: '90' },
    { label: 'Khoảng thời gian', value: 'range' },
    { label: 'Theo tháng', value: 'month' },
  ];

  const onSubmit = (data: any) => {
    handleFilter && handleFilter(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='box-search-container'>
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
                placeholder='Thời gian'
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                  setDateRange(e.value);
                }}
              />
            </div>
          )}
        />
      </div>
      {dateRange === 'range' && (
        <div className='form-group ml-3 mb-sm-3 form-date mb-md-0'>
          <div className='date-picker-custom'>
            <DatePickerCustom control={control} />
          </div>
        </div>
      )}
      {dateRange === 'month' && (
        <div className='form-group ml-3 mb-sm-3 form-date mb-md-0'>
          <div className='date-picker-custom'>
            <DatePickerCustom
              placeholder='MM/YYYY'
              showMonth
              dateFormat='MM/yyyy'
              formatToValue={(date: any) => date && dayjs(date).endOf('month').utc().format()}
              control={control}
            />
          </div>
        </div>
      )}
      <div className='d-flex align-items-center'>
        <button type='submit' className='btn btn-primary btn-search' disabled={isLoading}>
          <i className='fas fa-search'></i>
          {t('Tìm kiếm')}
        </button>
        <button
          className='btn btn-clear ml-2'
          type='button'
          onClick={() => {
            reset();
          }}
          disabled={isLoading}>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </form>
  );
};

export default DealerBoxsearch;
