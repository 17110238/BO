import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { FilterSearchIsecManage } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { handleReplaceUrl } from 'utils/helpers/replaceUrl';
import _ from 'lodash';
interface Props {
  loading?: boolean;
  handleSubmitSearch?: (a: FilterSearchIsecManage) => void;
  handleClearForm?: () => void;
}

export default function BoxSearchIsecReport({
  loading,
  handleSubmitSearch,
  handleClearForm,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } =
    useForm<FilterSearchIsecManage>({
      defaultValues: {
        createdAt: {
          from: dayjs().subtract(30, 'day').startOf('date').toISOString(),
          to: dayjs().endOf('date').toISOString(),
        },
      },
    });

  const onSubmit: SubmitHandler<FilterSearchIsecManage> = (data, e) => {
    e?.preventDefault();

    if (loading) return;

    const formatData = _.pickBy(JSON.parse(JSON.stringify(data)));

    handleReplaceUrl(formatData, router);

    !Object.keys(formatData?.createdAt || {})?.length && delete formatData.createdAt;

    handleSubmitSearch && handleSubmitSearch(formatData);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (loading) return;

    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    handleClearForm && handleClearForm();
    handleSubmitSearch &&
      handleSubmitSearch({
        createdAt: {
          from: dayjs().subtract(30, 'day').startOf('date').toISOString(),
          to: dayjs().endOf('date').toISOString(),
        },
      });
  };

  useEffect(() => {
    if (Object.keys(router?.query).length) {
      const query: any = {
        createdAt: {
          from:
            (router?.query?.from as string) ||
            dayjs().subtract(30, 'day').startOf('date').toISOString(),
          to: (router?.query?.to as string) || dayjs().endOf('date').toISOString(),
        },
      };

      delete query.to;
      delete query.from;

      reset(query, { keepDefaultValues: true });
    }
  }, []);

  return (
    <div className='box-search-approval-merchant isec-container-report__box-search'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group form-date'>
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
          </div>
        </div>
        <div className='d-flex align-items-center search-button-group'>
          <button
            className='btn btn-primary btn-search'
            style={{ minWidth: '130px' }}
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
          <div className={`btn btn-clear ${loading && 'btn--disabled'}`} onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>
        </div>
      </Form>
    </div>
  );
}
