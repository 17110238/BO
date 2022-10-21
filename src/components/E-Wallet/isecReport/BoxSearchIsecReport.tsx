import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { FilterSearchEWalletIsecReportAccount } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import _ from 'lodash';
interface Props {
  loading: boolean;
  handleSubmitSearch?: (a: FilterSearchEWalletIsecReportAccount) => void;
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
    useForm<FilterSearchEWalletIsecReportAccount>({
      defaultValues: {},
    });

  const onSubmit: SubmitHandler<FilterSearchEWalletIsecReportAccount> = (data, e) => {
    e?.preventDefault();
    if (loading) return;

    const formatData = clearFalsyObject(data);

    !formatData.txtSearch && delete formatData?.txtSearch;
    !Object.keys(formatData?.createdAt).length && delete formatData?.createdAt;

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

  const accountTypeOptions = accountType.map((type, index) => ({
    value: type === 'ALL' ? undefined : type,
    label: index === 0 ? 'Tất cả loại khách hàng' : t(`ISEC_REPORT_${type.toUpperCase()}`),
  }));

  return (
    <div className='box-search-approval-merchant isec-report-transaction__box-search mb-4'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Tìm kiếm: Mã người dùng / SDT')}
            autoComplete='off'
            {...register('txtSearch')}
          />
        </Form.Group>

        <Form.Group as={Col} className='form-state'>
          {/* <Form.Label>{t('Loại khách hàng')}</Form.Label> */}
          <Controller
            control={control}
            name={'typeSearch'}
            defaultValue={undefined}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                isSearchable={false}
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
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={accountTypeOptions}
                value={accountTypeOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <div className='form-group form-date'>
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
          </div>
        </div>
        <div className='d-flex align-items-center search-button-group'>
          <button
            className='btn btn-primary btn-search'
            disabled={loading}
            style={{ minWidth: '130px' }}>
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

const accountType = ['ALL', 'BUSINESS', 'PERSONAL'];
