import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import ModalPasswordTemporary from 'components/common/ModalAccountMc/ModalPasswordTemporary';
import { SHA256 } from 'crypto-js';
import dayjs from 'dayjs';
import { AccountMerchant, role, UpdateAccMcInput } from 'models/account/accountMerchant';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListRoleAccountMc,
  unlockAccountMc,
  updateAccountMc,
  updateActiveAccountMc,
  updatePassword,
  requestActiveAccount
} from 'redux/actions';
import { Input } from 'ui/Form';
import InputHookForm from 'ui/Form/InputHookForm';
import { formatPhone } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import { SearchParams } from '../BoxSearchAccount';
import swal from 'sweetalert2';
import ReactSelect from 'react-select';
import { StateEnum } from 'models';
import ModalChangePasswordv2 from 'components/common/ModalAccountMc/ModalChangePasswordv2';
import LoadingInline from 'components/common/Loading/LoadingInline';

interface Props {
  data?: AccountMerchant;
  dataSearch?: any;
  handleChangeSearch?: (data: SearchParams) => void;
  rest?: any;
  // getAccountMc? : (data: SearchParams) => void
}

interface ShowModal {
  changePassword?: boolean;
  passwordTemporary?: boolean;
  unclockAccountMc?: boolean;
  updateActiveAccMc?: boolean;
}
const ContentInfoAccountMc: React.FC<Props> = ({
  data,
  dataSearch,
  handleChangeSearch,
  // getAccountMc,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState<ShowModal>({
    changePassword: false,
    passwordTemporary: false,
    unclockAccountMc: false,
    updateActiveAccMc: false,
  });
  // const [dataSearch, setDataSearch] = useState<any>(getValues())  

  const [status, setStatus] = useState<any>(false);
  const [isData, setIsData] = useState<any>(false);

  const isCheckActive = useRef<HTMLInputElement>(null);

  const roles = useSelector<any, role[]>((state) => state?.AccountMerchant?.roles);
  const loading = useSelector<any, boolean>((state) => state?.AccountMerchant?.loading);
  const options = roles?.map((item) => {
    return {
      value: item?.key,
      label: item?.name,
    };
  });

  let indexGroup = options?.findIndex((p) => p.value == (data?.group ? data?.group[0] : ''));

  useEffect(() => {
    reset({
      accountId: Number(data?.accountId),
      fullname: data?.username,
      phone: formatPhone(data?.phone, ''),
      email: data?.email,
      isActive: data?.isActive ? true : false,
      createdAt: data?.createdAt as Date,
      lastedLoginAt: data?.lastedLoginAt as Date,
      role: options[indexGroup] ? options[indexGroup] : options[0],
      //state: optionLock[indexState]  ? optionLock[indexState] : optionLock[0]
      merchantName: data?.merchantName,
    });
  }, [data]);

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: useMemo(() => {
      return {
        accountId: Number(data?.id),
        fullname: data?.username,
        phone: formatPhone(data?.phone, ''),
        email: data?.email,
        isActive: data?.isActive ? true : false,
        createdAt: data?.createdAt as Date,
        lastedLoginAt: data?.lastedLoginAt as Date,
        role: options[indexGroup],
        //state: optionLock[indexState] ? optionLock[indexState] : optionLock[0]
        merchantName: data?.merchantName,
      } as UpdateAccMcInput;
    }, [data]),
  });

  useEffect(() => {
    setStatus(data?.isActive);
  }, [data]);

  useEffect(() => {
    dispatch(getListRoleAccountMc());
  }, []);

  const onSubmit: SubmitHandler<UpdateAccMcInput> = (data) => {
    let { createdAt, lastedLoginAt, merchantName, ...rest } = data;
    dispatch(
      updateAccountMc({ ...rest, role: data.role?.value, isActive: status }, (status, res) => {
        if (status) {
          !Boolean(data?.password) && alert('success', t('Cập nhật thành công'), t);
          handleChangeSearch &&
            handleChangeSearch({
              id: dataSearch,
            } as SearchParams);
        } else {
          alert('error', t(res.data?.AccountMerchant?.UpdateAccMc?.message), t);
        }
      })
    );

    // if (Boolean(data?.password)) {
    //     const dataChangePassword = {
    //         accountId: data?.accountId as number,
    //         password: SHA256(data?.password as string).toString()
    //     }
    //     dispatch(
    //         updatePassword(dataChangePassword, (status, res) => {
    //             if (status) {
    //                 alert('success', 'Cập nhập thành công', t);
    //                 handleChangeSearch && handleChangeSearch({
    //                     search: dataSearch
    //                 } as SearchParams)
    //             }
    //         })
    //     )
    // }
    // if (status) {
    //     console.log('---------------------update-active')
    //     const payload = {
    //         accountId: Number(data?.accountId) as number
    //     }
    //     dispatch(
    //         updateActiveAccountMc(payload, (status, res) => {
    //             if (status) {
    //                 alert('success', 'Cập nhập thành công', t);
    //                 handleChangeSearch && handleChangeSearch({
    //                     search: dataSearch
    //                 } as SearchParams)
    //                 //setStatus(false)
    //             } else {
    //                 alert('error', res.data.message, t)
    //             }
    //         })
    //     )
    // }
  };

  const handleShowModal = () => {
    setShowModal({
      ...showModal,
      passwordTemporary: true,
    });
  };

  const handleShowModalChangePass = () => {
    setShowModal({
      ...showModal,
      changePassword: true,
    });
  };
  const handleCloseModalChangePass = () => {
    setShowModal({
      ...showModal,
      changePassword: false,
    });
  };
  const handleClosemodal = () => {
    setShowModal({
      ...showModal,
      passwordTemporary: false,
    });
  };

  const rulesForm = {
    fullname: {
      required: true,
      minLength: 10,
      maxLength: 16,
    },
    phone: {
      required: true,
      minLength: 10,
      isVNumber: true,
      maxLength: 11,
      isPhoneNumber: true,
    },
    email: { required: true, isEmail: true },
    // email : { required : true},
    isActive: { required: true },
    // password: {
    //     required : true,
    //     minLength: 6,
    //     maxLength: 6,
    //     isUserName: true,
    //     isVNumber: true,
    // }
  };

  const handleUnlockAccountMc = () => {
    swal
      .fire({
        title: t('Bạn có đồng ý mở khóa không?'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('Đồng ý!'),
        cancelButtonText: t('Hủy'),
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(
            unlockAccountMc({ accountId: Number(data?.accountId) }, (status, res) => {
              if (status) {
                alert('success', t('Mở khóa thành công'), t);
                handleChangeSearch &&
                  handleChangeSearch({
                    id: dataSearch,
                  } as SearchParams);
              } else {
                alert('error', t('Mở khóa thất bại'), t);
              }
            })
          );
        }
      });
  };

  // const handleUpdateActive = () => {
  //   const payload = {
  //     accountId: Number(data?.accountId) as number,
  //   };
  //   dispatch(
  //     updateActiveAccountMc(payload, (status, res) => {
  //       if (status) {
  //         alert('success', t('Cập nhập thành công'), t);
  //         handleChangeSearch &&
  //           handleChangeSearch({
  //             search: dataSearch,
  //           } as SearchParams);
  //         //setStatus(false)
  //       } else {
  //         alert('error', res.data.message, t);
  //       }
  //     })
  //   );
  // };

  const handleOnOff = () => {
    const payload = {
      id: Number(data?.accountId) as number,
      isActive: !data?.isActive
    };

    dispatch(
      requestActiveAccount(payload, (state, res) => {
        if (state) {
          alert('success', res?.message, t);
        } else {
          alert('error', res?.message, t);
        }
      })
    )
  }

  const onChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const target = e.target as HTMLInputElement
    setStatus(!status);
  };

  return (
    <>
      <LoadingInline loading={loading} />
      <div className='btn-action-account-mc'>
        <Dropdown>
          <Dropdown.Toggle
            className={'p-0'}
            style={{
              backgroundColor: 'rgba(0,0,0,0)',
              borderColor: 'rgba(0,0,0,0)',
            }}
            id='dropdown-button-drop-up'>
            <div className='btn btn-dropdown-action  pr-0'>
              <i className='fa fa-th-large' aria-hidden='true'></i>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ borderRadius: '12px' }}>
            {/* <Dropdown.Item onClick={handleUnlockAccountMc} disabled={!data?.lockAccount}>
              <div>
                <i className='fa fa-unlock mr-2'></i>
                <span>{t('Unlock account')}</span>
              </div>
            </Dropdown.Item> */}

            {data?.lockAccount ? (
              <Dropdown.Item onClick={handleUnlockAccountMc}>
                <div>
                  <i className='fa fa-unlock mr-2'></i>
                  <span>{t('Unlock account')}</span>
                </div>
              </Dropdown.Item>
            ) : (
              <div></div>
            )}
            <Dropdown.Item onClick={handleShowModal}>
              <div>
                <i className='fa fa-key-skeleton mr-2'></i>
                <span>{t('Password temporary')}</span>
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleShowModalChangePass}>
              <div>
                <i className='fa fa-key mr-2'></i>
                <span>{t('Change password')}</span>
              </div>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleOnOff}
            >
              {
                data?.isActive ? <div>
                  <i className="fa fa-lock mr-2"></i>
                  <span>{t("Off tài khoản")}</span>
                </div> : <div>
                  <i className="fa fa-unlock mr-2"></i>
                  <span>{t("On tài khoản")}</span>
                </div>
              }
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className='content-info-account-mc'>
        <form className='section-form' onSubmit={handleSubmit(onSubmit)}>
          <div className='section-body line--hidden'>
            <div className='inputs-group row'>
              <div className='col-lg-2'></div>
              <div className='col-lg-4 col-md-6'>
                <div className='form-group' style={{ opacity: '0.8' }}>
                  <label>
                    {t('ID')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <input
                    readOnly
                    disabled
                    style={{ cursor: 'no-drop' }}
                    {...register('accountId')}
                  />
                </div>
                <div className='form-group' style={{ opacity: '0.8' }}>
                  <label>
                    {t('Username')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <input
                    readOnly
                    style={{ cursor: 'no-drop' }}
                    placeholder={t('Enter username')}
                    {...register('fullname')}
                  />
                </div>
                <div className='form-group' style={{ opacity: '0.8' }}>
                  <label>
                    {t('Doanh nghiệp')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <input
                    readOnly
                    disabled
                    style={{ cursor: 'no-drop' }}
                    {...register('merchantName')}
                  />
                </div>
                <Input
                  formGroupClassName={`${errors?.phone?.message ? 'input-custom-error' : ''}`}
                  type='text'
                  label={t('Phone number')}
                  register={register}
                  name='phone'
                  errors={errors?.phone}
                  clearErrors={clearErrors}
                  rules={rulesForm?.phone}
                  placeholder={t('Enter phone number')}
                />
                <div className='form-group form-input-checkbox' style={{ padding: '15px 10px', cursor: "no-drop"}}>
                  <label style={{cursor: "no-drop" }}>
                    {t('Status')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <input placeholder='checkbox' hidden />
                  <label className='switch' style={{cursor: "no-drop" }}>
                    <input style={{cursor: "no-drop" }} disabled={true} type='checkbox' {...register("isActive")} onChange={(e) => onChangeState(e)} checked={status} ref={isCheckActive} />
                    <span style={{cursor: "no-drop" }} className='slider around' />
                  </label>
                </div>

                {/* <InputHookForm
                                    label={t("Phone number")}
                                    nameNew="phone"
                                    type='input'
                                    typeInput='text'
                                    formGroupClassName={`${errors?.phone?.message ? 'input-custom-error' : ''
                                        }`}
                                    config={{
                                        value : data?.phone,
                                        onChange : (newData : any) => {
                                            return newData
                                        }
                                    }}
                                    errors={errors?.phone}
                                    rules={rulesForm?.phone}
                                    controls={control}
                                /> */}

                {/* <InputHookForm
                                    label={t("Email")}
                                    nameNew='email'
                                    type='input'
                                    typeInput='text'
                                    formGroupClassName={`${errors?.email?.message ? 'input-custom-error' : ''}`}
                                    config={{
                                        value : data?.email,
                                        // onChange : (newData : any) => {
                                        //     console.log('-----------------------newData', newData)
                                        // }
                                    }}
                                    errors={errors?.email}
                                    rules={rulesForm?.email}
                                    controls={control}
                                /> */}
              </div>
              <div className='col-lg-4 col-md-6'>
                <div className='form-group date-account-mc' style={{ opacity: '0.8' }}>
                  <label>{t('Thời gian tạo')}</label>
                  <div className='input-calendar'>
                    <Controller
                      control={control}
                      name='createdAt'
                      render={({ field }) => {
                        return (
                          <ReactDatePicker
                            placeholderText='DD/MM/YYYY'
                            locale={'en'}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                            }}
                            disabled
                            selected={field.value ? dayjs(field.value).toDate() : null}
                            dateFormat='dd/MM/yyyy'
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode='select'
                          />
                        );
                      }}
                    />
                    <i className='far fa-calendar'></i>
                  </div>
                </div>
                <div className='form-group date-account-mc' style={{ opacity: '0.8' }}>
                  <label>{t('Logged time')}</label>
                  <div className='input-calendar'>
                    <Controller
                      control={control}
                      name='lastedLoginAt'
                      render={({ field }) => (
                        <ReactDatePicker
                          placeholderText='DD/MM/YYYY'
                          locale={'en'}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          disabled
                          selected={field.value ? dayjs(field.value).toDate() : null}
                          dateFormat='dd/MM/yyyy'
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode='select'
                        />
                      )}
                    />
                    {/* <InputHookForm
                                            nameNew="lastedLoginAt"
                                            type='datePicker'
                                            config={{
                                                value : data?.createdAt,
                                                onChange : () => {console.log('hello')}
                                            }}
                                        /> */}
                    <i className='far fa-calendar'></i>
                  </div>
                </div>
                <div className='form-group select-role-acc_mc'>
                  <label>
                    {t('Chọn nhóm quyền')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  {/* <Controller
                    control={control}
                    name='role'
                    render={({ field }) => {
                      // console.log('-------------------field', field.value)
                      return (
                        <ReactSelect
                          className='select-input-form'
                          classNamePrefix='input-select'
                          onChange={(newValue) => field.onChange(newValue)}
                          options={options}
                          value={field.value}
                        />
                      )
                    }}
                  /> */}
                  <InputHookForm
                    nameNew='role'
                    type='select'
                    options={options}
                    config={{
                      value: options[0],
                      // onChange : (newValue : any) => field.onChange(newValue)
                    }}
                    controls={control}
                    cursor={false}
                  />
                </div>
                {/* <Input
                                    formGroupClassName={`${errors?.password?.message ? 'input-custom-error' : ''}`}
                                    type="text"
                                    label={t("Password")}
                                    register={register}
                                    name="password"
                                    errors={errors?.password}
                                    clearErrors={clearErrors}
                                    rules={rulesForm?.password}
                                    placeholder={t("Enter password when need")}
                                /> */}

                {/* Hiển thị state khóa/mở tài khoản */}
                {/* <div className='form-group' style={{ cursor : "no-drop" }}>
                                    <label>
                                        {t('Chọn nhóm quyền')}
                                    </label>
                                    <Controller
                                        control={control}
                                        name='state'
                                        render={({ field }) => {
                                            return (
                                                <ReactSelect
                                                className='select-input-form'
                                                classNamePrefix='input-select'
                                                onChange={(newValue) => field.onChange(newValue)}
                                                options={optionLock}
                                                value={field.value}
                                                />
                                            )
                                        }}
                                    />
                                </div> */}
                <Input
                  formGroupClassName={`${errors?.email?.message ? 'input-custom-error' : ''}`}
                  type='text'
                  label={t('Email')}
                  register={register}
                  name='email'
                  errors={errors?.email}
                  clearErrors={clearErrors}
                  rules={rulesForm?.email}
                  placeholder={t('Enter email')}
                />
              </div>
              <div className='col-lg-12 btn-info-account-mc'>
                <button className='btn' style={{ backgroundColor: '#00be00', color: 'white' }}>
                  {t('Save')}
                </button>
              </div>
            </div>
          </div>
        </form>
        {showModal.passwordTemporary && (
          <ModalPasswordTemporary
            accountId={data?.accountId}
            show={showModal.passwordTemporary}
            handleShow={handleShowModal}
            handleClose={handleClosemodal}
          />
        )}
        {showModal.changePassword && (
          <ModalChangePasswordv2
            show={showModal.changePassword}
            handleShow={handleShowModalChangePass}
            handleClose={handleCloseModalChangePass}
            accountId={data?.accountId}
          />
        )}
        {/* {loading && <LoadingFullScreen />} */}
      </div>
    </>
  );
};

export default ContentInfoAccountMc;
