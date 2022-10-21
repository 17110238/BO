import { MccCodeListType } from 'models';
import numeral, { reset } from 'numeral';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateMccCodeItem } from 'redux/actions';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  data?: MccCodeListType;
  onHide: (type?: string) => void;
}

const ModalUpdateTransactionValue: React.FC<Props> = ({ show, data, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    control,
    reset,
    handleSubmit,
    clearErrors,
  } = useForm<MccCodeListType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitUpdateTransactionValue: SubmitHandler<MccCodeListType> = (dataSubmit, e) => {
    e?.preventDefault();

    ['code', 'approvedAccountId', 'createdAt', 'updatedAt'].forEach(
      (key) => delete dataSubmit[key as keyof MccCodeListType]
    );

    dispatch(
      updateMccCodeItem(dataSubmit, (state, res) => {
        alert(state ? 'success' : 'error', res.message, t);
        state && onHide && onHide('RESET_LIST');
      })
    );
  };

  useEffect(() => {
    if (show) {
      reset(data);
    }
  }, [show, data]);

  return (
    <Modal
      show={show}
      onHide={() => {
        reset();
        onHide && onHide();
      }}
      backdropClassName='top-modal-backdrop'
      className='modal-update-transaction-value'
      backdrop='static'
      //keyboard={false}
      >
      <Modal.Header closeButton>{t(`Cập nhật hình thức kinh doanh`)}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitUpdateTransactionValue)}>
          <div className='inputs-group'>
            <div className='form-group'>
              <label>
                {t('Mcc Code')}
                <span className='text-danger'> (*)</span>
              </label>
              <input type='text' value={data?.id} disabled={true} />
            </div>
            <Input
              type='text'
              label={t('Tên hình thức KD')}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
              placeholder={t('Hình thức')}
              rules={{ required: true }}
              name='content'
            />
            <Input
              type='text'
              label={t('Tên hình thức KD (EN)')}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
              placeholder={t('Hình thức')}
              rules={{}}
              name='contentEN'
            />
            <div className='form-group'>
              <label>{t('Giá trị giao dịch')}</label>
              <Controller
                control={control}
                name='maxAmountTransaction'
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      field.onChange(numeral(target.value).value());
                    }}
                    maxLength={14}
                    value={numeral(+(field?.value || 0)).format('0,0')}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <button className='btn btn-primary w-100'>
              <i className='fas fa-save'></i>
              {t('Cập nhật')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUpdateTransactionValue;
