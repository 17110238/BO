import callApiUPLOAD from 'api/UploadFiles';
import LoadingInline from 'components/common/Loading/LoadingInline';
import _, { pick } from 'lodash';
import {
  BusinessDetailsType,
  LocationType,
  MerchantAccount,
  OperatorType,
  PaymentMethod,
  SearchByRoleInput,
  ShareHolderType,
} from 'models';
import { UserBo } from 'models/user/accountMerchant';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import CheckboxTree from 'react-checkbox-tree';
import { Controller, SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { getListAccountSale, updateMethodChecked } from 'redux/actions';
import { swalCustom } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import ImageProfileMerchant from './InfoMerchant/ImageProfileMerchant';
import InfoAccountForm from './InfoMerchant/InfoAccountForm';
import InfoMerchantForm from './InfoMerchant/InfoMerchantForm';
import InfoOwnerForm from './InfoMerchant/InfoOwnerForm';
import PaymentMethodTable from './InfoMerchant/PaymentMethodTable';
import SubInfoMerchantForm from './InfoMerchant/SubInfoMerchantForm';
import { optionTypeMC } from './utils/constantSelectOptions';
import PaymentMethodBlock from './InfoMerchant/PaymentMethod';
interface SubmitDataType extends MerchantAccount {
  wards: LocationType;
  district: LocationType;
  province: LocationType;
}

export interface LoadingUpdateType {
  identifyImages: boolean;
  representativeContracts: boolean;
  chiefAccountantAppointment: boolean;
  merchantContract: boolean;
  licenseImages: boolean;
  otherImages: boolean;
  benefitOwnerDocument: boolean;
  executiveMemberList: boolean;
}

interface Props {
  profile: MerchantAccount;
  collapse?: boolean;
  formInfo: UseFormReturn<MerchantAccount>;
  formSubInfo: UseFormReturn<MerchantAccount>;
  loading?: boolean;
  submitForm: { index: number };
  handleSubmitForm: (data: MerchantAccount, type: string) => void;
  handleSubmitError: SubmitErrorHandler<MerchantAccount>;
  onClickImage?: React.MouseEventHandler<HTMLImageElement>;
}

function BodyMerchanttProfile({
  collapse,
  profile,
  formInfo,
  formSubInfo,
  loading = false,
  submitForm,
  onClickImage,
  handleSubmitForm,
  handleSubmitError,
}: Props) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();

  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  );
  const [formatPaymentMethods, setFormatPaymentMethods] = useState<any>([]);
  const [saleMembers, setSaleMembers] = useState<UserBo[]>([]);
  const [resetTableMethod, setResetTableMethod] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [loadingUpload, setLoadingUpload] = useState<LoadingUpdateType>({
    identifyImages: false,
    representativeContracts: false,
    executiveMemberList: false,
    chiefAccountantAppointment: false,
    merchantContract: false,
    benefitOwnerDocument: false,
    licenseImages: false,
    otherImages: false,
  });

  const viewer = useRef<any>();
  const btnSubmitFormInfo = useRef<HTMLButtonElement>(null);
  const btnSubmitFormSubInfo = useRef<HTMLButtonElement>(null);

  const saleMemberOptions = useMemo(
    () =>
      saleMembers.map((sale) => {
        return {
          ...sale,
          label: sale.fullname,
          value: sale.accountId,
        };
      }),
    [saleMembers]
  );

  const {
    control: controlFormSubInfo,
    register: registerFormSubInfo,
    clearErrors: clearErrorsFormSubInfo,
    handleSubmit: handleSubmitFormSubInfo,
    formState: { errors: errorsFormSubInfo },
  } = formSubInfo;
  const {
    control: controlFormInfo,
    register: registerFormInfo,
    setValue: setValueFormInfo,
    clearErrors: clearErrorsFormInfo,
    getValues: getValuesFormInfo,
    handleSubmit: handleSubmitFormInfo,
    watch,
    formState: { errors: errorsFormInfo },
  } = formInfo;

  const [checkboxTree, setCheckboxTree] = useState<{
    expanded?: string[];
    checked?: string[];
  }>({});

  const methodFolder = paymentMethods
    .filter((ele) => ele.paymentType === 'FOLDER')
    .map((ele) => ele.id);
  //#region format Data
  const initNodesCheckboxTree = () => {
    const renderClassUsed = (id: number) => {
      const paymentSelected = profile?.paymentMethod?.map((ele) => ele.referId);

      if (profile?.paymentMethodUse?.includes(id) && paymentSelected?.includes(id)) {
        return '';
      }

      if (!paymentSelected?.includes(id)) {
        return '';
      }

      return 'method-payment--inactive';
    };
    const childrenNode: any[] = [];

    const tempDate: any[] = [...paymentMethods];
    const newData: any[] = [
      ...tempDate.reduce((arr, value, index) => {
        if (value.paymentType === 'NORMAL') {
          value.value = value.id;
          value.className = renderClassUsed(value.id);
          value.label = t(value.name);
          value.icon = <></>;
          return [
            ...arr,
            {
              ...value,
            },
          ];
        }
        childrenNode.push(value);
        return arr;
      }, []),
    ];

    return [
      {
        value: 'all',
        label: t('Phương thức thanh toán'),
        icon: <></>,
        children: [...newData],
      },
    ];
  };

  const formatPaymentMethodPayload = (data: MerchantAccount) => {
    const cloneData: MerchantAccount = { ...data };
    if (cloneData.paymentMethodExtend) {
      const oldValue: any[] = [...cloneData.paymentMethodExtend];
      const newFormat: any[] = cloneData.paymentMethodExtend.reduce(
        (arr: any, value: any, index: number) => {
          if (checkboxTree?.checked?.includes(`${value.method}`)) {
            return [...arr, value];
          } else {
            oldValue[index] = {};
          }

          return arr;
        },
        []
      );
      cloneData.paymentMethod = [
        ...(checkboxTree?.checked || []).map((ele) => ({
          referId: +ele,
        })),
      ];
      cloneData.paymentMethodExtend = newFormat.filter((ele) => !!ele);

      !cloneData.paymentMethodExtend.length && delete cloneData.paymentMethodExtend;
    }
    return cloneData;
  };

  const formatAndValidateData = (data: SubmitDataType, type: string = '') => {
    const { wards, district, province, ...dataMerchant } = data;
    const newData = formatPaymentMethodPayload(dataMerchant);

    switch (type) {
      case 'SUBMIT_INFO':
        newData!.businessOverview!.locationIdentifyCode = wards?.identifyCode;
        newData!.businessOverview!.wards = wards?.title?.trim();
        newData!.businessOverview!.district = district?.title?.trim();
        newData!.businessOverview!.province = province?.title?.trim();

        const currHolder = newData?.businessOverview?.shareholders || [];
        let idx = 0;
        for (const holder of [...currHolder]) {
          if (Object.keys(_.pickBy(holder)).length !== Object.keys(holder).length) {
            currHolder.splice(idx, 1);
          } else {
            idx++;
          }
        }

        newData!.businessOverview!.shareholders = currHolder;
        break;
      case 'SUBMIT_SUBINFO':
        delete newData.businessOverview?.type;
        break;
      case '':
        break;
    }

    return { ...newData };
  };
  //#endregion

  //#region handle actions
  const onSubmitFormInfo = (type: string = 'SUBMIT_INFO') => {
    const result: SubmitHandler<MerchantAccount> = (data, e) => {
      e?.preventDefault();
      //format paymentMethods
      const newData = formatAndValidateData(data as SubmitDataType, type);
      handleSubmitForm(newData, type);
    };
    return result;
  };

  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;
    const name = e.target.name;
    console.log(files);

    if (!files?.length) return;

    setLoadingUpload({ ...loadingUpload, [name]: true });

    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const { data: res } = await callApiUPLOAD(formData);
      setLoadingUpload({ ...loadingUpload, [name]: false });
      if (res.code === 1000) {
        switch (name) {
          case 'identifyImages':
            setValueFormInfo('businessDetails.identifyImages', [
              ...(getValuesFormInfo('businessDetails.identifyImages') || []),
              ...res.data.map((info: { path: string }) => info.path),
            ]);
            break;
          case 'executiveMemberList':
            setValueFormInfo('businessDetails.executiveMemberList', [
              ...(getValuesFormInfo('businessDetails.executiveMemberList') || []),
              ...res.data.map((info: { path: string }) => info.path),
            ]);
            break;
          case 'representativeContracts':
            setValueFormInfo('businessDetails.representativeContracts', [
              ...(getValuesFormInfo('businessDetails.representativeContracts') || []),
              ...res.data.map((info: { path: string }) => info.path),
            ]);
            break;
          case 'licenseImages':
            setValueFormInfo('businessDetails.licenseImages', [
              ...(getValuesFormInfo('businessDetails.licenseImages') || []),
              ...res.data.map((info: { path: string }) => info.path),
            ]);
            break;
          case 'chiefAccountantAppointment':
            setValueFormInfo('businessDetails.chiefAccountantAppointment', [
              ...(getValuesFormInfo('businessDetails.chiefAccountantAppointment') || []),
              ...res.data.map((info: { path: string }) => info.path),
            ]);
            break;
          case 'benefitOwnerDocument':
            setValueFormInfo('businessDetails.benefitOwnerDocument', [
              ...(getValuesFormInfo('businessDetails.benefitOwnerDocument') || []),
              ...res.data.map((info: { path: string }) => info.path),
            ]);
            break;
          case 'merchantContract':
            setValueFormInfo('businessDetails.merchantContract.url', res.data[0].path);
            break;
          case 'otherImages':
            setValueFormInfo('businessDetails.otherImages', [
              ...(getValuesFormInfo('businessDetails.otherImages') || []),
              ...res.data.map((info: { path: string }) => info.path),
            ]);
            break;
          case 'operatingStaff':
            setValueFormInfo('businessOverview.operatingStaff', res.data[0].path);
            break;

          default:
            break;
        }
      }
    } catch (error) {
      alert('error', 'Error Upload File', t);
    }
  };

  const handleRemoveImage: React.MouseEventHandler<HTMLElement> = async (e) => {
    const target = e.target as HTMLElement;
    const name = target.getAttribute('data-name');
    const index = +(target.getAttribute('data-index') || -1);

    const popup = await swalCustom.fire({
      icon: 'info',
      title: 'Xác nhận xóa hình ảnh',
    });

    if (!popup.isConfirmed) return;

    const updateImage: BusinessDetailsType = getValuesFormInfo('businessDetails')!;
    switch (name) {
      case 'identifyImages':
        updateImage?.identifyImages?.splice(index, 1);
        setValueFormInfo('businessDetails.identifyImages', updateImage?.identifyImages);
        break;
      case 'executiveMemberList':
        updateImage?.executiveMemberList?.splice(index, 1);
        setValueFormInfo('businessDetails.executiveMemberList', updateImage?.executiveMemberList);
        break;
      default:
      case 'representativeContracts':
        updateImage?.representativeContracts?.splice(index, 1);
        setValueFormInfo(
          'businessDetails.representativeContracts',
          updateImage?.representativeContracts
        );
        break;
      case 'licenseImages':
        updateImage?.licenseImages?.splice(index, 1);
        setValueFormInfo('businessDetails.licenseImages', updateImage?.licenseImages);
        break;
      case 'chiefAccountantAppointment':
        updateImage?.chiefAccountantAppointment?.splice(index, 1);
        setValueFormInfo(
          'businessDetails.chiefAccountantAppointment',
          updateImage?.chiefAccountantAppointment
        );
        break;
      case 'benefitOwnerDocument':
        updateImage?.benefitOwnerDocument?.splice(index, 1);
        setValueFormInfo('businessDetails.benefitOwnerDocument', updateImage?.benefitOwnerDocument);
        break;
      case 'otherImages':
        updateImage?.otherImages?.splice(index, 1);
        setValueFormInfo('businessDetails.otherImages', updateImage?.otherImages);
        break;
      case 'operatingStaff':
        setValueFormInfo('businessOverview.operatingStaff', '');
        break;

        break;
    }
  };

  const handlePreviewImage: React.MouseEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    const src = target.src;

    if (src) {
      setImgSrc(src.replace('?w=100', ''));
      viewer.current && viewer.current.show();
    }
  };

  const handleRemoveHolder: React.MouseEventHandler<HTMLElement> = async (e) => {
    const target = e.target as HTMLElement;

    const index = +(target.getAttribute('data-index') || -1);
    if (index === -1) return;

    const popup = await swalCustom.fire({
      icon: 'info',
      title: 'Xác nhận xóa pháp nhân',
    });

    if (popup.isConfirmed) {
      const oldHolder = getValuesFormInfo('businessOverview.shareholders') || [];
      oldHolder.splice(index, 1);
      setValueFormInfo('businessOverview.shareholders', [...oldHolder]);
    }
  };

  const handleAddHolder: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const oldHolder = getValuesFormInfo('businessOverview.shareholders') || [];

    setValueFormInfo('businessOverview.shareholders', [...oldHolder, {}]);
  };

  //#endregion

  //#region useEffect
  useEffect(() => {
    const filter: SearchByRoleInput = {
      filter: {
        role: 'ins.sale',
      },
      paging: {
        start: 0,
        limit: 100,
      },
    };
    dispatch(
      getListAccountSale(filter, (state, res) => {
        setSaleMembers(res);
      })
    );
  }, []);

  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [profile?.businessDetails, imgSrc]);

  useEffect(() => {
    switch (submitForm.index) {
      case 0:
        btnSubmitFormInfo.current && btnSubmitFormInfo.current.click();
        break;
      case 1:
        btnSubmitFormSubInfo.current && btnSubmitFormSubInfo.current.click();
        break;
      default:
        break;
    }
  }, [submitForm]);

  useEffect(() => {
    if (profile?.businessOverview?.type) {
      setValueFormInfo('businessOverview.type', profile.businessOverview?.type);
    }
  }, [profile?.businessOverview?.type]);
  // useEffect(() => {
  //   //const isIndividualMerchant = ['INDIVIDUAL', 'FOREIGN_INDIVIDUAL'].includes(formInfo.watch('businessOverview.type') || '');
  //   const shareHolder_individual: ShareHolderType = {
  //     fullname: profile?.contactInfo?.name,
  //     identifyNumber: profile?.contactInfo?.identifyNumber,
  //     title: 'Chủ cửa hàng',
  //     capitalRatio: '100'
  //   }
  //   formInfo.setValue('businessOverview.shareholders', [shareHolder_individual])

  // }, [])

  useEffect(() => {
    const isIndividualMerchant = ['INDIVIDUAL', 'FOREIGN_INDIVIDUAL'].includes(
      formInfo.watch('businessOverview.type') || ''
    );
    const shareHolder_individual: ShareHolderType = {
      fullname: profile?.contactInfo?.name,
      identifyNumber: profile?.contactInfo?.identifyNumber,
      title: 'Chủ cửa hàng',
      capitalRatio: '100',
      nationality: profile?.contactInfo?.nationality,
    };
    // console.log("🚀 ~ file: BodyMerchantProfile.tsx ~ line 456 ~ useEffect ~ shareHolder_individual", shareHolder_individual);
    const newValue = pick(profile?.businessOverview, [
      'abbreviationName',
      'companyAddress',
      'operatingStaff',
      'totalRevenue',
      'averageIncome',
      'taxCode',
      'shareHolders',
    ]);
    formInfo.setValue('businessOverview.abbreviationName', newValue.abbreviationName);
    formInfo.setValue('businessOverview.companyAddress', newValue.companyAddress);
    formInfo.setValue('businessOverview.operatingStaff', newValue.operatingStaff);
    formInfo.setValue('businessOverview.totalRevenue', newValue.totalRevenue);
    formInfo.setValue('businessOverview.averageIncome', newValue.averageIncome);
    formInfo.setValue('businessOverview.taxCode', newValue.taxCode);
    formInfo.setValue('contactInfo.position', profile?.contactInfo?.position);
    isIndividualMerchant
      ? formInfo.setValue('businessOverview.shareholders', [shareHolder_individual])
      : formInfo.setValue(
        'businessOverview.shareholders',
        profile?.businessOverview?.shareholders || []
      );
    //isIndividualMerchant && formInfo.setValue('businessOverview.shareholders', [shareHolder_individual])
  }, [formInfo.watch('businessOverview.type')]);

  useEffect(() => {
    const imgsPreview = document.querySelector('.merchant-imgs-preview') as HTMLElement;

    if (collapse && !loading) {
      if (imgsPreview) {
        viewer.current = new Viewer(imgsPreview, {
          inline: profile.state !== 'APPROVED',
          button: false,
          title: false,
          toolbar: {
            zoomIn: 1,
            zoomOut: 1,
            oneToOne: 1,
            reset: 1,
            prev: 1,
            play: 0,
            next: 1,
            rotateLeft: 1,
            rotateRight: 1,
            flipHorizontal: 1,
            flipVertical: 1,
          },
        });
      }

      const nodes = initNodesCheckboxTree();
      const checked = [
        ...(profile?.paymentMethod
          ?.filter((ele) => !methodFolder.includes(+(ele?.referId || 0)))
          .map((ele) => `${ele.referId}`) || []),
      ];
      setFormatPaymentMethods([...nodes]);

      setCheckboxTree({
        checked: checked,
        expanded: [...nodes.map((ele) => ele.value)],
      });

      dispatch(updateMethodChecked(checked));
    }
  }, [collapse, loading, setCheckboxTree, setFormatPaymentMethods]);

  useEffect(() => {
    const nodes = initNodesCheckboxTree();

    setFormatPaymentMethods([...nodes]);
  }, [t, localStorage.getItem('NEXT_LOCALE'), profile]);
  //#endregion

  // console.log('profile', profile)
  const [checkedCheckboxes, setCheckedCheckboxes] = useState<any>([]);
  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);

  const handleCheckAllCheckBox = (data: any) => {
    setIsCheckedAll(!isCheckedAll);
    const getCheckedCheckboxesAll = checkedCheckboxes.concat(data);
    !isCheckedAll ? setCheckedCheckboxes(getCheckedCheckboxesAll) : setCheckedCheckboxes([]);
    let checkboxes: any = document.getElementsByName('name[]');
    checkboxes.lenght === 0 ? setIsCheckedAll(false) : '';
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = isCheckedAll ? false : true;
    }
  };

  const handleCheckboxChange = (profile: any) => {
    const isChecked = checkedCheckboxes.some(
      (checkedCheckbox: any) => checkedCheckbox.id === profile.id
    );

    if (isChecked) {
      setCheckedCheckboxes(
        checkedCheckboxes.filter((checkedCheckbox: any) => checkedCheckbox.id !== profile.id)
      );
    } else {
      // const profileAvatar = profile?.avatar
      //   ? profile?.avatar
      //   : profile?.gender === 'MALE'
      //   ? maleDefaultImage
      //   : femaleDefaultImage;
      setCheckedCheckboxes(checkedCheckboxes.concat({ ...profile }));
    }
  };

  return (
    <Collapse in={collapse || false}>
      <div className='body-merchant-profile'>
        <div className='section-form'>
          {loading ? (
            <div className='loading-block'>
              <LoadingInline loading={loading} />
            </div>
          ) : (
            <div className='block-section-body'>
              <div className='block-section-body__top-section'>
                <button className='btn btn-back' onClick={() => router.back()}>
                  <i className='fas fa-angle-left fa-3x btn-back__icon'></i>
                  {t('Back')}
                </button>
              </div>
              <form
                className='section-body line--hidden block-section-body__form-section'
                onSubmit={handleSubmitFormInfo(onSubmitFormInfo(), handleSubmitError)}>
                <div className='col-xxl-12 d-flex flex-column'>
                  <div className='section-type-mc section-sale-mc'>
                    <div className='inputs-group-v2 d-flex'>
                      <div
                        style={{ minWidth: 230, maxWidth: 230 }}
                        className={`form-group ${formInfo?.formState?.errors?.businessOverview?.type
                          ? 'input-custom-error'
                          : ''
                          }`}>
                        <label>
                          {t('Loại đối tác')}
                          <span className='text-danger ml-1'>(*)</span>
                        </label>
                        <Controller
                          control={controlFormInfo}
                          name='businessOverview.type'
                          rules={{ required: true }}
                          render={({ field }) => (
                            <ReactSelect
                              placeholder={t('--- Vui lòng chọn ---')}
                              className='select-input-form'
                              classNamePrefix='input-select'
                              value={
                                optionTypeMC.find(
                                  (value) => value.value === field.value?.toUpperCase()
                                ) || null
                              }
                              onChange={(e: any) => {
                                field.onChange(e.value);
                                clearErrorsFormInfo();
                                clearErrorsFormSubInfo();
                              }}
                              options={optionTypeMC}
                            />
                          )}
                        />
                      </div>
                      <div
                        style={{ minWidth: 230, maxWidth: 230 }}
                        className={`form-group ${formInfo.formState.errors.operator ? 'input-custom-error' : ''
                          }`}>
                        <label>{t('Nhân viên phát triển')}</label>
                        <Controller
                          control={controlFormInfo}
                          name='operator'
                          render={({ field }) => (
                            <ReactSelect
                              placeholder={t('--- Vui lòng chọn ---')}
                              className='select-input-form'
                              classNamePrefix='input-select'
                              value={
                                saleMemberOptions.find(
                                  (value) =>
                                    field?.value &&
                                    value.value === (field?.value[0] as OperatorType)?.accountId
                                ) || null
                              }
                              onChange={(e: any) => {
                                if (e && Object.keys(e).length) {
                                  field.onChange([
                                    {
                                      accountId: e.value,
                                      username: e.username,
                                    },
                                  ]);
                                } else {
                                  field.onChange(undefined);
                                }
                                formInfo.clearErrors('operator');
                              }}
                              options={saleMemberOptions}
                              isClearable
                              isSearchable
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='info-content-group info-merchant info-content-group--border'>
                    <div className='info-content d-flex justify-content-between flex-column'>
                      <InfoAccountForm
                        form={formInfo}
                        merchantType={watch('businessOverview.type') || ''}
                      />
                      <InfoOwnerForm
                        form={formInfo}
                        merchantType={watch('businessOverview.type') || ''}
                      />
                      <InfoMerchantForm
                        form={formInfo}
                        merchantType={watch('businessOverview.type') || ''}
                        onUploadImage={handleUploadImage}
                        onRemoveImage={handleRemoveImage}
                        onClickImage={onClickImage}
                        onRemoveHolder={handleRemoveHolder}
                        onAddHolder={handleAddHolder}
                      />
                    </div>
                    <div className='info-content'>
                      {profile.state === 'APPROVED' && (
                        <img
                          src={imgSrc}
                          className='merchant-imgs-preview'
                          style={{ visibility: 'hidden', height: '0' }}
                        />
                      )}
                      <ImageProfileMerchant
                        onUploadImage={handleUploadImage}
                        onRemoveImage={handleRemoveImage}
                        onClickImage={handlePreviewImage}
                        loading={loadingUpload}
                        hidePreviewInlineImgs={profile.state === 'APPROVED'}
                        merchantType={watch('businessOverview.type')}
                        form={formInfo}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`col-xxl-12 ${['APPROVED'].includes(profile?.state || '') ? 'd-none' : ''
                    } `}>
                  <button
                    ref={btnSubmitFormInfo}
                    className='btn btn-primary btn-submit-form mx-auto mb-0 mt-3'>
                    <i className='fas fa-save'></i>
                    {t('Lưu thông tin')}
                  </button>
                </div>
              </form>
            </div>
          )}
          {loading ? (
            <div className='loading-block'>
              <LoadingInline loading={loading} />
            </div>
          ) : (
            <div className='block-section-body subinfo-merchant'>
              <div className='block-section-body__top-section'>
                <p className='top-section__title'>{t('Thông tin bổ sung')}</p>
              </div>
              <form
                className='section-body line--hidden justify-content-between block-section-body__form-section'
                onSubmit={handleSubmitFormSubInfo(
                  onSubmitFormInfo('SUBMIT_SUBINFO'),
                  handleSubmitError
                )}>
                <div className='col-xxl-12'>
                  <div className='info-content-group subinfo-merchant-form'>
                    <SubInfoMerchantForm
                      clearErrors={clearErrorsFormSubInfo}
                      errors={errorsFormSubInfo}
                      control={controlFormSubInfo}
                      register={registerFormSubInfo}
                    />
                    <div className='info-content gateway-methods'>
                      <div className='inputs-group-v2'>
                        <div className='form-group flex-full'>
                          <label>{t('Phương thức CTT')}</label>
                          <div className='methods-ctt-merchant'>
                            <CheckboxTree
                              icons={{
                                check: (
                                  <i className='icon-checkbox-custom icon-checkbox-custom--check'></i>
                                ),
                                uncheck: (
                                  <i className='icon-checkbox-custom icon-checkbox-custom--uncheck'></i>
                                ),
                                halfCheck: (
                                  <i className='icon-checkbox-custom icon-checkbox-custom--halfcheck'></i>
                                ),
                              }}
                              nodes={formatPaymentMethods}
                              checked={checkboxTree?.checked || []}
                              expanded={checkboxTree?.expanded || []}
                              iconsClass='fa5'
                              onCheck={(checked) => {
                                clearErrorsFormSubInfo('paymentMethodExtend');
                                dispatch(updateMethodChecked(checked));
                                setCheckboxTree({ ...checkboxTree, checked });
                                setResetTableMethod(!resetTableMethod);
                              }}
                              onExpand={(expanded) =>
                                setCheckboxTree({ ...checkboxTree, expanded })
                              }></CheckboxTree>
                          </div>
                        </div>
                      </div>
                      <div className='inputs-group-v2 mt-4 payment-method-table'>
                        <PaymentMethodTable
                          checked={checkboxTree.checked}
                          form={formSubInfo}
                          refresh={resetTableMethod}
                        />
                      </div>
                    </div>

                    {/* <PaymentMethodBlock form={formSubInfo} /> */}
                  </div>
                </div>

                <div
                  className={`col-xxl-12 ${['APPROVED'].includes(profile?.state || '') ? 'd-none' : 'd-flex'
                    }`}>
                  <button
                    ref={btnSubmitFormSubInfo}
                    className='btn btn-primary btn-submit-form mx-auto mb-0 mt-3'>
                    <i className='fas fa-save'></i>
                    {t('Lưu thông tin')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Collapse>
  );
}

export default BodyMerchanttProfile;
