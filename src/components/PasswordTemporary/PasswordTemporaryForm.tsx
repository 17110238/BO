import { t } from 'i18next';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import AsyncSelectMerchant from 'components/common/AsyncSelect/AsyncSelect';
import ReactSelect from 'react-select';
import { Button, Form, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CopyToClipboard from 'react-copy-to-clipboard';
import swal from 'sweetalert2';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import { passwordTemporary } from 'redux/actions';
import { useDispatch } from 'react-redux';
import { AccountMerchant } from 'models';
interface Props {
  onSubmitForm: (data: any | {}) => void;
}

const expiredDateOptions = [
  { value: 5, label: 'Hết hạn trong 5 phút' },
  { value: 10, label: 'Hết hạn trong 10 phút' },
  { value: 20, label: 'Hết hạn trong 20 phút' },
  { value: 30, label: 'Hết hạn trong 30 phút' },
  { value: 60, label: 'Hết hạn trong 1 giờ' },
];

const PasswordTemporaryForm: React.FC<Props> = ({ onSubmitForm }) => {
  const dispatch = useDispatch();
  const [copy, setCopy] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const schema = yup
    .object({
      account: yup.object({
        accountId: yup.string().required('ID / Tên đăng nhập không được để trống'),
        username: yup.string(),
      }),
      description: yup.string().required('Lý do không được để trống'),
    })
    .required();

  const {
    register,
    control,
    formState: { errors },
    getValues,
    clearErrors,
    handleSubmit,
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver<any>(schema),
  });

  const handleSubmitSearchForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();

    const dataUpdate = {
      accountId: Number(data.account.accountId),
      expireAfterMinute: data.expireAfterMinute,
      description: data.description,
    };

    dispatch(
      passwordTemporary(dataUpdate, (status, res) => {
        if (status) {
          setPassword(res?.password);
          setUsername(getValues('account.username'));
        } else {
          setPassword('');
        }
      })
    );
  };

  const renderTooltip = (props: any) => (
    <Tooltip id='button-tooltip' {...props}>
      {t('Sao chép!')}
    </Tooltip>
  );

  return (
    <div className='password-modal__body'>
      <Form onSubmit={handleSubmit(handleSubmitSearchForm)}>
        <div className={`form-search form-group ${errors?.account && 'form-group__error'}`}>
          <label className='form-label'>{t('ID / Tên đăng nhập')}</label>
          <AsyncSelect
            height='200'
            asyncType='ACCOUNT_MERCHANT'
            control={control}
            clearError={clearErrors}
            name='account'
            formatLabel={(account: AccountMerchant) => (
              <p className='m-0'>
                {`${account.accountId} - `}
                {account?.username ? (
                  `${account?.username} -`
                ) : (
                  <span className='font-italic text-light-blur'>{`[ Rỗng ] -`}</span>
                )}
                {account?.fullname ? (
                  <span className='font-weight-bold'>{` ${account?.fullname} `}</span>
                ) : (
                  <span className='font-italic text-light-blur'>{` [ Rỗng ] `}</span>
                )}
                
              </p>
            )}
            isAllowSearchAll={false}
            initLabel='Danh sách tài khoản'
            keyReturn='accountId'
            returnType='full'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
          {errors?.account && (
            <span className='form-group__error-text'>{errors?.account.accountId.message}</span>
          )}
        </div>
        <div className='form-search form-group'>
          <label className='form-label'>Thời gian hết hạn</label>
          <Controller
            control={control}
            name='expireAfterMinute'
            defaultValue={5}
            render={({ field: { onChange, value } }) => (
              <ReactSelect
                className='select-input-form'
                classNamePrefix='input-select'
                isSearchable={false}
                onChange={(item) => onChange(item?.value)}
                options={expiredDateOptions}
                defaultValue={expiredDateOptions[0]}
                value={expiredDateOptions.find((val) => val.value === value)}
              />
            )}
          />
        </div>
        <div className={`form-search form-group ${errors?.description && 'form-group__error'}`}>
          <label className='form-label'>{t('Lý do')}</label>
          <Form.Control
            type='text'
            as='textarea'
            rows={5}
            placeholder='Nhập lý do'
            {...register('description')}
          />
          {errors?.description && (
            <span className='form-group__error-text'>{errors?.description.message}</span>
          )}
        </div>
        <Button type='submit' className='btn-add w-100 d-flex align-items-center'>
          <p className='m-0 mr-2'>Lấy thông tin</p>
          {isLoading && <Spinner size='sm' animation='border' />}
        </Button>
      </Form>
      {password && (
        <div className='result-password-container'>
          <p>
            Mật khẩu của tài khoản <span>{username}</span> là:
          </p>

          <OverlayTrigger
            placement='bottom'
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}>
            <CopyToClipboard
              text={password}
              onCopy={() => {
                setCopy(true);
                swal.fire({
                  toast: true,
                  showConfirmButton: false,
                  icon: 'success',
                  timer: 3000,
                  position: 'bottom-end',
                  background: '#00be00',
                  color: '#fff',
                  iconColor: '#fff',
                  html: '<span>Đã sao chép!</span>',
                });
              }}>
              <div className='password-wrapper'>
                <h4>{password}</h4>
                <i className='fas fa-clone fa-lg fa-border'></i>
              </div>
            </CopyToClipboard>
          </OverlayTrigger>
        </div>
      )}
    </div>
  );
};

export default PasswordTemporaryForm;
