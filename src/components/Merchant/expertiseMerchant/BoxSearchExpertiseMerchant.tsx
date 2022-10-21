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
import { handleReplaceUrl,handleReplaceUrlv2 } from 'utils/helpers/replaceUrl';
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

  createdAt?: {
    from?: string;
    to?: string;
  };
  operatorAccountId?: string;
}

export default function BoxSearchMerchant({
  loading,
  saleMembers,
  onSubmitSearch,
  onClearForm,
  onExportFile,
}: Props) {
  const { t } = useTranslation('common');

  const router = useRouter();

  const { register, handleSubmit, getValues, control, reset, setValue } = useForm<any>({
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

  saleMemberList?.unshift({ label: 'Tất cả nhân viên', value: undefined });

  const onSubmit: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    if (loading) return;

    const formatData = JSON.parse(JSON.stringify(data));

    !formatData.search && delete formatData.search;

    handleReplaceUrlv2(formatData, router);
    onSubmitSearch && onSubmitSearch(data);
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

    delete params.to;
    delete params.from;
    delete params.operatorAccountId;

    const payload = JSON.parse(
      JSON.stringify({
        ...params,
        ...(router?.query?.operatorAccountId
          ? { operatorAccountId: +(router?.query?.operatorAccountId as string) }
          : {}),
          createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      })
    );

    !Object.keys(payload.createdAt).length && delete payload.createdAt;
    !payload.search && delete payload.search;
    reset(payload, { keepDefaultValues: true });
  }, []);

  return (
    <>
      <div className='box-search-merchant'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className='form-search'>
            <Form.Control
              type='text'
              placeholder={t('MC ID, MC Name, Phone, Email')}
              autoComplete='off'
              {...register('search')}
            />
          </Form.Group>
          <div className='form-group px-3 form-date'>
            <div className='date-picker-custom'>
              <DatePickerCustomV2 control={control} />
            </div>
          </div>

          <Form.Group as={Col} className='form-MC-type'>
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
                  placeholder={'Chọn nhân viên'}
                  options={saleMemberList}
                  value={saleMemberList?.find((c) => c.value === value) || null}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <div className='d-flex ml-3 search-button-group'>
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
          </div>
        </Form>
      </div>
    </>
  );
}
