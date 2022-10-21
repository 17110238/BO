import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import i18next from 'i18next';
import React, { FC, useEffect, useMemo, useState } from 'react';
import utc from 'dayjs/plugin/utc';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { getpaymentMethodList } from 'redux/actions';
import customStyles from 'utils/helpers/customStylesForReactSelect';

dayjs.extend(utc);
interface Props {
  handleFilter: (data: any) => void;
  isLoading?: boolean;
}

const DealerBoxsearch: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [initValue, setInitValue] = useState();
  const { reset, handleSubmit, control } = useForm({
    defaultValues: useMemo(() => {
      return initValue;
    }, [initValue]),
  });
  const [dateRange, setDateRange] = useState();
  const [methodOptions, setMethodOptions] = useState<any>();

  useEffect(() => {
    dispatch(
      getpaymentMethodList((state, data) => {
        let newMethodList: any = [{ label: 'Tất cả PTTT', value: '' }];
        if (state) {
          data.map((method: any) => {
            if (method.paymentType !== 'FOLDER') {
              newMethodList.push({ label: method.name, value: method.payCode });
            }
          });
          setMethodOptions(newMethodList);
        }
      })
    );
  }, []);

  const stateOptions = [
    { label: 'Hôm nay', value: '' },
    { label: '7 ngày gần đây', value: '7' },
    { label: '30 ngày gần đây', value: '30' },
    { label: '90 ngày gần đây', value: '90' },
    { label: 'Khoảng thời gian', value: 'range' },
  ];

  const onSubmit = (data: any) => {
    handleFilter(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='box-search-container'>
      <div className='form-group'>
        <Controller
          control={control}
          name='method'
          defaultValue={''}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue=''
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={methodOptions}
                value={
                  methodOptions &&
                  methodOptions.find((val: any) => {
                    if (typeof value === 'object') return val.value === '';
                    else {
                      return val.value === value;
                    }
                  })
                }
                placeholder='Phương thức thanh toán'
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
          name='date'
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
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
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
