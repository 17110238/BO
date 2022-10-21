import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { FilterSearchKYC, stateMcEnum } from 'models';
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
  handleSubmitSearch?: (a: FilterSearchKYC) => void;
  handleClearForm?: () => void;
}

interface UserBoSelectType {
  label: string;
  value: number | null;
}

const approvalMerchantState = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'IC_PENDING','IDENTIFICATION_EXPIRED'];

export default function BoxSearchMerchant({ loading, handleSubmitSearch, handleClearForm }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: {
      createdAt: {},
      state: 'PENDING',
     // type:''
    },
  });

  const onSubmit: SubmitHandler<FilterSearchKYC> = (data, e) => {
    e?.preventDefault();
    if (loading) return;

    const formatData = clearFalsyObject(data);

    handleReplaceUrl(formatData, router);

    formatData.state === 'ALL' && delete formatData.state;

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
    const params = { ...router.query };
    if (Object.keys(router.query).length > 0) {
      delete params.to;
      delete params.from;
      const payload = clearFalsyObject({
        ...params,
        createdAt: {
          from: router.query?.from ? (router.query?.from as string) : undefined,
          to: router.query?.to ? (router.query?.to as string) : undefined,
        },
      });

      reset(payload, { keepDefaultValues: true });
    }
  }, []);

  const approvalMerchantStateOptions = approvalMerchantState.map((value, index) => ({
    value: value,
    label: index === 0 ? 'Tất cả trạng thái' : t(`MC_${value}`),
  }));
  const IdDefine = [
    { label: "-- Tất cả --", value: "" },
    { label: "CMND", value: "CMND" },
    { label: "CCCD", value: "CCCD" },
    { label: "CCCD IC", value: "CCCDIC" },
    { label: "Hộ chiếu", value: "PASSPORT" },
  ]
  return (
    <div className='box-search-approval-merchant approval-wallet-kyc-container__box-search'>
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
          {/* <Form.Label>{t('Trạng Thái')}</Form.Label> */}
          <Controller
            control={control}
            name={'state'}
            defaultValue={'PENDING'}
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
        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Trạng Thái')}</Form.Label> */}
          <Controller
            control={control}
            name={'type'}
          //  defaultValue={'PENDING'}
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
                placeholder='Loại giấy tờ'
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={IdDefine}
                value={IdDefine.find((val) => val.value === value)||''}
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
            disabled={loading}
            style={{ minWidth: 130 }}>
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
