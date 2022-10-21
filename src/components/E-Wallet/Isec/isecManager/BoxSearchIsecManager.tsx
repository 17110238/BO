import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { FilterSearchIsecManage, IsecEnum, SearchIsecReportEnum, stateMcEnum } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import { isecState, searchIsecType } from './utils/constantOptionSelect';
import _ from 'lodash';
interface Props {
  loading?: boolean;
  handleSubmitSearch?: (a: FilterSearchIsecManage) => void;
  handleClearForm?: () => void;
}

export default function BoxSearchIsecManager({
  loading,
  handleSubmitSearch,
  handleClearForm,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } =
    useForm<FilterSearchIsecManage>({
      defaultValues: {
        createdAt: {},
        state: IsecEnum.PENDING,
      },
    });

  const onSubmit: SubmitHandler<FilterSearchIsecManage> = (data, e) => {
    e?.preventDefault();

    if (loading) return;

    const formatData = clearFalsyObject(data);

    !formatData?.txtSearch && delete formatData.typeSearch;

    handleReplaceUrl(formatData, router);
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
        state: IsecEnum.PENDING,
        createdAt: {},
      });
  };

  const isecStateOptions = isecState.map((value) => ({
    value: value,
    label: value === 'ALL' ? 'Tất cả trạng thái' : t(value),
  }));

  const searchTypeOptions = searchIsecType.map((value) => ({
    value: value,
    label: t(`ISEC_SEARCH_${value}`),
  }));

  useEffect(() => {
    if (Object.keys(router?.query).length) {
      const query: any = clearFalsyObject({
        ...router.query,
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
    <div className='box-search-approval-merchant approval-wallet-kyc-container__box-search isec-container-manage__box-search'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <div className='groups-inputs-search-type'>
            <Form.Control
              type='text'
              placeholder={t('Nhập để tìm kiếm')}
              autoComplete='off'
              {...register('txtSearch')}
            />
            <Controller
              control={control}
              name={'typeSearch'}
              defaultValue={SearchIsecReportEnum.CREATED}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={customStyles}
                  className='form-control-type'
                  classNamePrefix='form-control-select'
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  isSearchable={false}
                  noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                  options={searchTypeOptions}
                  value={searchTypeOptions.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e?.value)}
                />
              )}
            />
          </div>
        </Form.Group>

        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Trạng Thái')}</Form.Label> */}
          <Controller
            control={control}
            name={'state'}
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
                options={isecStateOptions}
                value={isecStateOptions.find((val) => val.value === value) || null}
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
