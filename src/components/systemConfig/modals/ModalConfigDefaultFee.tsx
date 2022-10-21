import EcommerceFeeConfigTable from 'components/Merchant/managerMerchant/detailMerchant/FeeConfigDataTable/EcommerceFeeConfigTable';
import PoboFeeConfigTable from 'components/Merchant/managerMerchant/detailMerchant/FeeConfigDataTable/PoboFeeConfigTable';
import {
  DefaultFeeMerchantConfig,
  FeeMerchantConfig,
  MerchantDefaultFeeItem,
  MerchantFeeItem,
  PaymentMethod,
} from 'models';

import ReactSelect from 'react-select';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDefaultMerchantFeeConfig,
  getpaymentMethodList,
  TypeConfigFeeMcEnum,
  updateEcommerceFeeDefault,
  updatePopoFeeDefault,
} from 'redux/actions';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
}

interface MethodProps {
  value: string;
  label: string;
}

const ModalConfigDefaultFee: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useTranslation('common');
  const formEcommerce = useForm<any>({});
  const formPobo = useForm<any>({});

  const dispatch = useDispatch();

  const defaultFee = useSelector<any, DefaultFeeMerchantConfig>(
    (state) => state?.utility?.defaultMerchantFee
  );
  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  );

  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const [isBtnSubmitPress, setBtnSubmitPress] = useState<boolean>(false);
  const [methodSelected, setMethodSelected] = useState<MethodProps>({
    value: 'ecommerceFee',
    label: t('Ecommerce'),
  });

  const methodFolderId = paymentMethods
    ?.filter((method) => method.paymentType === 'FOLDER')
    .map((method) => method.id);

  const convertFeeDefaultToFee = (defaultFee: MerchantDefaultFeeItem) => {
    if (methodFolderId.includes(defaultFee?.paymentMethodId || 0)) return {};
    return {
      ...defaultFee,
      gatewayFee: { value: defaultFee.gatewayFee },
      fixedGatewayFee: { value: defaultFee.fixedGatewayFee },
      transactionFee: { value: defaultFee.transactionFee },
      fixedTransactionFee: { value: defaultFee.fixedTransactionFee },
    };
  };

  const newDefaultFee = useMemo<FeeMerchantConfig>(
    () => ({
      ecommerceFeeList: defaultFee?.ecommerceFeeList
        ?.map((fee) => convertFeeDefaultToFee(fee))
        .filter((fee) => Object.keys(fee).length),
      poboFeeList: defaultFee?.poboFeeList
        ?.map((fee) => convertFeeDefaultToFee(fee))
        .filter((fee) => Object.keys(fee).length),
    }),
    [defaultFee, paymentMethods]
  );

  const optionTransactionChannel = [
    { value: 'ecommerceFee', label: t('Ecommerce') },
    { value: 'poboFeeList', label: t('Pobo') },
  ];

  const handleSubmitFormFee = (data: MerchantFeeItem[], type: TypeConfigFeeMcEnum) => {
    const payload: MerchantDefaultFeeItem[] = data.map((fee) => {
      return {
        id: fee.paymentMethodId,
        gatewayFee: fee.gatewayFee?.value,
        fixedGatewayFee: fee.fixedGatewayFee?.value,
        transactionFee: fee.transactionFee?.value,
        fixedTransactionFee: fee.fixedTransactionFee?.value,
      };
    });
    switch (type) {
      case TypeConfigFeeMcEnum.ECOMMERCE:
        dispatch(
          updateEcommerceFeeDefault(payload, (state, res) => {
            alert(state ? 'success' : 'error', res?.message, t);
            state && dispatch(getDefaultMerchantFeeConfig());
          })
        );
        break;

      case TypeConfigFeeMcEnum.POBO:
        dispatch(
          updatePopoFeeDefault(payload, (state, res) => {
            alert(state ? 'success' : 'error', res?.message, t);
            state && dispatch(getDefaultMerchantFeeConfig());
          })
        );
        break;

      default:
        break;
    }

    setSubmit(false);
  };

  const handleSubmitFormError: SubmitErrorHandler<
    FeeMerchantConfig | Pick<MerchantFeeItem, 'logInfo'>
  > = (err) => {
    if (!!Object.keys(err).length) {
      setSubmit(false);
    }
  };

  useEffect(() => {
    if (loadingTable) {
      setTimeout(() => {
        setLoadingTable(false);
      }, 500);
    }
  }, [loadingTable]);

  useEffect(() => {
    if (show) {
      !Object.keys(defaultFee).length && dispatch(getDefaultMerchantFeeConfig());
      !paymentMethods.length && dispatch(getpaymentMethodList());
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      className='modal-system-config modal-config-default-fee'
      backdrop='static'
      //keyboard={false}
    >
      <Modal.Header closeButton>{t('Cấu hình phí mặc định')}</Modal.Header>
      <Modal.Body className='detail-merchant-container fee-config-merchant'>
        <div className='fee-config'>
          <div className='fee-config__header'>
            {/* <p className='fee-config__header-title'>{t('Kênh giao dịch')}</p> */}
            <div className='fee-config__header-right'>
              <ReactSelect
                className='transaction-channel-input ml-0'
                classNamePrefix='select-transaction-channel'
                menuPlacement='bottom'
                isSearchable={false}
                value={optionTransactionChannel.find((ele) => ele.value === methodSelected.value)}
                onChange={(value) => {
                  value && setMethodSelected(value);
                  setLoadingTable(true);
                }}
                options={optionTransactionChannel}
              />
            </div>
          </div>
          <div className='fee-config__btn-group'>
            <button
              className='btn btn-primary btn-update-config-fee'
              onClick={() => {
                setBtnSubmitPress(!isBtnSubmitPress);
                setSubmit(true);
              }}>
              <i className='fas fa-save'></i>
              {t('Cập nhật')}
            </button>
          </div>
          <div className='fee-config__content'>
            {methodSelected.value === 'ecommerceFee' ? (
              <EcommerceFeeConfigTable
                loading={loadingTable}
                isSubmit={isSubmit}
                isSubmitBtnPressed={isBtnSubmitPress}
                isApproveFeeConfig={false}
                hideCheckDefault={true}
                checkAll={'INIT'}
                onSubmitForm={handleSubmitFormFee}
                onSubmitError={handleSubmitFormError}
                form={formEcommerce}
                data={newDefaultFee}
                {...{ fixedHeader: true, fixedHeaderScrollHeight: '50vh' }}
              />
            ) : (
              <PoboFeeConfigTable
                loading={loadingTable}
                isSubmit={isSubmit}
                isSubmitBtnPressed={isBtnSubmitPress}
                isApproveFeeConfig={false}
                hideCheckDefault={true}
                checkAll={'INIT'}
                onSubmitForm={handleSubmitFormFee}
                onSubmitError={handleSubmitFormError}
                form={formPobo}
                data={newDefaultFee}
              />
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalConfigDefaultFee;
