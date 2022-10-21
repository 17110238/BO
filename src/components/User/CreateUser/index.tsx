import Loading from 'components/Login/shared/Loading';
import alert from 'utils/helpers/alert';
import { b64_to_utf8, clearState, loadState, saveState } from 'utils/helpers/utils';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Input, InputPassword } from 'ui/Form';
import { SHA256 } from 'crypto-js';
import { Col, Container, Row } from 'react-bootstrap';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import LoadingInline from 'components/common/Loading/LoadingInline';
import { formatPhone } from 'utils/helpers';
import { createUser, deleteDetailUser, deleteUserBoList, getDetailUser, updateUser, searchUser, } from 'redux/actions/userAction';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'react-day-picker/lib/style.css';
import { role } from 'models/account/accountMerchant';
import ReactSelect, { SingleValue } from 'react-select';
import Select from 'react-select';
import i18next from 'i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { scopeUserProps } from 'layouts/Header';
import Swal from 'sweetalert2';
import { AccountMerchant } from 'models/account/accountMerchant';
import MaskedInput from 'react-maskedinput';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import CheckBoxScope from '../CreateUserScope/CheckBoxScope';
dayjs.extend(utc);
import _ from 'lodash'

interface FormLoginSubmit {
  id?: string;
  username?: string;
  password: string;
  repassword?: string;
  fullname?: string;
  phone?: number | string;
  email?: string;
  gender?: any;
  birthday?: Date | null;
  isActive?: any;
  role?: any;
  group?: string[] | any;
  link?: string;
  refcode?: string;
  operator?: string[] | any;
  scope?: string[] | any
}
interface Role {
  key?: string;
  name?: string;
  description?: string
}
interface mapIteam {
  iteam?: {};
  index: number;
}
interface operater {
  accountId: number
  username: string
}
enum AnEnum {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}
// fullname: { required: true, minLength: 3, maxLength: 30, isUserName: true, trim: true, },
const rulesForm = {
  username: { required: true, minLength: 3, maxLength: 30, isUserName: true, trim: true, isUsernameBo: true, },
  password: { required: true, minLength: 6, maxLength: 25 },
  repassword: { required: true, minLength: 6, maxLength: 25 },
  fullname: { required: true, minLength: 3, maxLength: 30, isUserNameBo: true, trim: true, },
  phone: { required: true, minLength: 10, maxLength: 10, isVNumber: true, isPhoneNumber: true },
  email: { required: true, isEmail: true },
  gender: { required: true },
  birthday: { required: true },
  isActive: { required: true },
  role: { required: true },

};
const CreateUserAccount = (props: any) => {
  const { t } = useTranslation('common');
  const router: any = useRouter();
  const dispatch = useDispatch();
  const { id }: any = router.query;
  const [copied, setCopied] = useState<boolean>(true);
  const [refCode, setRefCode] = useState<string>('');
  const { register, formState: { errors }, handleSubmit, clearErrors, setError, setValue, getValues, reset, control, } = useForm<FormLoginSubmit>({ mode: 'onSubmit', reValidateMode: 'onSubmit', });
  const ListRole = useSelector<any, any[]>((state) => state.authReducers?.listRole);
  const detailUser = useSelector<any, FormLoginSubmit>((state) => state.userReducers?.detailUser);
  const checkPermisson = useSelector<any, []>((state) => state.authReducers?.accountInfo.scope) || [];
  const userBoList = useSelector<any, AccountMerchant[]>((state) => state?.userReducers.userBoInfoArray);
  const roleOptions = ListRole.map((data: any) => ({
    label: t(data.description),
    value: data.key,
  }));

  const [stateListRoleCheckBox, setstateListRoleCheckBox] = useState([]);
  const [listTreeShowByRole, setListTreeShowByRole] = useState<any>([])
  const [scopeOfRole, setScopeOfRole] = useState<any>('')

  useEffect(() => {
    setScopeOfRole(id ? detailUser?.group && detailUser?.group[0] : "ins.admin")
    setListTreeShowByRole(ListRole.find(item => item.key === (id ? detailUser?.group && detailUser?.group[0] : "ins.admin"))?.scope);
  }, [detailUser])

  const userBoListFormat = userBoList.map((item: any, index) => {
    return { label: item?.fullname, value: + item.id }
  })

  const userBoListFormatUpdate = userBoList.filter((item: any, index) => {
    if (detailUser?.id != item?.id) {
      return { label: item?.fullname, value: + item.id }
    }

  }).map((item: any, index) => {
    return { label: item?.fullname, value: + item.id }
  })
  const isLoading = useSelector<any>((state) => state.userReducers?.loading);
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  let checkCreateUser = checkPermisson.findIndex(
    (item) => item == 'bo.account.role' || item == 'bo.account.scope'
  );
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: `1px solid #eff2f7`,
      color: state.isSelected ? ' #eff2f7' : '#0b0b0b',
      fontSize: '14px',
      fontFamily: 'Nunito Sans',
      height: 'auto',
      minHeight: '40px',
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      boxShadow: '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
      height: 'auto',

    }),
    control: (provided: any, state: any) => ({
      ...provided,
      border: `none`,
      background: '#EFF2F7',
      borderRadius: '12px',
      color: '#272b41',
      height: 'auto',
      minHeight: '42px',
      //  maxHeight: '100px',
    }),
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      return { ...provided, opacity, transition };
    },
  };
  let userBolist: any = []
  const customStylesMemo = useMemo(() => customStyles, []);
  const options = ListRole?.map((item) => {
    return {
      value: item?.key,
      label: item?.name,
    };
  });
  const genderOptions = [
    { label: t('Nam'), value: AnEnum[0] },
    { label: t('Nữ'), value: AnEnum[1] },
    { label: t('Khác'), value: AnEnum[2] },
  ];

  const isActiveOptions = [
    { label: t('Mở'), value: true },
    {
      label: t('Khóa'),
      value: false,
    },
  ];

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
          limit: 20,
        },
        sort: {
          createdAt: 1,
        },
      };

      dispatch(getDetailUser(payload, (status: boolean, response: any) => { }));
    } else {
      setValue('username', '');
      setValue('password', '');
    }
    return () => {
      dispatch(deleteDetailUser());
      dispatch(deleteUserBoList());
    };
  }, []);
  useEffect(() => {
    if (Object.keys(detailUser).length != 0 && id) {
      let operater = detailUser?.operator!?.map((item: operater) => {
        return item.accountId
      }) || []
      setValue('username', detailUser?.username);
      setValue('fullname', detailUser?.fullname);
      setValue('phone', formatPhone(detailUser?.phone, ''));
      setValue('isActive', detailUser?.isActive);
      setValue('email', detailUser?.email);
      setValue('role', detailUser?.group[0]);
      setValue('gender', detailUser?.gender);
      setValue('birthday', detailUser?.birthday);
      setValue('operator', operater || []);
      // pe OperatorType {
      //   accountId: BigInt
      //   username: String

    }
  }, [detailUser]);
  useEffect(() => {
    if (typeof router.query.urlRedirect !== 'undefined') {
      saveState('decodeUrl', b64_to_utf8(router.query.urlRedirect));
    }
  }, [router.query?.urlRedirect]);
  const handleSubmitCreateUser: SubmitHandler<FormLoginSubmit> = (data, e) => {
    if (data.password != data.repassword) {
      setError('repassword', {
        type: 'manual',
        message: t('Mật khẩu không đúng'),
      });
      return;
    }
    let dataOperator = data?.operator && data?.operator.map((item: any) => +item.value)
    const params: any = {
      username: data?.username,
      password: SHA256(data?.password).toString(),
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      birthday: dayjs(data.birthday).format('DD/MM/YYYY'),
      isActive: JSON.parse(data?.isActive),
      role: data.role,
      ...(Boolean(data?.operator) && { operator: data.operator })
    };
    dispatch(
      createUser(params, (status: boolean, response: any) => {
        if (response.data.Account.Create?.succeeded) {
          setValue('username', '');
          setValue('fullname', '');
          setValue('phone', '');
          setValue('email', '');
          setValue('birthday', null);
          setValue('password', '');
          setValue('repassword', '');
          setValue('operator', []);
          //reset();
          alert('success', t('Tạo tài khoản thành công'), t);

        } else {

          alert('error', response?.data?.Account?.Create?.message, t);
        }
      })
    );
  };
  const handleSubmitUpdateUser: SubmitHandler<FormLoginSubmit> = (data, e) => {
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
      operator: data.operator,
      role: data.role,
      ...(Boolean(data?.password) && { password: SHA256(data?.password).toString() }),
    };

    const boScope = detailUser?.scope.filter((item: any) => item.split('.')[0] === 'bo')

    let logDefault = stateListRoleCheckBox.every((item: string) => {
      return boScope.includes(item) && boScope?.length === stateListRoleCheckBox?.length
    })

    let logOfRole = stateListRoleCheckBox.every((item: string) => {
      return ListRole.find((val) => val?.key === scopeOfRole)?.scope?.map((idx: any) => idx?.scope).includes(item) && ListRole.find((val) => val?.key === scopeOfRole)?.scope?.length === stateListRoleCheckBox?.length
    })

    if ((!logDefault && scopeOfRole === detailUser?.group[0]) || (!logOfRole && scopeOfRole !== detailUser?.group[0])) {
      params["scope"] = stateListRoleCheckBox
    }

    dispatch(
      updateUser(params, (status: boolean, response: any) => {
        if (response?.data.Account.Update?.succeeded) {
          alert('success', t('Cập nhật tài khoản thành công'), t);
        } else {
          alert('error', response?.data.Account?.Update.message, t);
        }
      })
    );
  };

  const handlelistRoleCheckBox = (data: any) => {
    setstateListRoleCheckBox(data?.filter((item: any) => item.split('.')[0] === 'bo'));
  }

  useEffect(() => {
    setListTreeShowByRole(ListRole.find(item => item.key === scopeOfRole)?.scope);
  }, [scopeOfRole])


  return (
    <>
      <Link href='/cong-thanh-toan/quan-ly-nguoi-dung' passHref>
        <div className='back-settings'>
          <img src='/assets/icon/back-ward.svg' alt='back-user' />
          <h5 className='text'>{t('Quản lý tài khoản')} </h5>
        </div>
      </Link>
      <div className='card setting-container' >
        <div className='card-header '>
          <h5 className='title__payment'>{id ? t('Cập nhật tài khoản') : t('Tạo tài khoản')}</h5>
        </div>
        <div className='pt-3 px-3 '>
          <div className='d-flex justify-content-center '>
            <LoadingInline loading={isLoading && id} />
            <Col className='col-xl-8 col-lg-8 col-8  login-container' style={{ minWidth: 'auto' }}>
              <form
                className='form-login p-3 border mb-3'
                onSubmit={
                  id ? handleSubmit(handleSubmitUpdateUser) : handleSubmit(handleSubmitCreateUser)
                }
                autoComplete="off">
                <Row className='justify-content-md-center'>
                  <Col className='col-12 col-sm-6'>
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
                  <Col className='col-12 col-sm-6'>
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
                <Row>
                  <Col className='col-12 col-sm-6'>
                    <div className='form-group'>
                      <label>{t('Giới tính')}</label>
                      <Controller
                        control={control}
                        name={'gender'}
                        defaultValue={AnEnum[0]}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <ReactSelect
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: '#EFF2F7',
                                primary: '#00be00',
                              },
                            })}
                            noOptionsMessage={() => {
                              return i18next.language === 'en'
                                ? 'No options'
                                : 'Không có kết quả tìm kiếm';
                            }}
                            styles={customStyles}
                            placeholder=''
                            value={genderOptions.find((c) => c.value === value)}
                            options={genderOptions}
                            onChange={(e: SingleValue<any>) => onChange(e.value)}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col className='col-12 col-sm-6'>
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
                            <div className='date-picker-customerv1 d-block '>
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
                                />
                              </div>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col className='col-12 col-sm-6 mb-3'>
                    <div className='form-group'>
                      <label>{t('Chức vụ')}</label>
                      <Controller
                        control={control}
                        name={'role'}
                        defaultValue={roleOptions[0]?.value}
                        render={({ field: { onChange, value }, fieldState: { error } }) => {
                          return (
                            <ReactSelect
                              theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#EFF2F7',
                                  primary: '#00be00',
                                },
                              })}
                              noOptionsMessage={() => {
                                return i18next.language === 'en'
                                  ? 'No options'
                                  : 'Không có kết quả tìm kiếm';
                              }}
                              styles={customStyles}
                              placeholder=''
                              value={roleOptions.find((c) => c.value === value)}
                              options={roleOptions}
                              onChange={(e: SingleValue<any>) => {
                                onChange(e.value)
                                setScopeOfRole(e.value)
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                  </Col>
                  <Col className='col-12 col-sm-6'>
                    <div className='form-group'>
                      <label>{t('Kích hoạt Tài khoản')}</label>
                      <Controller
                        control={control}
                        name={'isActive'}
                        defaultValue={isActiveOptions[0].value}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <ReactSelect
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: '#EFF2F7',
                                primary: '#00be00',
                              },
                            })}
                            noOptionsMessage={() => {
                              return i18next.language === 'en'
                                ? 'No options'
                                : 'Không có kết quả tìm kiếm';
                            }}
                            styles={customStyles}
                            placeholder=''
                            value={isActiveOptions.find((c) => c.value === value)}
                            options={isActiveOptions}
                            onChange={(e: SingleValue<any>) => onChange(e.value)}
                          />
                        )}
                      />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className='col-12 col-sm-6'>
                    <Input
                      type='text'
                      label={t('Số điện thoại')}
                      register={register}
                      name='phone'
                      errors={errors.phone}
                      clearErrors={clearErrors}
                      rules={rulesForm?.phone}
                      placeholder={t('Số điện thoại')}
                    // autoComplete='off'
                    />
                  </Col>
                  <Col className='col-12 col-sm-6'>
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
                      autoComplete='off'
                    />
                  </Col>
                </Row>
                {id ? (
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
                                    onChange={(userBoListFormatUpdate) => {
                                      return onChange(userBoListFormatUpdate?.map((option) => option.value))
                                    }}
                                    options={userBoListFormatUpdate}
                                    value={userBoListFormatUpdate.filter((option) => {
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
                    <Row>
                      <Col className='col-12 col-sm-6'>
                        <Input
                          type='text'
                          label={t('Mật khẩu')}
                          register={register}
                          name='password'
                          errors={errors.password}
                          clearErrors={clearErrors}
                          rules={{ minLength: 6, maxLength: 25 }}
                          placeholder={t('Nhập mật khẩu')}
                          autoComplete='off'

                        />
                      </Col>
                      <Col className='col-12 col-sm-6'>
                        <Input
                          type='text'
                          label={t('Nhập lại mật khẩu')}
                          register={register}
                          name='repassword'
                          errors={errors.repassword}
                          clearErrors={clearErrors}
                          rules={{ minLength: 6, maxLength: 25 }}
                          placeholder={t('Nhập lại mật khẩu')}
                          autoComplete='off'

                        />
                      </Col>
                    </Row>
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
                    <Row>
                      <Col className='col-12 col-sm-6'>
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

                      <Col className='col-12 col-sm-6'>
                        <Input
                          type='password'
                          label={t('Nhập lại mật khẩu')}
                          register={register}
                          name='repassword'
                          errors={errors.repassword}
                          clearErrors={clearErrors}
                          rules={rulesForm?.repassword}
                          placeholder={t('Nhập lại mật khẩu')}
                          autoComplete='off'
                        />
                      </Col>
                    </Row>

                  </>
                )}
                {id ? (
                  <Row>
                    <Col className='col-12 col-sm-6 col-md-8'>
                      <div className='form-group'>
                        <label>{t('Link mã giới thiệu')}</label>
                        <div
                          data-tip
                          data-for={`div-link-ma-gioi-thieu`}
                          className='align-items-center'
                          style={{
                            backgroundColor: '#eff2f7',
                            borderRadius: '13px',
                            cursor: 'pointer',
                          }}>
                          <CopyToClipboard
                            onCopy={() => {
                              setCopied(true);
                              Swal.fire({
                                toast: true,
                                showConfirmButton: false,
                                icon: 'success',
                                timer: 1200,
                                title: t('Copied'),
                                position: 'top-end',
                              });
                            }}
                            text={`${process.env.NEXT_PUBLIC_API_URL_IDMC}/signup/${detailUser?.refcode}`}>
                            <div
                              // className='d-flex p-3 align-items-center'
                              className='p-3'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div className='d-flex align-items-center'
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    justifyContent: "space-between"
                                  }}
                                >
                                  <i className='fa fa-link mr-2'></i>
                                  <p
                                    className='m-0'
                                    style={{
                                      fontSize: '15px',
                                      fontWeight: '600',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      width: 'auto',
                                      whiteSpace: 'nowrap',
                                    }}>
                                    {`${process.env.NEXT_PUBLIC_API_URL_IDMC}/signup/${detailUser?.refcode}`}
                                  </p>
                                </div>

                                <div className='refcode-icon-coppy '></div>
                              </div>

                            </div>
                          </CopyToClipboard>
                          <ReactTooltip place='bottom' effect='solid' id={`div-link-ma-gioi-thieu`}>
                            {t('Link mã giới thiệu')}
                          </ReactTooltip>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div></div>
                )}
                <Row className='justify-content-center my-3'>
                  <div className='form-group mb-0 ml-3'>
                    <div className='d-flex'>
                      <button
                        type='submit'
                        className='btn btn-success w-100'
                        style={{ height: '40px', minWidth: '80px' }}>
                        <i className='fa fa-paper-plane'></i>
                        {t('Gửi')}
                      </button>
                    </div>
                  </div>
                </Row>
              </form>
            </Col>
            {
              id && <Col className='col-xl-4 col-lg-4 col-md-4 col-4 order-sm-12 role-create-user-container' style={{ overflowY: 'auto', maxHeight: '747px' }}>
                <h5 className='pb-1'>{t('Quản lý quyền user')}</h5>
                <CheckBoxScope
                  handlelistRoleCheckBox={handlelistRoleCheckBox}
                  listScopeOfRole={listTreeShowByRole}
                  isCheckTreeByRole={true}
                  id={id}
                  scopeOfRole={scopeOfRole}
                />
              </Col>
            }

          </div>
        </div>
        {/* {isLoading && id && <LoadingFullScreen />} */}
      </div>
    </>
  );
};
export default CreateUserAccount;
