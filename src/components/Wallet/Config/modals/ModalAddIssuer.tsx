import callApiUPLOAD from 'api/UploadFiles';
import { IssuerAddType, IssuerUpdateType } from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';

const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const target = e.target as HTMLImageElement;

  target.src = '/assets/images/img-na.png';
  target.onerror = null;
};

interface Props {
  show: boolean;
  issuerInfo?: IssuerUpdateType;
  onHide: () => void;
  onAddIssuer: (data: IssuerAddType) => void;
  onUpdateIssuer: (data: IssuerUpdateType) => void;
}

const ModalAddIssuer: React.FC<Props> = ({
  show,
  issuerInfo,
  onHide,
  onAddIssuer,
  onUpdateIssuer,
}) => {
  const { t } = useTranslation('common');
  const [logo, setLogo] = useState<string>('');

  const {
    register,
    handleSubmit,
    clearErrors,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IssuerAddType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const formData = new FormData();
    const files = e.target.files;
    files && formData.append('files', files[0]);

    try {
      const { data: res } = await callApiUPLOAD(formData);
      setLogo(process.env.NEXT_PUBLIC_API_UPLOAD + res.data[0].path);
      setValue('logo', process.env.NEXT_PUBLIC_API_UPLOAD + res.data[0].path);
    } catch (error) {
      alert('error', 'Error Upload File', t);
    }
  };

  const onSubmit = (data: IssuerAddType) => {
    if (!!issuerInfo) {
      onUpdateIssuer(data as IssuerUpdateType);
    } else {
      onAddIssuer(data);
    }
  };

  useEffect(() => {
    if (show) {
      clearErrors();
      if (issuerInfo) {
        reset(issuerInfo);
        setLogo(process.env.NEXT_PUBLIC_API_UPLOAD + issuerInfo.logo);
      }
    }
  }, [show, issuerInfo]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop='static'
      //keyboard={false}
      dialogClassName='modal-add-issuer'>
      <Modal.Header closeButton>
        <h4>{!!issuerInfo ? t('C???p nh???t nh?? ph??t h??nh') : t('Th??m m???i nh?? ph??t h??nh')}</h4>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <div className='inputs-group'>
            <Input
              type='text'
              formGroupClassName={`${errors?.shortName?.message ? 'input-custom-error' : ''}`}
              label={t('T??n ng???n')}
              register={register}
              errors={errors?.shortName}
              clearErrors={clearErrors}
              placeholder={t('Nh???p t??n ng???n')}
              rules={{ required: true }}
              name='shortName'
            />
            <Input
              type='text'
              formGroupClassName={`${errors?.name?.message ? 'input-custom-error' : ''}`}
              label={t('T??n nh?? cung c???p')}
              register={register}
              errors={errors?.name}
              clearErrors={clearErrors}
              placeholder={t('Nh???p t??n nh?? cung c???p')}
              rules={{ required: true }}
              name='name'
            />
            <Input
              type='text'
              formGroupClassName={`${errors?.showName?.message ? 'input-custom-error' : ''}`}
              label={t('T??n hi???n th???')}
              register={register}
              errors={errors?.showName}
              clearErrors={clearErrors}
              placeholder={t('Nh???p t??n hi???n th???')}
              rules={{ required: true }}
              name='showName'
            />
            <div className='form-group'>
              <label>Logo</label>
              <div className='d-flex align-items-center mt-2'>
                {!!logo ? (
                  <div className='img-box'>
                    <img
                      className='w-100 logo-issuer'
                      alt=''
                      src={logo}
                      onError={handleErrorImage}
                    />
                    <button
                      className='btn btn-remove-img'
                      onClick={() => {
                        setLogo('');
                        setValue('logo', '');
                      }}>
                      <i className='fas fa-trash m-0'></i>
                    </button>
                  </div>
                ) : (
                  <label className='btn-upload'>
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    <input
                      accept='image/*'
                      type='file'
                      name='logo'
                      className='d-none'
                      onChange={handleUploadImage}
                    />
                    <span>T???i ???nh</span>
                  </label>
                )}
              </div>
            </div>
            <div className={`form-group ${errors?.service ? 'input-custom-error' : ''}`}>
              <label>
                D???ch v??? <span className='text-danger'> (*)</span>
              </label>
              <Controller
                name='service'
                control={control}
                rules={{
                  required: {
                    message: 'Vui l??ng ch???n d???ch v???',
                    value: true,
                  },
                }}
                render={({ field }) => (
                  <ReactSelect
                    isMulti={true}
                    value={field.value?.map((item) =>
                      serviceOptions.find((elm) => elm.value === item)
                    )}
                    options={serviceOptions}
                    onChange={(newValue) => {
                      clearErrors('service');
                      field.onChange(newValue?.map((vl) => vl?.value));
                    }}
                    placeholder={t('Ch???n d???ch v???')}
                    className='select-input-form'
                    classNamePrefix='input-select'
                    closeMenuOnSelect={false}
                  />
                )}
              />
              {errors?.service && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid'></i> Vui l??ng ch???n d???ch v???
                </p>
              )}
            </div>
            <div className='form-group form-input-textarea'>
              <label>M?? t???</label>
              <textarea
                {...register('description')}
                className='input-textarea w-100'
                name='description'
                cols={50}
                rows={3}
                placeholder='Nh???p m?? t???'
              />
            </div>
            <div className='form-group form-input-textarea'>
              <label>C???u h??nh</label>
              <textarea
                {...register('description')}
                className='input-textarea w-100'
                name='description'
                cols={50}
                rows={3}
                placeholder='Nh???p c???u h??nh'
              />
            </div>
            <div className='form-group'>
              <label>Tr???ng th??i</label>
              <Controller
                name='isActive'
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <ReactSelect
                    value={statusOptions.find((item) => item.value === field.value)}
                    onChange={(newVl) => field.onChange(newVl?.value)}
                    options={statusOptions}
                    placeholder={t('Ch???n tr???ng th??i')}
                    className='select-input-form'
                    classNamePrefix='input-select'
                  />
                )}
              />
            </div>
            <div className='d-flex justify-content-center mt-5'>
              <button type='button' onClick={onHide} className='btn btn-outline-danger mr-3'>
                H???y
              </button>
              <button type='submit' className='btn btn-primary'>
                {!!issuerInfo ? 'C???p nh???t' : 'Th??m m???i'}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const serviceOptions = [
  { label: 'PayME_Credit', value: 'PayME_Credit' },
  { label: 'ATM_Deposit', value: 'ATM_Deposit' },
  { label: 'ATM_Withdraw', value: 'ATM_Withdraw' },
  { label: 'ATM_Payment', value: 'ATM_Payment' },
  { label: 'BILL', value: 'BILL' },
  { label: 'ATM', value: 'ATM' },
  { label: 'Visa', value: 'Visa' },
  { label: 'MasterCard', value: 'MasterCard' },
  { label: 'Vay nhanh', value: 'FAST_LOAN' },
];

const statusOptions = [
  { label: 'Ho???t ?????ng', value: true },
  { label: 'Ng???ng ho???t ?????ng', value: false },
];

export default ModalAddIssuer;
