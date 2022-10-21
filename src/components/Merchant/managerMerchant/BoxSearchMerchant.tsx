import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import i18next from 'i18next';
import { MerchantTypeEnum } from 'models';
import Router, { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
// let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);

interface Props {
  loading: boolean;
  onSubmitSearch?: (data: SearchParams) => void;
  onClearForm?: () => void;
  onExportFile?: (type: string) => Promise<void>;
  saleMembers?: any[];
}

export interface SearchParams {
  search?: string;
  type?: MerchantTypeEnum;
  createdAt?: {
    from?: string;
    to?: string;
  };
  operatorAccountId?: string;
  contractState?: string;
}

const contractState = [
  {label: "Tất cả", value: undefined},
  {label: "Còn hạn", value: "VALID"},
  {label: "Hết hạn", value: "EXPIRED"}
]

export default function BoxSearchMerchant({
  loading,
  saleMembers,
  onSubmitSearch,
  onClearForm,
  onExportFile,
}: Props) {
  const { t } = useTranslation('common');

  const router = useRouter();

  const { register, handleSubmit, getValues, control, reset, setValue } = useForm<SearchParams>({
    defaultValues: {
      createdAt: {
        // from: dayjs().subtract(30, 'day').toISOString(),
        // to: dayjs().endOf('date').toISOString(),
      },
    },
  });

  const saleMemberList = saleMembers?.map((member) => {
    return {
      label: member.fullname,
      value: member.accountId,
    };
  });


  saleMemberList?.unshift({ label: 'Tất cả NV phát triển', value: undefined });

  const onSubmit: SubmitHandler<SearchParams> = (data, e) => {
    e?.preventDefault();
    if (loading) return;

    const formatData = clearFalsyObject(data);

    !formatData.search && delete formatData.search;

    console.log('formatData', formatData)

    handleReplaceUrl(formatData, router);
    onSubmitSearch && onSubmitSearch(formatData);
  };

  const handleClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (loading) return;

    reset();
    Router.replace(router.pathname, undefined, { shallow: true });
    onClearForm && onClearForm();
    onSubmitSearch && onSubmitSearch({});
  };

  useEffect(() => {
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;
    delete params.operatorAccountId;

    const payload = clearFalsyObject({
      ...params,
      ...(router?.query?.operatorAccountId
        ? { operatorAccountId: +(router?.query?.operatorAccountId as string) }
        : {}),
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);

  const merchantTypeOptions = [
    { label: t('Tất cả loại doanh nghiệp'), value: undefined },
    ...Object.values(MerchantTypeEnum).map((value, idex) => ({
      value,
      label: t(`MC_${value}`),
    })),
  ];

  return (
    <>
      <div className='box-search-merchant'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Col} className='form-search'>
            {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
            <Form.Control
              type='text'
              placeholder={t('Tìm kiếm: MC ID, MC Name, Phone, Email')}
              autoComplete='off'
              {...register('search')}
            />
          </Form.Group>
          <div className='form-group px-3 form-date'>
            {/* <Form.Label>{t('Duration')}</Form.Label> */}
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
          </div>

          <Form.Group as={Col} className='form-MC-type'>
            {/* <Form.Label>{t('Loại đối tác')}</Form.Label> */}
            <Controller
              control={control}
              name={'type'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  theme={(theme: any) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  isSearchable={false}
                  noOptionsMessage={() => {
                    return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                  }}
                  options={merchantTypeOptions}
                  value={
                    merchantTypeOptions.find((c) => c.value === value) || merchantTypeOptions[0]
                  }
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>

          <Form.Group as={Col} className='form-MC-type'>
            {/* <Form.Label>{t('Nhân viên phát triển')}</Form.Label> */}
            <Controller
              control={control}
              name={'operatorAccountId'}
              defaultValue={undefined}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  theme={(theme: any) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  noOptionsMessage={() => {
                    return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                  }}
                  options={saleMemberList}
                  value={saleMemberList?.find((c) => c.value === value) || null}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} className='form-MC-contractState'>
            <Controller
              control={control}
              name={'contractState'}
              defaultValue={undefined}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  theme={(theme: any) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  noOptionsMessage={() => {
                    return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                  }}
                  options={contractState}
                  value={contractState?.find((c) => c.value === value) || null}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <div className='d-flex align-items-center search-button-group'>
            <button
              className='btn btn-primary btn-search px-3'
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
            <div
              className={`btn-clear px-3 btn ${loading && 'btn--disabled'}`}
              onClick={handleClearForm}>
              <i className='fas fa-eraser mr-2'></i>
              {t('Clear')}
            </div>
            {/* <button
              type='button'
              className='btn disableHover '
              onClick={() => onExportFile && onExportFile('EXPORT_MERCHANT')}>
              <img src={`/assets/icon/export-icon.png`} alt='export=icon' />
              {t('Xuất file')}
            </button> */}
          </div>
        </Form>
      </div>
    </>
  );
}
