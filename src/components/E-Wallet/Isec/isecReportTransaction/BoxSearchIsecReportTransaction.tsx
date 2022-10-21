import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { FilterSearchIsecReportTrans } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import _ from 'lodash';
interface Props {
  loading?: boolean;
  handleSubmitSearch?: (a: FilterSearchIsecReportTrans) => void;
  handleClearForm?: () => void;
}

export default function BoxSearchIsecReportTransaction({
  loading,
  handleSubmitSearch,
  handleClearForm,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } =
    useForm<FilterSearchIsecReportTrans>({
      defaultValues: {},
    });

  const onSubmit: SubmitHandler<FilterSearchIsecReportTrans> = (data, e) => {
    e?.preventDefault();

    if (loading) return;

    const formatData = clearFalsyObject(data);

    handleReplaceUrl(formatData, router);

    handleSubmitSearch && handleSubmitSearch(formatData);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (loading) return;

    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    handleClearForm && handleClearForm();
    handleSubmitSearch && handleSubmitSearch({});
  };

  useEffect(() => {
    if (Object.keys(router?.query).length) {
      const query: any = clearFalsyObject({
        ...router?.query,
        createdAt: {
          from: router?.query?.from as string,
          to: router?.query?.to as string,
        },
      });

      delete query.to;
      delete query.from;

      reset(query, { keepDefaultValues: true });
    }
  }, []);

  return (
    <div className='box-search-approval-merchant isec-report-transaction__box-search mb-4'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search' style={{ minWidth: 300 }}>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Tìm kiếm: Mã giao dịch')}
            autoComplete='off'
            {...register('bulkId')}
          />
        </Form.Group>

        <div className='form-group form-date'>
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
          <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
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
