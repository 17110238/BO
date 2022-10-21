import { PayloadRejectEKYC, stateWalletKYCEnum, WalletKYC } from 'models';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { rejectEKYC, rejectEKYCIC } from 'redux/actions';
import alert from 'utils/helpers/alert';
import { string } from 'yup';
import { rejectKYCWallet } from '../constants/rejectKYCWallet';

interface Props {
  show?: boolean;
  onHide?: (type?: string) => void;
  kycId?: number;
}

const ModalRejectKYCIC: React.FC<Props> = ({ show, kycId, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    setValue,
  } = useForm<Pick<PayloadRejectEKYC, 'reason' | 'id'>>({
    reValidateMode: 'onSubmit',
  });

  const rejectKYCWalletOption = rejectKYCWallet.map((ele, index) => ({
    label: ele,
    value: ele,
  }));

  const submitFormReject: SubmitHandler<Pick<PayloadRejectEKYC, 'reason' | 'id'>> = (data, e) => {
    e?.preventDefault();

    dispatch(
      rejectEKYCIC(
        {
          ...data,
        },
        (state, res) => {
          alert(state ? 'success' : 'error', res?.message, t);
          state && onHide && (onHide('RESET_LIST'), reset());
        }
      )
    );
  };

  useEffect(() => {
    if (show) {
      setValue('id', kycId!);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide && onHide();
        setTimeout(() => {
          reset();
        }, 500);
      }}
      className='modal-basic-ui modal-reject-merchant modal-reject-kyc'
      backdrop='static'
      // keyboard={false}
      >
      <Modal.Header closeButton>
        <p>
          Từ chối IC <span className='highlist--strong'>#ID: {kycId}</span>
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(submitFormReject)}>
          <div className='inputs-group'>
            <div className={`form-group ${errors?.reason?.type ? 'input-custom-error' : ''}`}>
              <label>
                {t('Lý do không duyệt')}
                <span className='text-danger'> (*)</span>
              </label>
              <Controller
                control={control}
                name='reason'
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <ReactSelect
                      className='select-input-form'
                      classNamePrefix='input-select'
                      placeholder={t('Chọn lý do')}
                      options={rejectKYCWalletOption}
                      isClearable
                      onChange={(newValue) => {
                        clearErrors('reason');
                        field.onChange(newValue?.value);
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div>
            <button className='btn btn-danger w-25 mt-3 mx-auto'>{t('Reject')}</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRejectKYCIC;
