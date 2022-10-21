import React from 'react';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerBackUp';
import { useForm } from 'react-hook-form';
import { ReportPartnerInput } from 'models';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

const BoxSearchData: React.FC<{
  isLoading: boolean;
  onSearch: (data: ReportPartnerInput) => void;
}> = ({ onSearch, isLoading }) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { control, handleSubmit } = useForm<ReportPartnerInput>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
    defaultValues: {
      filter: {
        createdAt: {
          from: (router.query?.from as string) ?? dayjs().subtract(30, 'day').toISOString(),
          to: (router.query?.to as string) || dayjs().endOf('date').toISOString(),
        },
      },
    },
  });

  const handleSubmitSearchForm = (data: ReportPartnerInput) => {
    onSearch(data);
  };

  return (
    <form className='row pt-3 px-3' onSubmit={handleSubmit(handleSubmitSearchForm)}>
      <div className='form-group mb-0 col-md-auto col-sm-12'>
        <div className='date-picker-custom'>
          <DatePickerCustomV2
            placeholder={'DD/MM/YYYY'}
            control={control}
            inputNameFrom='filter.createdAt.from'
            inputNameTo='filter.createdAt.to'
          />
        </div>
      </div>

      <div className='form-group mb-0 col-auto mt-md-0 mt-sm-3 mt-3'>
        <button className='btn btn-primary btn-search' disabled={isLoading}>
          <i className='fas fa-clipboard-list' />
          {t('Thống kê')}
        </button>
      </div>
    </form>
  );
};

export default BoxSearchData;
