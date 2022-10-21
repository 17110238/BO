import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { stateMcEnum } from 'models';
import { UserBo } from 'models/user/accountMerchant';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import { SearchParams } from './ApprovalMerchantContainer';
interface Props {
  loading?: boolean;
  submitForm: boolean;
  saleMembers: UserBo[] | [];
  handleSubmitSearch?: (a: SearchParams) => void;
  handleClearForm?: () => void;
  setSubmitForm: (a: boolean) => void;
}

interface UserBoSelectType {
  label: string;
  value?: number;
}

export const approvalMerchantState = [
  'ALL',
  'PENDING',
  'REJECTED',
  'CONTRACT',
  'CONTRACT_SIGNED',
  'CONTRACT_APPROVING',
  'APPROVING',
];

export default function BoxSearchMerchant({
  loading,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  setSubmitForm,
  saleMembers,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } = useForm<SearchParams>({
    defaultValues: {
      createdAt: {},
      state: 'PENDING',
      type: 'ALL',
    },
  });
  const { query } = useRouter();

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
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
    handleSubmitSearch &&
      handleSubmitSearch({
        state: stateMcEnum.PENDING,
      });
  };

  // list option mechant state
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      const params = { ...router.query };

      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        operatorAccountId: +(router?.query?.operatorAccountId as string),
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      });

      reset(payload, { keepDefaultValues: true });
    }
  }, []);

  const saleList: UserBoSelectType[] = [{}, ...saleMembers].map((sale) => {
    return {
      value: sale.accountId,
      label: sale.fullname || 'Tất cả NV phát triển',
    };
  });

  const approvalMerchantStateOptions = approvalMerchantState.map((value, index) => ({
    value: value,
    label: index === 0 ? 'Tất cả trạng thái' : t(`MC_${value}`),
  }));

  const approvalMerchantMcOptions = ['Tất cả', 'INDIVIDUAL', 'ENTERPRISE'].map((value, index) => ({
    value: index === 0 ? 'ALL' : value,
    label: index === 0 ? 'Tất cả loại đối tác' : t(`${value}`),
  }));

  return (
    <div className='box-search-approval-merchant'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Tìm kiếm: Mã đối tác, Tên đối tác, SDT, Email')}
            autoComplete='off'
            {...register('search')}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Trạng Thái')}</Form.Label> */}
          <Controller
            control={control}
            name={'state'}
            defaultValue={'PENDING'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                isSearchable={false}
                styles={customStyles}
                // defaultValue={{ label: t(`MC_ALL`), value: '' }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                // noOptionsMessage={() => {
                //   // t('Không tìm được kết quả')
                //   return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                // }}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={approvalMerchantStateOptions}
                value={approvalMerchantStateOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-type'>
          {/* <Form.Label>{t('Loại đối tác')}</Form.Label> */}
          <Controller
            defaultValue={'ALL'}
            control={control}
            name={'type'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                isSearchable={false}
                styles={customStyles}
                // defaultValue={{ label: t(`MC_ALL`), value: '' }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                placeholder=''
                // noOptionsMessage={
                //   () => t('Không tìm được kết quả')
                //   // return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                // }
                // value={approvalMerchantMcOptions.find((c: any) => {
                //   if (!value) return c.value === 'ALL';
                //   else {
                //     c.value === value;
                //   }
                // })}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                value={approvalMerchantMcOptions.find((c: any) => c.value === value)}
                options={approvalMerchantMcOptions}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-type form-mc-sale'>
          {/* <Form.Label>{t('Nhân viên phát triển')}</Form.Label> */}
          <Controller
            control={control}
            name={'operatorAccountId'}
            defaultValue={undefined}
            render={({ field, fieldState: { error } }) => (
              <ReactSelect
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
                placeholder=''
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                value={
                  saleList.find(
                    (saler: UserBoSelectType) => Number(saler.value) === Number(field.value)
                  ) || saleList[0]
                }
                options={saleList}
                onChange={(newValue: SingleValue<UserBoSelectType>) =>
                  field.onChange(newValue?.value)
                }
              />
            )}
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
