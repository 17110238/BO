import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import React, { Fragment, useState } from 'react';
import { Control, Controller, FormState, UseFormHandleSubmit } from 'react-hook-form';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';

interface PropsComponent {
  t: (str: string) => string;
  control: Control<any>;
  formState: FormState<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  handleSearchLoginHistory: (data: any) => any;
  handleExportFile: () => void;
  register: any;
  reset: any;
}

interface optionType {
  label: string;
  value: string;
}

const listTypes: Array<optionType> = [
  {
    label: 'Mã người dùng',
    value: 'userId',
  },
  {
    label: 'Tên người dùng',
    value: 'username',
  },
  {
    label: 'Mã khách hàng',
    value: 'clientId',
  },
  {
    label: 'IP',
    value: 'ip',
  },
];

export default function LoginHistoryHeader({
  t,
  control,
  formState: { errors },
  handleSubmit,
  handleSearchLoginHistory,
  handleExportFile,
  register,
}: PropsComponent) {
  const loading: boolean = useSelector((state: any) => state.loginHistoryReducer.loading);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  return (
    <Fragment>
      <div className='loginHistory-header'>
        <div className='loginHistory-header__title'>
          <h3>{t('Lịch sử đăng nhập')}</h3>
        </div>
        <div className='loginHistory-header__filter'>
          <button
            className='filter-btn btn btn-active'
            disabled={loading}
            onClick={() => setShowFilter(!showFilter)}
            style={showFilter ? {} : { border: '1px solid #647081' }}>
            <svg
              width={14}
              height={12}
              xmlns='http://www.w3.org/2000/svg'
              style={{ transition: 'all 0.3s ease 0s' }}>
              <path
                d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
                fill={showFilter ? '#00BE00' : '#647081'}
                fillRule='evenodd'
              />
            </svg>
            <p style={showFilter ? {} : { color: '#647081' }}>
              {showFilter ? t('Ẩn lọc') : t('Lọc')}
            </p>
          </button>
        </div>
      </div>
      {showFilter && (
        <form className='loginHistory-search' onSubmit={handleSubmit(handleSearchLoginHistory)}>
          <div className='loginHistory-search__group custom'>
            <input
              className='loginHistory-search__input'
              placeholder={t('Nhập tìm kiếm')}
              {...register('txtSearch')}
            />
            <Controller
              control={control}
              name={'typeSearch'}
              defaultValue={'userId'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  classNamePrefix={'loginHistory-select'}
                  styles={customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  options={listTypes}
                  value={listTypes.find((item: optionType) => item.value === value)}
                  onChange={(e) => onChange(e?.value)}
                />
              )}
            />
          </div>
          <div className='loginHistory-search__group date'>
            <DatePickerCustomV2
              control={control}
              placeholder={'DD/MM/YYYY'}
              // className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              //   ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              //   `}
              // rules={{ from: { required: true }, to: { required: true } }}
            />
          </div>
          <div className='loginHistory-search__group filter'>
            <button type='submit' className='btn btn-primary'>
              <i className='fas fa-search' />
              {t('Tìm')}
            </button>
            {/* <button type='button' className='btn btn-export' onClick={handleExportFile}>
              <img src='/assets/icon/export-file-icon.png' />
              {t('Xuất File')}
            </button> */}
          </div>
        </form>
      )}
    </Fragment>
  );
}
