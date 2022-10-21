import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { stateMcEnum } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import _ from 'lodash';
interface Props {
  loading?: boolean;
  handleSubmitSearch?: (a: any) => void;
  handleClearForm?: () => void;
}

const approvalMerchantState = ['ALL', 'APPROVED', 'REJECTED'];
const approvedKYCState = ['ALL', 'AUTO_APPROVED', 'MANUAL_APPROVED'];

export default function BoxSearchMerchant({ loading, handleSubmitSearch, handleClearForm }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: {
      createdAt: {},
      state: 'APPROVED',
      kycAutoState: 'AUTO_APPROVED',
    },
  });
  const { query } = useRouter();

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
    if (loading) return;

    const formatData = clearFalsyObject(data);

    handleReplaceUrl(formatData, router);

    formatData.state === 'ALL' && delete formatData.state;
    formatData.kycAutoState === 'ALL' && delete formatData.kycAutoState;

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
        state: 'APPROVED',
        kycAutoState: 'AUTO_APPROVED',
      });
  };

  // list option mechant state
  useEffect(() => {
    const params = { ...router.query };

    if (Object.keys(query).length > 0) {
      delete params.to;
      delete params.from;
      const payload = clearFalsyObject({
        ...params,
        createdAt: {
          from: router.query?.from as string,
          to: router.query?.to as string,
        },
      });

      reset(payload, { keepDefaultValues: true });
    }
  }, []);

  const approvalMerchantStateOptions = approvalMerchantState.map((value, index) => ({
    value: value,
    label: index === 0 ? 'Tất cả hình thức duyệt' : t(`MC_${value}`),
  }));

  const approvedKYCStateOptions = approvedKYCState.map((value, index) => ({
    value: value,
    label: index === 0 ? 'Tất cả trạng thái' : t(`MC_${value}`),
  }));

  return (
    <div className='box-search-approval-merchant approval-auto-wallet-kyc-container__box-search'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Tìm kiếm: Mã người dùng, Số điện thoại, Họ tên, Số định danh')}
            autoComplete='off'
            {...register('searchString')}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Hình thức duyệt')}</Form.Label> */}
          <Controller
            control={control}
            name={'kycAutoState'}
            defaultValue={'AUTO_APPROVED'}
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
                options={approvedKYCStateOptions}
                value={approvedKYCStateOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Trạng Thái')}</Form.Label> */}
          <Controller
            control={control}
            name={'state'}
            defaultValue={'APPROVED'}
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
                options={approvalMerchantStateOptions}
                value={approvalMerchantStateOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
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
            style={{ minWidth: 130 }}
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
