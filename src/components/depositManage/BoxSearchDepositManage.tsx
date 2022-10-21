import { t } from 'i18next';
import React, { MouseEventHandler, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import { useRouter } from 'next/router';
import { handleReplaceUrl } from 'utils/helpers/replaceUrl';

export interface PayloadDepositFilterType {
  merchantId: number | undefined;
}

interface Props {
  loading?: boolean;
  onSubmitForm: (data: PayloadDepositFilterType | {}) => void;
  handleClearForm?: () => void;
}

const BoxSearchDepositManage: React.FC<Props> = ({ loading, onSubmitForm, handleClearForm }) => {
  const { control, clearErrors, reset, handleSubmit } = useForm<PayloadDepositFilterType>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
  });
  const router = useRouter();

  const handleSubmitSearchForm: SubmitHandler<PayloadDepositFilterType> = (data, e) => {
    e?.preventDefault();
    if (loading) return;

    const formatData = data.merchantId && data.merchantId !== -1 ? data : {};
    handleReplaceUrl(formatData, router);
    onSubmitForm && onSubmitForm(formatData);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (loading) return;

    reset();
    router.replace(router.pathname, undefined, { shallow: true });
    handleClearForm && handleClearForm();
    onSubmitForm && onSubmitForm({});
  };

  useEffect(() => {
    let formatData = {};
    if (Object.keys(router?.query).length) {
      const payload = {
        merchantId: +(router?.query?.merchantId || 0),
      };
      formatData = payload.merchantId && payload.merchantId !== -1 ? payload : {};

      reset(formatData, { keepDefaultValues: true });
    }
    onSubmitForm && onSubmitForm(formatData);
  }, []);

  return (
    <div className='deposit-manage__box-search'>
      <form onSubmit={handleSubmit(handleSubmitSearchForm)}>
        <div className='form-group form-search'>
          {/* <label>{t('Tất cả Merchant')}</label> */}
          <AsyncSelect
            asyncType='MERCHANT'
            control={control}
            clearError={clearErrors}
            name='merchantId'
            keyReturn='merchantId'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </div>
        <div className='form-btn'>
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
        </div>
      </form>
    </div>
  );
};

export default BoxSearchDepositManage;
