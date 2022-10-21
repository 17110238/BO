import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { SHA256 } from 'crypto-js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AccountMerchant } from 'models';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-day-picker/lib/style.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { createUserScope, deleteDetailUser, deleteUserBoList, getDetailUser, updateUserScope, searchUser } from 'redux/actions/userAction';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { Input } from 'ui/Form';
// import { actionLogin } from "api/graphql/actions/user.actions";
import { formatPhone } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import { b64_to_utf8, saveState } from 'utils/helpers/utils';
import CheckBoxScope from './CheckBoxScope';
import MaskedInput from 'react-maskedinput';
dayjs.extend(utc);
interface FormLoginSubmit {
  username?: string;
  password: string;
  repassword?: string;
  fullname?: string;
  phone?: number | string;
  email?: string;
  gender?: any;
  birthday?: Date | null;
  isActive?: any;
  role?: string[];
  group?: string[] | any;
  operator?: number[] | any
}

const rulesForm = {
  username: { required: true, minLength: 3, maxLength: 30, isUserName: true, isUsernameBo: true, },
  password: { required: true,  minLength: 6, maxLength: 6 },
  repassword: { required: true,  minLength: 6, maxLength: 6 },
  fullname: { required: true, minLength: 3, maxLength: 30, isUserName: true, },
  phone: { required: true, minLength: 10, isVNumber: true, maxLength: 10, isPhoneNumber: true },
  email: { required: true, isEmail: true },
  gender: { required: true },
  birthday: { required: true },
  isActive: { required: true },
  role: { required: true },
};
interface Role {
  key?: string;
  name?: string;
}
[];
interface mapIteam {
  iteam?: {};
  index: number;
}
enum AnEnum {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}
interface IUser {
  checked: string[];
  expanded: string[];
}
const CreateUserAccountScope = () => {
  const { t } = useTranslation('common');
  const router : any = useRouter();
  const dispatch = useDispatch();
  const { id }: any = router.query;
  const ListRole = useSelector<any, []>((state) => state.authReducers?.listRole) || [];
  const detailUser = useSelector<any, FormLoginSubmit>((state) => state.userReducers?.detailUser) || {};
  const checkPermisson = useSelector<any, []>((state) => state.authReducers?.accountInfo.scope) || [];
  const [stateListRoleCheckBox, setstateListRoleCheckBox] = useState([]);
  const userBoList = useSelector<any, AccountMerchant[]>((state) => state?.userReducers.userBoInfoArray);
  const isLoading = useSelector<any>((state) => state.userReducers?.loading);

  const userBoListFormat = userBoList.map((item:any, index) => {
    return { label: item?.fullname, value: + item.id }
  })
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: `1px solid #eff2f7`,
      color: state.isSelected ? '#0b0b0b' : '#0b0b0b',
      fontSize: '14px',
      fontFamily: 'Nunito Sans',
      height: 'auto',
      minHeight: '40px',
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      boxShadow: '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      border: `none`,
      background: '#EFF2F7',
      borderRadius: '12px',
      color: '#272b41',
      height: 'auto',
    }),
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      return { ...provided, opacity, transition };
    },
  };
  const customStylesMemo = useMemo(() => customStyles, []);
  const handlelistRoleCheckBox = useCallback(
    (data: any) => { setstateListRoleCheckBox(data); }, [stateListRoleCheckBox]
  );
  useEffect(() => {
    const payload: any = {
      filter: {
        search: '',
      },
      paging: {
        start: 0,
        limit: 999,
      },
      sort: {
        createdAt: -1,
      },
    };
    dispatch(
      searchUser(payload, (status, res) => {
      }))
    if (id) {
      const payload: any = {
        filter: {
          id: +id,
        },
        paging: {
          start: 0,
          limit: 1,
        },
        sort: {
          createdAt: 1,
        },
      };
      dispatch(getDetailUser(payload, (status: boolean, response: any) => { }));
    }
    return () => {
      dispatch(deleteDetailUser());
      dispatch(deleteUserBoList());
    };
  }, []);

  useEffect(() => {
    if (Object.keys(detailUser).length != 0) {
      setValue('username', detailUser?.username);
      setValue('fullname', detailUser?.fullname);
      setValue('phone', formatPhone(detailUser?.phone, ''));
      setValue('isActive', detailUser?.isActive);
      setValue('email', detailUser?.email);
      setValue('role', detailUser?.group[0]);
      setValue('gender', detailUser?.gender);
      setValue('birthday', detailUser?.birthday);
    }
  }, [detailUser]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    reset,
    control,
  } = useForm<FormLoginSubmit, any>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: useMemo(() => {
      return {
        username: detailUser?.username,
        fullname: detailUser?.fullname,
        phone: detailUser?.phone,
        email: detailUser?.email,
        gender: detailUser?.gender,
        birthday: detailUser?.birthday as Date,
        isActive: detailUser?.isActive,
        role: detailUser?.role,
      } as FormLoginSubmit;
    }, [detailUser]),
  });

  const handleSubmitCreateUserScope: SubmitHandler<FormLoginSubmit> = (data, e) => {
    if (data.password != data.repassword) {
      setError('repassword', {
        type: 'manual',
        message: t('Mật khẩu không đúng'),
      });
      return;
    }
    const params: any = {
      username: data?.username,
      password: SHA256(data?.password).toString(),
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      birthday: dayjs(data.birthday).format('DD/MM/YYYY'),
      isActive: JSON.parse(data?.isActive),
      scope: stateListRoleCheckBox || [],
      ...(Boolean(data?.operator) && { operator: data.operator })
    };
    dispatch(
      createUserScope(params, (status: boolean, response: any) => {
        if (response.data.Account.CreateAccountScope?.succeeded) {
          setValue('username', '');
          setValue('fullname', '');
          setValue('phone', '');
          setValue('email', '');
          setValue('birthday', null);
          setValue('password', '');
          setValue('repassword', '');
          setValue('operator', []);
          alert('success', response.data.Account.CreateAccountScope?.message, t);
          //   reset();
        } else {
          alert('error', response?.data?.Account?.Create?.message, t);
        }
      })
    );
  };

  const handleSubmitUpdateUserScope: SubmitHandler<FormLoginSubmit> = (data, e) => {
    if (data.password != data.repassword) {
      setError('repassword', {
        type: 'manual',
        message: t('Mật khẩu không đúng'),
      });
      return;
    }
    const params: any = {
      id: +id,
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      birthday: dayjs(data.birthday).format('DD/MM/YYYY'),
      isActive: JSON.parse(data?.isActive),
      scope: stateListRoleCheckBox || [],
      ...(Boolean(data?.password) && { password: SHA256(data?.password).toString() }),
    };
    dispatch(
      updateUserScope(params, (status: boolean, response: any) => {
        if (response.data.Account.UpdateAccountScope?.succeeded) {
          alert('success', response.data.Account.UpdateAccountScope?.message, t);
        } else {
          alert('error', response?.data.Account?.UpdateAccountScope.message, t);
        }
      })
    );
  };

  useEffect(() => {
    if (typeof router.query.urlRedirect !== 'undefined') {
      saveState('decodeUrl', b64_to_utf8(router.query.urlRedirect));
    }
  }, [router.query.urlRedirect]);
  return (
    <>
      <Link href='/cong-thanh-toan/quan-ly-nguoi-dung' passHref>
        <div className='back-settings'>
          <img src='/assets/icon/back-ward.svg' alt='back-user' />
          <h5 className='text'>{t('Quản lý tài khoản')} </h5>
        </div>
      </Link>
      <div className='card setting-container' style={{ background: '#fff', minHeight: '100vh' }}>
        <div className='card-header '>
          <h5 className='title__payment'>{id ? t('Cập nhật tài khoản') : t('Tạo tài khoản')}</h5>
        </div>
        <div className='pt-3 px-md-3 px-2'>
          <Row key='1'>
            <Col className='col-sm-6 col-md-6 col-12 order-sm-1 order-12 pt-2 pt-sm-0'>
              <form
                className='form-login'
                onSubmit={
                  id
                    ? handleSubmit(handleSubmitUpdateUserScope)
                    : handleSubmit(handleSubmitCreateUserScope)
                }
                autoComplete='off'
                noValidate>
                <Row key='11' className='justify-content-md-center'>
                  <Col className='col-12 col-md-6'>
                    <Input
                      type='text'
                      label={t('Họ và tên')}
                      register={register}
                      name='fullname'
                      errors={errors?.fullname}
                      clearErrors={clearErrors}
                      rules={rulesForm?.fullname}
                      placeholder={t('Họ và tên')}
                      autoComplete='off'
                    />
                  </Col>
                  <Col className='col-12 col-md-6'>
                    <Input
                      type='email'
                      label={t('Email')}
                      register={register}
                      name='email'
                      errors={errors.email}
                      clearErrors={clearErrors}
                      rules={rulesForm?.email}
                      placeholder={t('Email')}
                      autoComplete='off'
                    />
                  </Col>
                </Row>

                <Row key='111'>
                  <Col className='col-12 col-md-6'>
                    <div className='form-group'>
                      <label>{t('Giới tính')}</label>
                      <select className='form-control' {...register('gender')}>
                        <option value={AnEnum[0]}>{t('Nam')}</option>
                        <option value={AnEnum[1]}>{t('Nữ')}</option>
                        <option value={AnEnum[2]}>{t('Khác')} </option>
                      </select>
                    </div>
                  </Col>
                  <Col className='col-12 col-md-6'>
                    <div className='form-group'>
                      <label>{t('Ngày sinh')}</label>
                      <span className='text-danger'> (*)</span>
                      <Controller
                        control={control}
                        name='birthday'
                        rules={rulesForm?.birthday}
                        defaultValue={null}
                        render={({ field, fieldState }) => {
                          return (
                            <div className='date-picker-customer d-block '>
                              <div className='box-date-picker d-block '>
                                <DatePicker
                                  dateFormat='dd/MM/yyyy'
                                  placeholderText='dd/mm/yyyy'
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value ? dayjs(field.value).toDate() : null}
                                  showMonthDropdown
                                  showYearDropdown
                                  peekNextMonth
                                  dropdownMode='select'
                                  className={
                                    fieldState.invalid
                                      ? field?.value
                                        ? 'style'
                                        : 'style input-error'
                                      : 'style'
                                  }
                                  customInput={<MaskedInput mask='11/11/1111' placeholder='dd/MM/yyyy' />}
                                // locale={'vi'}
                                />
                              </div>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                {/* {key(pin):"ins.admin"
                  name(pin):"ADMIN"} */}

                <Row key='3'>
                  <Col className='col-12 col-md-6'>
                    <Input
                      type='text'
                      label={t('Số điện thoại')}
                      register={register}
                      name='phone'
                      errors={errors.phone}
                      clearErrors={clearErrors}
                      rules={rulesForm?.phone}
                      placeholder={t('Số điện thoại')}
                    />
                  </Col>

                  <Col className='col-12 col-md-6'>
                    <Input
                      type='text'
                      label={t('Tên đăng nhập')}
                      register={register}
                      name='username'
                      errors={errors.username}
                      clearErrors={clearErrors}
                      rules={rulesForm?.username}
                      placeholder={t('Tên đăng nhập')}
                      disabled={id && true}
                    />
                  </Col>
                </Row>

                {id ? (
                  <>
                    <Row key='4'>
                      <Col className='col-12 col-md-6'>
                        <Input
                          type='password'
                          label={t('Mật khẩu')}
                          register={register}
                          name='password'
                          errors={errors.password}
                          clearErrors={clearErrors}
                          rules={{  minLength: 6, maxLength: 25 }}
                          placeholder={t('Nhập mật khẩu')}
                          autoComplete='new-password'
                        />
                      </Col>

                      <Col key='5' className='col-12 col-md-6'>
                        <Input
                          type='password'
                          label={t('Nhập lại mật khẩu')}
                          register={register}
                          name='repassword'
                          errors={errors.repassword}
                          clearErrors={clearErrors}
                          rules={{  minLength: 6, maxLength: 25 }}
                          placeholder={t('Nhập lại mật khẩu')}
                        />
                      </Col>
                    </Row>
                    {/* <Row>
                      <Col className='col-12 col-sm-12'>
                        <div className='form-group'>
                          <label>
                            {t('Thành viên')}
                            <span className='text-danger'> (*)</span>
                          </label>
                          <Controller
                            control={control}
                            name='operator'
                            rules={rulesForm?.operator}
                            render={({ field: { value, onChange, onBlur, error } }: any) => {


                              return (
                                <>
                                  <ReactSelect
                                    className='form-group'
                                    isMulti
                                    styles={customStylesMemo}
                                    placeholder={t('Chọn quản lý')}
                                    onChange={(value: any) => onChange(value)}
                                    options={userBoListFormat}
                                    // value={userBoListFormat.filter((option) => value?.includes(option.value))}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,

                                        primary25: '#EFF2F7',
                                        primary: '#EFF2F7',
                                      },
                                    })}
                                  />
                                  {
                                    errors?.operator && !value?.length &&
                                    <span className='txt-valid mt-10 mb-0'>
                                      <i className='i-valid' />
                                      {t('Người duyệt không được để trống')}
                                    </span>
                                  }
                                </>
                              );
                            }}
                          />

                        </div>
                      </Col >
                    </Row> */}
                  </>
                ) : (
                  <>
                    <Row>
                      <Col className='col-12 col-sm-12'>
                        <div className='form-group'>
                          <label>
                            {t('Quản lý')}
                          </label>
                          <Controller
                            control={control}
                            name='operator'
                            render={({ field: { value, onChange, onBlur, error } }: any) => {
                              return (
                                <>
                                  <ReactSelect
                                    className='form-group'
                                    isMulti
                                    maxMenuHeight={200}
                                    styles={customStylesMemo}
                                    placeholder={t('Chọn quản lý')}
                                    onChange={(userBoListFormat) => {
                                      return onChange(userBoListFormat?.map((option) => option.value))
                                    }}
                                    options={userBoListFormat}
                                    value={userBoListFormat.filter((option) => {
                                      return value?.includes(option.value)
                                    })}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,
                                        primary25: '#EFF2F7',
                                        primary: '#EFF2F7',
                                      },
                                    })}
                                  />
                                </>
                              );
                            }}
                          />
                        </div>
                      </Col >
                    </Row>
                    <Row key='6'>
                      <Col className='col-12 col-md-6'>
                        <Input
                          type='password'
                          label={t('Mật khẩu')}
                          register={register}
                          name='password'
                          errors={errors.password}
                          clearErrors={clearErrors}
                          rules={rulesForm?.password}
                          placeholder={t('Nhập mật khẩu')}
                          autoComplete='new-password'
                        />
                      </Col>

                      <Col className='col-12 col-md-6'>
                        <Input
                          type='password'
                          label={t('Nhập lại mật khẩu')}
                          register={register}
                          name='repassword'
                          errors={errors.repassword}
                          clearErrors={clearErrors}
                          rules={rulesForm?.repassword}
                          placeholder={t('Nhập lại mật khẩu')}
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row className='mb-3'>
                  <Col className='col-12 col-md-6'>
                    <div className='form-group'>
                      <label>{t('Kích hoạt Tài khoản')}</label>
                      <select className='form-control' {...register('isActive')}>
                        <option value='true'>{t('Mở')}</option>
                        <option value='false'>{t('Khóa')}</option>
                      </select>
                    </div>
                  </Col>
                  <Col>
                    <div className='form-group'></div>
                  </Col>
                </Row>
                <Row>
                  <div className='form-group mb-0 ml-3'>
                    <button
                      type='submit'
                      className='btn btn-success w-100'
                      style={{ height: '40px', minWidth: '80px' }}>
                       <i className='fa fa-paper-plane'></i>
                      {t('Gửi')}
                    </button>
                  </div>
                </Row>
              </form>
            </Col>
            <Col className='col-sm-6 col-md-6 col-12 order-sm-12 order-1 ' style={{ overflowY: 'auto', maxHeight: '747px' }}>
              <h5 className='pb-1'>{t('Quản lý quyền user')}</h5>
              <CheckBoxScope handlelistRoleCheckBox={handlelistRoleCheckBox} id={id} />
            </Col>
          </Row>
        </div>
        {isLoading && id && <LoadingFullScreen />}
      </div>
    </>
  );
};
export default CreateUserAccountScope;
