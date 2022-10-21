import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ReactSelect, { Options } from 'react-select';
import { getMCSDKList } from 'redux/actions';

export interface RevenueMCFilterType {
  merchantId?: number;
  createdAt?: {
    from: string;
    to: string;
  };
}

type MCSDKOptionType = {
  label: string;
  value: string;
};

interface Props {
  isDisableBtn: boolean;
  onSubmitForm: (data: RevenueMCFilterType | {}) => void;
}

const BoxSearchData: React.FC<Props> = ({ isDisableBtn, onSubmitForm }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    clearErrors,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<RevenueMCFilterType>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
    defaultValues: {
      createdAt: {
        from: (router.query?.from as string) ?? dayjs().subtract(30, 'day').toISOString(),
        to: (router.query?.to as string) ?? dayjs().endOf('date').toISOString(),
      },
      merchantId: router.query.merchantId ? Number(router.query.merchantId) : undefined,
    },
  });

  // init state
  const [mcSDKOptions, setMcSDKOptions] = useState<MCSDKOptionType[]>([]);

  useEffect(() => {
    dispatch(
      getMCSDKList(
        {
          paging: {
            start: 0,
            limit: 1000,
          },
        },
        (_state, res) => {
          setMcSDKOptions(
            res.map((item: any) => ({ label: item.merchantName, value: item.merchantId }))
          );
        }
      )
    );
  }, [dispatch]);

  const handleSubmitSearchForm = (data: any) => {
    onSubmitForm({ ...data, merchantId: data.merchantId?.value });
  };

  return (
    <form className='row mb-xs-3 pt-3 px-3' onSubmit={handleSubmit(handleSubmitSearchForm)}>
      <div className='form-group form-search col-xs-4 col-xl-4'>
        <Controller
          name='merchantId'
          control={control}
          render={({ field }) => (
            <ReactSelect<MCSDKOptionType>
              placeholder='Chọn đối tác'
              options={mcSDKOptions}
              value={mcSDKOptions.find((item) => Number(item.value) === Number(field.value))}
              onChange={field.onChange}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 2,
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: 12,
                }),
              }}
            />
          )}
        />
      </div>
      <div className='form-group form-date col-xs-4 col-xl-6'>
        <div className='date-picker-custom'>
          <DatePickerCustomV2
            clearErrors={clearErrors}
            className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
          ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
          `}
            rules={{ from: { required: true }, to: { required: true } }}
            placeholder={'DD/MM/YYYY'}
            control={control}
          />
        </div>
      </div>
      <div className='form-btn col-xs-4 col-xl-2 mb-lg-3'>
        <button className='btn btn-primary btn-search' disabled={isDisableBtn}>
          <i className='fas fa-clipboard-list' />
          {t('Thống kê')}
        </button>
      </div>
    </form>
  );
};

export default BoxSearchData;
