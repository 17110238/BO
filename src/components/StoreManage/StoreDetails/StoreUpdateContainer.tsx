import { yupResolver } from '@hookform/resolvers/yup';
import callApiUPLOAD from 'api/UploadFiles';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import LocationComponent from 'components/common/Location/LocationComponent';
import {
  BankType,
  BannerArrInput,
  FormUpdateStore,
  localeTypeInput,
  LocationType,
  MediaType,
  PaymentFormEnum,
  SearchStoreInput,
  StoreMerchant,
  TransactionTypeEnum,
  TypeCrossCheckEnum,
} from 'models';
import { useRouter } from 'next/router';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import {
  getListInfoBank,
  getListStore,
  getMerchantStore,
  getpaymentMethodList,
  updateStore,
} from 'redux/actions';
import { checkValidatePhone } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import * as yup from 'yup';

declare module 'yup' {
  interface StringSchema {
    validatePhone(error?: string): StringSchema;
    validateEmail(error?: string): StringSchema;
  }
}

yup.addMethod(yup.string, 'validatePhone', function (errorMessage: string) {
  return this.test('format-phone', errorMessage, function (value) {
    if (value) {
      if (value.length < 10) {
        return false;
      } else {
        return checkValidatePhone(value).isValid ? true : false;
      }
    } else {
      return false;
    }
  });
});

yup.addMethod(yup.string, 'validateEmail', function (errorMessage: string) {
  return this.test('format-phone', errorMessage, function (value?: string) {
    if (value) {
      return new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(value);
    } else return false;
  });
});

const validationSchema: any = yup.object().shape({
  storeName: yup.string().required('T??n ??i???m giao d???ch kh??ng ???????c r???ng'),
  email: yup.string().validateEmail('Email sai ?????nh d???ng'),
  phone: yup.string().validatePhone('Sai ?????nh d???ng s??? ??i???n tho???i'),
  address: yup.string().required('?????a ch??? kh??ng ???????c r???ng'),
});

interface ReactTree {
  checked: string[];
  expanded: string[];
}

interface dataOption {
  label: string;
  value: string;
}

interface typeCheckPayment {
  value: boolean;
  type: string;
}

const workingTime = [
  { label: '0h', value: '0' },
  { label: '1h', value: '1' },
  { label: '2h', value: '2' },
  { label: '3h', value: '3' },
  { label: '4h', value: '4' },
  { label: '5h', value: '5' },
  { label: '6h', value: '6' },
  { label: '7h', value: '7' },
  { label: '8h', value: '8' },
  { label: '9h', value: '9' },
  { label: '10h', value: '10' },
  { label: '11h', value: '11' },
  { label: '12h', value: '12' },
  { label: '13h', value: '13' },
  { label: '14h', value: '14' },
  { label: '15h', value: '15' },
  { label: '16h', value: '16' },
  { label: '17h', value: '17' },
  { label: '18h', value: '18' },
  { label: '19h', value: '19' },
  { label: '20h', value: '20' },
  { label: '21h', value: '21' },
  { label: '22h', value: '22' },
  { label: '23h', value: '23' },
];

export default function StoreUpdateContainer() {
  const resolver = yupResolver(validationSchema);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<any>({
    resolver,
    mode: 'onSubmit',
  });
  const provinceStore = useSelector<any, Array<LocationType>>((state) => state.utility?.locations);
  const { t } = useTranslation('common');
  const router = useRouter();
  const loading = useSelector((state: any) => state.storeReducer.loading);
  const dispatch = useDispatch();
  const [dataStore, setDataStore] = useState<StoreMerchant>();
  const [isCheckTree, setCheckTree] = useState<ReactTree>({
    checked: [],
    expanded: [],
  });
  const [isClearForm, setClearForm] = useState<number>(0);
  const [category, setCategory] = useState<any>();
  const [dataTreeSelect, setDataTreeSelect] = useState<any>([]);
  const [isCheckPayment, setCheckPayment] = useState<Array<typeCheckPayment>>([]);
  const [listFile, setListFile] = useState<any>({
    logo: [],
    registration: [],
    banner: [],
  });
  const [listLocale, setListLocale] = useState<Array<number>>([]);
  const [listBank, setListBank] = useState<Array<BankType>>([]);
  const [historyLocale, setHistoryLocale] = useState<boolean>(false);
  const [saveLocale, setSaveLocale] = useState<any>([]);
  const [dataMerchant, setDataMerchant] = useState<any>();
  const transactionType: Array<dataOption> = Object.values(TransactionTypeEnum).map((item) => ({
    label: t(item),
    value: item,
  }));
  const typeCrossCheckEnum: Array<dataOption> = Object.values(TypeCrossCheckEnum).map((item) => ({
    label: t(item),
    value: item,
  }));
  const paymentForm: Array<dataOption> = Object.values(PaymentFormEnum).map((item) => ({
    label: item === 'ECOMMERCE' ? 'E-Commerce' : 'C???a h??ng',
    value: item,
  }));
  const crossCheckInfoType: any = [
    {
      label: '?????i so??t chung v???i doanh nghi???p',
      value: true,
      type: 'owner',
    },
    {
      label: '?????i so??t ?????c l???p v???i v?? PayME',
      value: true,
      type: 'wallet',
    },
    {
      label: '?????i so??t qua t??i kho???n ng??n h??ng',
      value: true,
      type: 'bank',
    },
  ];
  const handleGetDataStore = (id: string | string[]) => {
    const payload: SearchStoreInput = {
      filter: {
        storeId: parseInt(id.toString()),
      },
      paging: {
        start: 0,
        limit: 20,
      },
      sort: {
        createdAt: 1,
      },
    };
    dispatch(
      getListStore(payload, (state, res) => {
        if (state) {
          const tempArr: Array<typeCheckPayment> = [];
          let arrLocale: Array<number> = [];
          let saveLocale: any = [];
          let files: any = {
            logo: [],
            registration: [],
            banner: [],
          };
          if (res.data[0]?.logo) {
            files = { ...files, logo: [res.data[0]?.logo] };
          }
          if (
            Array.isArray(res.data[0].registration.images) &&
            res.data[0].registration.images.length > 0
          ) {
            files = { ...files, registration: res.data[0].registration.images };
          }
          if (res.data[0]?.bannerInfo && Array.isArray(res.data[0]?.bannerInfo.banners)) {
            files = {
              ...files,
              banner: res.data[0]?.bannerInfo.banners?.map((item: any) => {
                return item.link;
              }),
            };
          }
          if (res.data[0]?.crossCheckInfo.isOwner && !res.data[0]?.crossCheckInfo.isUseBank) {
            tempArr.push({
              value: true,
              type: 'owner',
            });
          } else {
            if (!res.data[0]?.crossCheckInfo.isUseBank) {
              tempArr.push({
                value: true,
                type: 'owner',
              });
            } else {
              tempArr.push({
                value: false,
                type: 'owner',
              });
            }
          }
          if (
            res.data[0]?.crossCheckInfo.isUseBank &&
            Object.keys(res.data[0].crossCheckInfo.bank).length > 0 &&
            Object.values(res.data[0].crossCheckInfo.bank).every((val) => {
              return val && (val !== '' || val !== null);
            })
          ) {
            tempArr.push({
              value: true,
              type: 'bank',
            });
          } else {
            tempArr.push({
              value: false,
              type: 'bank',
            });
          }
          if (
            res.data[0]?.crossCheckInfo.isUseBank &&
            Object.keys(res.data[0]?.crossCheckInfo.payME).length > 0 &&
            !Object.values(res.data[0].crossCheckInfo.bank).every((val) => {
              return val && (val !== '' || val !== null);
            }) &&
            res.data[0]?.crossCheckInfo.payME['phone']
          ) {
            tempArr.push({
              value: true,
              type: 'wallet',
            });
          } else {
            tempArr.push({
              value: false,
              type: 'wallet',
            });
          }
          if (res.data[0]?.locale.length > 0) {
            arrLocale = res.data[0]?.locale.map((item: localeTypeInput, index: number) => {
              const obj: any = {
                [`language${index}`]: item.locale,
                [`localeTitle${index}`]: item.title,
                index,
              };
              saveLocale.push(obj);
              return index;
            });
          }
          setDataStore(res.data[0]);
          setCategory(res.data[0].paymentForm);
          setListFile(files);
          setCheckPayment(tempArr);
          setSaveLocale(saveLocale);
          setListLocale(arrLocale);
        }
      })
    );
  };
  // upload h??nh ???nh
  const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>, type: string) => {
    const arrayFiles: Array<string> = [];
    let temp: Array<string> = [];
    const files: any = e.target.files;
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const { data: res } = await callApiUPLOAD(formData);
      if (res.code === 1000) {
        if (type === 'logo') {
          res.data.forEach((item: any) => {
            arrayFiles.push(item.path);
          });
          setListFile({ ...listFile, logo: arrayFiles });
        }
        if (type === 'registration') {
          res.data.forEach((item: any) => {
            arrayFiles.push(item.path);
          });
          let registration = [...listFile.registration];
          temp = registration.concat(arrayFiles);
          setListFile({ ...listFile, registration: temp });
        }
        if (type === 'banner') {
          res.data.forEach((item: any) => {
            arrayFiles.push(item.path);
          });
          let banner = [...listFile.banner];
          temp = banner.concat(arrayFiles);
          setListFile({ ...listFile, banner: temp });
        }
      }
    } catch (err) {
      alert('error', 'Error Upload File', t);
    }
  };
  // remove h??nh ???nh
  const handleRemoveImage = (e: MouseEvent<HTMLAnchorElement>, value: string, type: string) => {
    e.preventDefault();
    let temp: Array<string> = [];
    let index: number = -1;
    switch (type) {
      case 'logo':
        temp = [...listFile.logo];
        index = temp.findIndex((item: string) => item === value);
        if (index !== -1) temp.splice(index, 1);
        setListFile({ ...listFile, logo: temp });
        break;
      case 'registration':
        temp = [...listFile.registration];
        index = temp.findIndex((item: string) => item === value);
        if (index !== -1) temp.splice(index, 1);
        setListFile({ ...listFile, registration: temp });
        break;
      case 'banner':
        temp = [...listFile.banner];
        index = temp.findIndex((item: string) => item === value);
        if (index !== -1) temp.splice(index, 1);
        setListFile({ ...listFile, banner: temp });
        break;
      default:
        break;
    }
  };
  const clearErrorsForm = (type: string): void => {
    switch (type) {
      case 'crossType':
        clearErrors('phoneWallet');
        clearErrors('numberBank');
        clearErrors('fullnameBank');
        clearErrors('provinceIdentifyCode');
        clearErrors('branchBank');
        break;
      default:
        break;
    }
  };
  // validate locale v?? location
  const handleCheckValidateForm = (data: any): boolean => {
    let flag = true;
    if (listLocale.length > 0) {
      let locale = listLocale.map((num: number) => `localeTitle${num}`);
      for (const key in data) {
        const indexLocale = locale.findIndex((item: string) => item === key);
        if (indexLocale !== -1 && !data[locale[indexLocale]]) {
          flag = false;
          setError(locale[indexLocale], {
            type: 'required',
            message: 'T??n merchant kh??ng ???????c r???ng',
          });
        }
      }
    }
    if (flag) {
      const bank = isCheckPayment.find((item: any) => item.type === 'bank');
      const wallet = isCheckPayment.find((item: any) => item.type === 'wallet');
      if (wallet?.value) {
        if (!data.phoneWallet) {
          setError('phoneWallet', { type: 'required', message: 'T??i kho???n payme kh??ng ???????c r???ng' });
          flag = false;
        }
      }
      if (bank?.value) {
        if (!data.nameBank) {
          setError('nameBank', {
            type: 'required',
            message: 'Ng??n h??ng kh??ng ???????c r???ng',
          });
          flag = false;
        }
        if (!data.numberBank) {
          setError('numberBank', {
            type: 'required',
            message: 'T??i kho???n ng??n h??ng kh??ng ???????c r???ng',
          });
          flag = false;
        }
        if (!data.fullnameBank) {
          setError('fullnameBank', {
            type: 'required',
            message: 'T??n ch??? t??i kho???n ng??n h??ng kh??ng ???????c r???ng',
          });
          flag = false;
        }
        if (!data.provinceIdentifyCode) {
          setError('provinceIdentifyCode', {
            type: 'required',
            message: 'T???nh th??nh kh??ng ???????c r???ng',
          });
          flag = false;
        }
        if (!data.branchBank) {
          setError('branchBank', {
            type: 'required',
            message: 'Chi nh??nh ng??n h??ng kh??ng ???????c r???ng',
          });
          flag = false;
        }
      }
      if (!data.province) {
        setError('province', {
          type: 'required',
          message: 'T???nh/tp kh??ng ???????c r???ng',
        });
        flag = false;
      }
      if (data.province && Object.keys(data.province).length < 1) {
        setError('province', {
          type: 'required',
          message: 'T???nh/tp kh??ng ???????c r???ng',
        });
        flag = false;
      }
      if (!data.district) {
        setError('district', {
          type: 'required',
          message: 'Qu???n/huy???n kh??ng ???????c r???ng',
        });
        flag = false;
      }
      if (data.district && Object.keys(data.district).length < 1) {
        setError('district', {
          type: 'required',
          message: 'Qu???n/huy???n kh??ng ???????c r???ng',
        });
        flag = false;
      }
      if (!data.wards) {
        setError('wards', {
          type: 'required',
          message: 'Ph?????ng/x?? kh??ng ???????c r???ng',
        });
        flag = false;
      }
      if (data.wards && Object.keys(data.wards).length < 1) {
        setError('wards', {
          type: 'required',
          message: 'Ph?????ng/x?? kh??ng ???????c r???ng',
        });
        flag = false;
      }
    }
    return flag;
  };
  const handleSubmitFormData = (data: any): void => {
    const isBool = handleCheckValidateForm(data);
    let payload: FormUpdateStore = {};
    let dataListLocale: Array<localeTypeInput> = [];
    if (isBool) {
      if (listLocale.length > 0) {
        listLocale.forEach((item: number) => {
          const locale: localeTypeInput = {
            title: data[`localeTitle${item}`],
            locale: data[`language${item}`],
            description: '',
          };
          dataListLocale.push(locale);
        });
      }
      payload = {
        ...payload,
        storeId: Number(dataStore?.storeId),
        locale: dataListLocale.length > 0 ? dataListLocale : [],
        title: data.storeName,
        paymentForm: category,
        phone: data?.phone,
        email: data?.email,
        website: data?.website ? data?.website : '',
        registration: {
          address: data?.address,
          locationIdentifyCode: data?.wards?.identifyCode,
          images: listFile.registration.length > 0 ? listFile.registration : [],
        },
        workingTime: {
          open: data?.open,
          close: data?.close,
        },
        description: data?.description ? data?.description : '',
        logo: listFile.logo.length > 0 ? listFile.logo[0] : '',
        isShift: data?.isShift,
        transactionType: data?.transactionType,
        crossCheckInfo: {
          crossCheckNum: data?.crossCheckNum ? parseInt(data?.crossCheckNum) : undefined,
          type: data?.CrossCheckInfoType,
        },
        paymentMethod: isCheckTree.checked.map((item: string) => parseInt(item.toString())),
      };
      if (isCheckPayment.findIndex((item: any) => item.value && item.type === 'owner') !== -1) {
        payload = {
          ...payload,

          crossCheckInfo: {
            ...payload.crossCheckInfo,
            isUseBank: false,
            isOwner: true,
            payME: {},
            bank: {},
          },
        };
      }
      if (isCheckPayment.findIndex((item: any) => item.value && item.type === 'wallet') !== -1) {
        payload = {
          ...payload,
          crossCheckInfo: {
            ...payload.crossCheckInfo,
            isUseBank: true,
            isOwner: false,
            payME: { phone: data?.phoneWallet },
            bank: {},
          },
        };
      }
      if (isCheckPayment.findIndex((item: any) => item.value && item.type === 'bank') !== -1) {
        payload = {
          ...payload,
          crossCheckInfo: {
            ...payload.crossCheckInfo,
            isUseBank: true,
            isOwner: false,
            payME: {},
            bank: {
              swiftCode: data.nameBank,
              number: data.numberBank,
              fullname: data.fullnameBank,
              provinceIdentifyCode: data.provinceIdentifyCode,
              branch: data.branchBank,
            },
          },
        };
      }
      if (listFile.banner.length > 0) {
        payload = {
          ...payload,
          bannerInfo: {
            isActive: true,
            banners: listFile.banner.map((item: string) => {
              const temp: BannerArrInput = {
                link: item,
                type: MediaType.IMAGE,
              };
              return temp;
            }),
          },
        };
      }
      dispatch(
        updateStore(payload, (status, res) => {
          if (status) {
            alert('success', 'C???p nh???t ??i???m giao d???ch th??nh c??ng', t);
          }
        })
      );
    }
  };
  useEffect(() => {
    if (router.query?.id && !dataStore) {
      handleGetDataStore(router.query?.id);
    }
  }, [router.query?.id]);
  useEffect(() => {
    if (dataStore) {
      const defaultValueStore = {
        storeName: dataStore.storeName,
        description: dataStore.description,
        website: dataStore.website,
        email: dataStore.contact.email || '',
        phone: dataStore.contact.phone || '',
        isShift: dataStore.isShift,
        address: dataStore.registration.address,
        open: dataStore.workingTime ? dataStore.workingTime[0]?.open : '',
        close: dataStore.workingTime ? dataStore.workingTime[0]?.close : '',
        transactionType: dataStore.transactionType,
        CrossCheckInfoType: dataStore.crossCheckInfo.type,
        crossCheckNum: dataStore.crossCheckInfo.crossCheckNum,
        fullnameBank: dataStore.crossCheckInfo.bank?.fullname,
        nameBank: dataStore.crossCheckInfo.bank?.swiftCode,
        numberBank: dataStore.crossCheckInfo.bank?.number,
        provinceIdentifyCode: dataStore.crossCheckInfo.bank?.provinceIdentifyCode,
        branchBank: dataStore.crossCheckInfo.bank?.branch,
        phoneWallet: dataStore.crossCheckInfo.payME?.phone,
      };
      reset(defaultValueStore);
    }
  }, [dataStore]);
  useEffect(() => {
    if (dataMerchant && Array.isArray(dataMerchant)) {
      dispatch(
        getpaymentMethodList((state, dataPayment) => {
          if (state) {
            const dataChecked: Array<string> = [];
            const dataTemp: any = [];
            const dataTreeSelect: any = [];
            dataPayment.forEach((item: any) => {
              const index = dataMerchant.findIndex(
                (paymentMerchant: any) => paymentMerchant.referId === item.id
              );
              if (index !== -1 && !(item.identifyCode === '015' || item.identifyCode === '002')) {
                dataTemp.push({ ...item, value: item.id, label: item.name });
              }
            });
            dataTreeSelect.push({
              value: '000',
              label: 'T???T C??? PH????NG TH???C',
              children: dataTemp,
            });
            let dataCheckTree = [
              ...dataMerchant.map((item: any) => {
                if (
                  !(
                    item.payCode === 'MOMO' ||
                    item.payCode === 'ZALO_PAY' ||
                    item.payCode === 'WEBMONEY' ||
                    item.payCode === 'ALIPAY_DIRECT' ||
                    item.payCode === 'ALIPAY_ECOMMERCE'
                  )
                ) {
                  return item.referId?.toString();
                }
              }),
              '000',
            ];
            dataMerchant.forEach((item: any) => {
              const index = dataPayment?.findIndex(
                (payment: any) => payment.id === item.referId && payment.paymentType !== 'FOLDER'
              );
              const isActive = dataStore?.paymentMethod.findIndex((paymentStore) => {
                return paymentStore.isActive && paymentStore.paymentMethodId === item.referId;
              });
              if (index !== -1 && isActive !== -1) {
                dataChecked.push(item.referId.toString());
              }
            });
            setCheckTree({ checked: dataChecked, expanded: dataCheckTree });
            setDataTreeSelect(dataTreeSelect);
          }
        })
      );
    }
  }, [dataMerchant]);
  useEffect(() => {
    if (dataStore?.merchantId) {
      dispatch(
        getMerchantStore(
          {
            filter: {
              merchantId: dataStore?.merchantId,
            },
          },
          (state, dataMerchant) => {
            if (state) {
              if (Array.isArray(dataMerchant.data)) {
                setDataMerchant(dataMerchant.data[0]?.paymentMethod);
              }
            }
          }
        )
      );
    }
  }, [dataStore]);
  useEffect(() => {
    if (!historyLocale && listLocale.length > 0 && saveLocale && saveLocale.length > 0) {
      saveLocale.forEach((item: any) => {
        for (const key in item) {
          setValue(key, item[key]);
        }
      });
      setHistoryLocale(true);
    }
  }, [listLocale]);
  useEffect(() => {
    dispatch(
      getListInfoBank((status, res) => {
        if (status) {
          setListBank(res.data);
        }
      })
    );
  }, []);
  return (
    <>
      {loading && <LoadingFullScreen />}
      <div className='storeDetail-container'>
        <div className='storeDetail-header'>
          <div className='btn-back'>
            <button onClick={() => router.back()}>
              <i className='fas fa-arrow-left btn-back__icon'></i>
              Tr??? v???
            </button>
          </div>
        </div>
        <div className='storeUpdate-content'>
          <div className='storeUpdate-header'>
            <h4>{t('C???p Nh???t ??i???m Giao D???ch')}</h4>
          </div>
          <form
            className='storeUpdate-form'
            onSubmit={handleSubmit(handleSubmitFormData, (errors) => {
              const data: any = getValues();
              const isBool = handleCheckValidateForm(data);
              if (isBool) return;
            })}>
            <div
              className={`storeUpdate-form-group ${
                errors.storeName?.message ? 'storeUpdate-form-errors' : ''
              }`}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {t('T??n ??i???m GD')}
                  <span className='text-danger'>(*)</span>
                </span>
                <button
                  type='button'
                  className='storeUpdate-btn__locale'
                  onClick={() => {
                    if (listLocale.length < 3) {
                      const temp = [...listLocale];
                      temp.push(Math.floor(Math.random() * 9));
                      setListLocale(temp);
                    }
                  }}>
                  <i className='fa fa-plus'></i>
                  Th??m locale
                </button>
              </label>
              <input
                type='text'
                className='storeUpdate-input'
                placeholder='T??n ??i???m giao d???ch'
                {...register('storeName')}
              />
              {errors.storeName?.message && (
                <div className='storeUpdate-form-group__errors'>
                  <i className='i-valid'></i>
                  <span>{errors.storeName?.message}</span>
                </div>
              )}
              {listLocale.length > 0 &&
                listLocale.map((item: number) => {
                  return (
                    <div className='storeUpdate-locale' key={Math.random()}>
                      <div className='locale-select'>
                        <Controller
                          control={control}
                          name={`language${item}`}
                          defaultValue={'vi_VN'}
                          render={({ field: { onChange, value }, fieldState: { error } }) => {
                            return (
                              <ReactSelect
                                styles={customStyles}
                                className='storeUpdate-select'
                                classNamePrefix='storeUpdate-select'
                                theme={(theme) => ({
                                  ...theme,
                                  borderRadius: 0,
                                  colors: {
                                    ...theme.colors,
                                    primary25: '#EFF2F7',
                                    primary: '#00be00',
                                  },
                                })}
                                noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                                value={[
                                  { label: 'VN', value: 'vi_VN' },
                                  { label: 'ZH', value: 'zh_CN' },
                                  { label: 'EN', value: 'en_US' },
                                ].find((item: dataOption) => item.value === value)}
                                options={[
                                  { label: 'VN', value: 'vi_VN' },
                                  { label: 'ZH', value: 'zh_CN' },
                                  { label: 'EN', value: 'en_US' },
                                ]}
                                onChange={(e) => onChange(e?.value)}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className='locale-input'>
                        <input
                          type='text'
                          className='storeUpdate-input'
                          placeholder='Nh???p t??n merchant theo ng??n ng???'
                          {...register(`localeTitle${item}`)}
                        />
                      </div>
                      <div className='locale-button'>
                        <button
                          onClick={() => {
                            const temp = [...listLocale];
                            const index = listLocale.findIndex((num: number) => num === item);
                            if (index !== -1) {
                              temp.splice(index, 1);
                              setListLocale(temp);
                            }
                          }}>
                          <i className='fa fa-minus'></i>
                        </button>
                      </div>
                      {(errors[`language${item}`]?.message ||
                        errors[`localeTitle${item}`]?.message) && (
                        <div className='locale-errors'>
                          <i className='i-valid'></i>
                          <span>
                            {errors[`language${item}`]?.message ||
                              errors[`localeTitle${item}`]?.message}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            <div className='storeUpdate-form-group'>
              <label>
                {t('M?? h??nh kinh doanh')}
                <span className='text-danger'>(*)</span>
              </label>
              <Controller
                control={control}
                name={'category'}
                defaultValue={'ECOMMERCE'}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <ReactSelect
                      styles={customStyles}
                      className='storeUpdate-select'
                      classNamePrefix='storeUpdate-select'
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: '#EFF2F7',
                          primary: '#00be00',
                        },
                      })}
                      noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                      options={paymentForm}
                      value={paymentForm.find((item: dataOption) => item.value === category)}
                      onChange={(e) => {
                        onChange(e?.value);
                        setCategory(e?.value);
                      }}
                    />
                  );
                }}
              />
            </div>
            <div className='storeUpdate-form-group'>
              <label>{t('S??? ??i???n tho???i')}</label>
              <input
                type='text'
                className='storeUpdate-input'
                placeholder='S??? ??i???n tho???i'
                {...register('phone')}
              />
              {errors.phone?.message && (
                <div className='storeUpdate-form-group__errors'>
                  <i className='i-valid'></i>
                  <span>{errors.phone?.message}</span>
                </div>
              )}
            </div>
            <div className='storeUpdate-form-group'>
              <label>{t('Email')}</label>
              <input
                type='text'
                className='storeUpdate-input'
                placeholder='Email'
                {...register('email')}
              />
              {errors.email?.message && (
                <div className='storeUpdate-form-group__errors'>
                  <i className='i-valid'></i>
                  <span>{errors.email?.message}</span>
                </div>
              )}
            </div>
            <div className='storeUpdate-form-group'>
              <label>{t('website')}</label>
              <input
                type='text'
                className='storeUpdate-input'
                placeholder='Website'
                {...register('website')}
              />
            </div>
            <div className='storeUpdate-form-group'>
              <label>{t('Gi??? ho???t ?????ng')}</label>
              <div className='storeUpdate-time'>
                <Controller
                  control={control}
                  name={'open'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={customStyles}
                      className='storeUpdate-time__select'
                      classNamePrefix='storeUpdate-time__select'
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: '#EFF2F7',
                          primary: '#00be00',
                        },
                      })}
                      value={workingTime.find((item) => item.value === value)}
                      noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                      options={workingTime}
                      onChange={(e) => onChange(e?.value)}
                    />
                  )}
                />
                <div className='storeUpdate-space'>
                  <span>?????n</span>
                </div>
                <Controller
                  control={control}
                  name={'close'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={customStyles}
                      className='storeUpdate-time__select'
                      classNamePrefix='storeUpdate-time__select'
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: '#EFF2F7',
                          primary: '#00be00',
                        },
                      })}
                      value={workingTime.find((item) => item.value === value)}
                      noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                      options={workingTime}
                      onChange={(e) => onChange(e?.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className='storeUpdate-form-group description form-input-textarea'>
              <textarea
                {...register('description')}
                rows={2}
                placeholder='Nh???p m?? t??? doanh nghi???p'
                className='storeUpdate-input custom'></textarea>
            </div>
            <div
              className={`storeUpdate-form-group ${
                errors.province?.message ||
                errors.district?.message ||
                errors.wards?.message ||
                errors.address?.message
                  ? 'storeUpdate-form__errors'
                  : ''
              }`}>
              <label>{t('?????a ch???')}</label>
              <LocationComponent
                className={'storeUpdate-location'}
                isClear={isClearForm}
                setValue={setValue}
                indentifyWards={dataStore?.registration?.locationIdentifyCode}
              />
              <input
                type='text'
                className='storeUpdate-input input-address'
                placeholder='?????a ch???'
                {...register('address')}
              />
              {(errors.province?.message ||
                errors.district?.message ||
                errors.wards?.message ||
                errors.address?.message) && (
                <div className='storeUpdate-form-group__errors'>
                  <i className='i-valid'></i>
                  <span>
                    {errors.province?.message ||
                      errors.district?.message ||
                      errors.wards?.message ||
                      errors.address?.message}
                  </span>
                </div>
              )}
            </div>
            <div className='storeUpdate-form-group image'>
              <label>{t('Logo')}</label>
              <div className='storeUpdate-file'>
                <label className='storeUpdate-upload'>
                  <i className='fas fa-cloud-upload-alt fa-2x'></i>
                  <input
                    type='file'
                    accept='image/*'
                    className='storeUpdate-input__upload'
                    onChange={(e) => handleUploadFile(e, 'logo')}
                  />
                  <p>{t('T???i ???nh')}</p>
                </label>
                <div className='storeUpdate-listImage'>
                  {listFile.logo.length > 0 &&
                    listFile.logo.map((item: any, index: number) => (
                      <div key={index} className='storeUpdate-listImage__item'>
                        <a
                          href=''
                          className='storeUpdate-remove__image'
                          onClick={(e) => handleRemoveImage(e, item, 'logo')}>
                          <i className='icon-remove fa-lg fas fa-times-circle' data-index='1'></i>
                        </a>
                        <img
                          src={process.env.NEXT_PUBLIC_API_UPLOAD + item}
                          alt=''
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className='storeUpdate-form-group image'>
              <label>{t('H??nh ???nh ??i???m GD')}</label>
              <div className='storeUpdate-file'>
                <label className='storeUpdate-upload'>
                  <i className='fas fa-cloud-upload-alt fa-2x'></i>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    className='storeUpdate-input__upload'
                    onChange={(e) => handleUploadFile(e, 'registration')}
                  />
                  <p>{t('T???i ???nh')}</p>
                </label>
                <div className='storeUpdate-listImage'>
                  {listFile.registration.length > 0 &&
                    listFile.registration.map((item: any, index: number) => (
                      <div key={index} className='storeUpdate-listImage__item'>
                        <a
                          href=''
                          className='storeUpdate-remove__image'
                          onClick={(e) => handleRemoveImage(e, item, 'registration')}>
                          <i className='icon-remove fa-lg fas fa-times-circle' data-index='1'></i>
                        </a>
                        <img
                          src={process.env.NEXT_PUBLIC_API_UPLOAD + item}
                          alt=''
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className='storeUpdate-form-group image'>
              <label>{t('H??nh ???nh Qu???ng C??o')}</label>
              <div className='storeUpdate-file'>
                <label className='storeUpdate-upload'>
                  <i className='fas fa-cloud-upload-alt fa-2x'></i>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    className='storeUpdate-input__upload'
                    onChange={(e) => handleUploadFile(e, 'banner')}
                  />
                  <p>{t('T???i ???nh')}</p>
                </label>
                <div className='storeUpdate-listImage'>
                  {listFile.banner.length > 0 &&
                    listFile.banner.map((item: any, index: number) => (
                      <div key={index} className='storeUpdate-listImage__item'>
                        <a
                          href=''
                          className='storeUpdate-remove__image'
                          onClick={(e) => handleRemoveImage(e, item, 'banner')}>
                          <i className='icon-remove fa-lg fas fa-times-circle' data-index='1'></i>
                        </a>
                        <img
                          src={process.env.NEXT_PUBLIC_API_UPLOAD + item}
                          alt=''
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className='storeUpdate-form-group'>
              <label>{t('Lo???i giao d???ch')}</label>
              <Controller
                control={control}
                name={'transactionType'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={customStyles}
                    className='storeUpdate-select'
                    classNamePrefix='storeUpdate-select'
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    value={transactionType.find((item: dataOption) => item.value === value)}
                    noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                    options={transactionType}
                    onChange={(e) => onChange(e?.value)}
                  />
                )}
              />
            </div>
            <div className='storeUpdate-form-group'>
              <label>{t('H??nh th???c ?????i so??t')}</label>
              <Controller
                control={control}
                name={'CrossCheckInfoType'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={customStyles}
                    className='storeUpdate-select'
                    classNamePrefix='storeUpdate-select'
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    value={typeCrossCheckEnum.find((item: dataOption) => item.value === value)}
                    noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                    options={typeCrossCheckEnum}
                    onChange={(e) => onChange(e?.value)}
                  />
                )}
              />
            </div>
            <div className='storeUpdate-form-group'>
              <label>
                {t('K??nh ?????i so??t')}
                <span className='text-danger'>(*)</span>
              </label>
              <Controller
                control={control}
                name={'crossCheckInfo'}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <ReactSelect
                      styles={customStyles}
                      className='storeUpdate-select'
                      classNamePrefix='storeUpdate-select'
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: '#EFF2F7',
                          primary: '#00be00',
                        },
                      })}
                      placeholder='Ch???n k??nh ?????i so??t'
                      noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                      options={crossCheckInfoType}
                      value={crossCheckInfoType.find((item: any) => {
                        const index = isCheckPayment.findIndex(
                          (data: typeCheckPayment) =>
                            data.value === item.value && data.type === item.type
                        );
                        if (index !== -1) return item;
                      })}
                      onChange={(e) => {
                        clearErrorsForm('crossType');
                        if (e.type === 'owner') {
                          let temp = [...isCheckPayment];
                          const index = temp.findIndex((item: any) => item.type === 'owner');
                          if (index !== -1) {
                            temp = temp.map((item: any) => {
                              if (item.type === 'owner') {
                                return { ...item, value: true };
                              }
                              return { ...item, value: false };
                            });
                            setCheckPayment(temp);
                          }
                        }
                        if (e.type === 'bank') {
                          let temp = [...isCheckPayment];
                          const index = temp.findIndex((item: any) => item.type === 'bank');
                          if (index !== -1) {
                            temp = temp.map((item: any) => {
                              if (item.type === 'bank') {
                                return { ...item, value: true };
                              }
                              return { ...item, value: false };
                            });
                            setCheckPayment(temp);
                          }
                        }
                        if (e.type === 'wallet') {
                          let temp = [...isCheckPayment];
                          const index = temp.findIndex((item: any) => item.type === 'wallet');
                          if (index !== -1) {
                            temp = temp.map((item: any) => {
                              if (item.type === 'wallet') {
                                return { ...item, value: true };
                              }
                              return { ...item, value: false };
                            });
                            setCheckPayment(temp);
                          }
                        }
                      }}
                    />
                  );
                }}
              />
              {isCheckPayment.findIndex((item: any) => item.type === 'wallet' && item.value) !==
                -1 && (
                <div className='storeUpdate-form__crossCheckInfo'>
                  <label>
                    <span>
                      T??i kho???n payme <span className='text-danger'>(*)</span>
                    </span>
                  </label>
                  <input
                    type='text'
                    className='storeUpdate-input'
                    placeholder='Nh???p t??i kho???n payme'
                    {...register('phoneWallet')}
                  />
                  {errors.phoneWallet?.message && (
                    <div className='storeUpdate-form-group__errors'>
                      <i className='i-valid'></i>
                      <span>{errors.phoneWallet?.message}</span>
                    </div>
                  )}
                </div>
              )}
              {isCheckPayment.findIndex((item: any) => item.type === 'bank' && item.value) !==
                -1 && (
                <>
                  <div className='storeUpdate-form__crossCheckInfo'>
                    <label>
                      <span>
                        Ng??n h??ng <span className='text-danger'>(*)</span>
                      </span>
                    </label>
                    <Controller
                      control={control}
                      name={'nameBank'}
                      render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                          <ReactSelect
                            styles={customStyles}
                            className='storeUpdate-select'
                            classNamePrefix='storeUpdate-select'
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: '#EFF2F7',
                                primary: '#00be00',
                              },
                            })}
                            placeholder='Ch???n ng??n h??ng'
                            noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                            options={listBank.map((item: BankType) => {
                              return { label: item.shortName, value: item.swiftCode };
                            })}
                            value={listBank
                              .map((item: BankType) => {
                                return { label: item.shortName, value: item.swiftCode };
                              })
                              .find((item: any) => item.value === value)}
                            onChange={(e) => onChange(e?.value)}
                          />
                        );
                      }}
                    />
                    {errors.numberBank?.message && (
                      <div className='storeUpdate-form-group__errors'>
                        <i className='i-valid'></i>
                        <span>{errors.numberBank?.message}</span>
                      </div>
                    )}
                  </div>
                  <div className='storeUpdate-form__crossCheckInfo'>
                    <label>
                      <span>
                        S??? t??i kho???n <span className='text-danger'>(*)</span>
                      </span>
                    </label>
                    <input
                      type='text'
                      className='storeUpdate-input'
                      placeholder='Nh???p s??? t??i kho???n ng??n h??ng'
                      {...register('numberBank')}
                    />
                    {errors.numberBank?.message && (
                      <div className='storeUpdate-form-group__errors'>
                        <i className='i-valid'></i>
                        <span>{errors.numberBank?.message}</span>
                      </div>
                    )}
                  </div>
                  <div className='storeUpdate-form__crossCheckInfo'>
                    <label>
                      <span>
                        Ch??? t??i kho???n <span className='text-danger'>(*)</span>
                      </span>
                    </label>
                    <input
                      type='text'
                      className='storeUpdate-input'
                      placeholder='Nh???p t??n ch??? t??i kho???n'
                      {...register('fullnameBank')}
                    />
                    {errors.fullnameBank?.message && (
                      <div className='storeUpdate-form-group__errors'>
                        <i className='i-valid'></i>
                        <span>{errors.fullnameBank?.message}</span>
                      </div>
                    )}
                  </div>
                  <div className='storeUpdate-form__crossCheckInfo'>
                    <label>
                      <span>
                        T???nh th??nh <span className='text-danger'>(*)</span>
                      </span>
                    </label>
                    <Controller
                      control={control}
                      name={'provinceIdentifyCode'}
                      render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                          <ReactSelect
                            styles={customStyles}
                            className='storeUpdate-select'
                            classNamePrefix='storeUpdate-select'
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: '#EFF2F7',
                                primary: '#00be00',
                              },
                            })}
                            placeholder='Ch???n t???nh th??nh'
                            noOptionsMessage={() => t('Kh??ng c?? k???t qu??? t??m ki???m')}
                            options={provinceStore.map((item: LocationType) => {
                              return {
                                label: item.title,
                                value: item.identifyCode,
                              };
                            })}
                            value={provinceStore
                              .map((item: LocationType) => {
                                return {
                                  label: item.title,
                                  value: item.identifyCode,
                                };
                              })
                              .find((item: any) => {
                                return item.value === value && item;
                              })}
                            onChange={(e) => onChange(e?.value)}
                          />
                        );
                      }}
                    />
                    {errors.provinceIdentifyCode?.message && (
                      <div className='storeUpdate-form-group__errors'>
                        <i className='i-valid'></i>
                        <span>{errors.provinceIdentifyCode?.message}</span>
                      </div>
                    )}
                  </div>
                  <div className='storeUpdate-form__crossCheckInfo'>
                    <label>
                      <span>
                        Chi nh??nh <span className='text-danger'>(*)</span>
                      </span>
                    </label>
                    <input
                      type='text'
                      className='storeUpdate-input'
                      placeholder='Nh???p chi nh??nh ng??n h??ng'
                      {...register('branchBank')}
                    />
                    {errors.branchBank?.message && (
                      <div className='storeUpdate-form-group__errors'>
                        <i className='i-valid'></i>
                        <span>{errors.branchBank?.message}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className='storeUpdate-form-group custom-checkbox'>
              <label>{t('Quy???n ????ng m??? ca')}</label>
              <div className='storeUpdate-role__group'>
                <span>{t('Nh??n vi??n c?? quy???n ????ng m??? ca')}</span>
                <label className='switch'>
                  <input type='checkbox' {...register('isShift')} />
                  <span className='slider round' />
                </label>
              </div>
            </div>
            <div className='storeUpdate-form-group custom-checkbox'>
              <label>{t('Th???i gian ?????i so??t')}</label>
              <div className='storeUpdate-number'>
                <span>T+</span>
                <input type='number' className='storeUpdate-input' {...register('crossCheckNum')} />
              </div>
            </div>
            <div className='inputs-group inputs-group-custom'>
              <label>{t('Ph????ng Th???c CTT')}</label>
              <div className='methods-ctt-merchant methods-ctt-custom'>
                <CheckboxTree
                  icons={{
                    check: <i className='icon-checkbox-custom icon-checkbox-custom--check'></i>,
                    uncheck: <i className='icon-checkbox-custom icon-checkbox-custom--uncheck'></i>,
                    halfCheck: (
                      <i className='icon-checkbox-custom icon-checkbox-custom--halfcheck'></i>
                    ),
                    leaf: <i className='fas fa-wallet' />,
                  }}
                  checked={isCheckTree.checked}
                  expanded={isCheckTree.expanded}
                  onCheck={(value) => {
                    setCheckTree({ ...isCheckTree, checked: value });
                  }}
                  onExpand={(value) => setCheckTree({ ...isCheckTree, expanded: value })}
                  iconsClass='fa5'
                  nodes={dataTreeSelect}></CheckboxTree>
              </div>
            </div>
            <div className='storeUpdate-form-btn'>
              <button className='btn btn-primary btn-submit-form'>
                <i className='fas fa-save'></i>
                <span>{t('L??u')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
