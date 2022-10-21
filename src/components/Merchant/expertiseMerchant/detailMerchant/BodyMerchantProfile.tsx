import callApiUPLOAD from 'api/UploadFiles';
import LoadingInline from 'components/common/Loading/LoadingInline';
import {
  BusinessDetailsType,
  LocationType,
  MerchantAccount,
  OperatorType,
  PaymentMethod,
  SearchByRoleInput,
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
import {
  getListAccountSale,
  updateImageMerchant,
  updateInfoMerchant,
  updateMethodChecked,
} from 'redux/actions';
import { swalCustom } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import ImageProfileMerchant from './InfoMerchant/ImageProfileMerchant';
import InfoAccountForm from './InfoMerchant/InfoAccountForm';
import InfoMerchantForm from './InfoMerchant/InfoMerchantForm';
import PaymentMethodTable from './InfoMerchant/PaymentMethodTable';
import SubInfoMerchantForm from './InfoMerchant/SubInfoMerchantForm';
import { optionTypeMC } from './utils/constantSelectOptions';

interface SubmitDataType extends MerchantAccount {
  wards: LocationType;
  district: LocationType;
  province: LocationType;
}

export interface LoadingUpdateType {
  identifyImages: boolean;
  merchantContract: boolean;
  licenseImages: boolean;
  otherImages: boolean;
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
}

function BodyMerchanttProfile({
  collapse,
  profile,
  formInfo,
  formSubInfo,
  loading = false,
  submitForm,
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
    merchantContract: false,
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

    // childrenNode.forEach((value) => {
    //   const parent = newData.find(
    //     (valueParent) => valueParent.identifyCode === value.parentIdentifyCode
    //   );
    //   value.value = value.id;
    //   value.className = renderClassUsed(value.id);
    //   value.label = <span className={renderClassUsed(value.id)}>{t(value.name)}</span>;
    //   value.icon = <></>;
    //   parent.children = [...(parent?.children || []), value];
    // });
    // return [
    //   {
    //     value: 'all',
    //     label: t('Phương thức thanh toán'),
    //     icon: <></>,
    //     children: [...newData],
    //   },
    // ];
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
      // setValueFormSubInfo('paymentMethodExtend', oldValue);
    }
    return cloneData;
  };

  const formatAndValidateData = (data: SubmitDataType, type: string = '') => {
    const { wards, district, province, ...dataMerchant } = data;
    const newData = formatPaymentMethodPayload(dataMerchant);
    delete newData.isShift;

    // profile?.accountInfo?.username === newData.contactInfo?.email &&
    //   delete newData.contactInfo?.email;
    // profile?.accountInfo?.username === newData.contactInfo?.phone &&
    //   delete newData.contactInfo?.phone;

    //format address
    newData!.businessOverview!.locationIdentifyCode = wards?.identifyCode;
    newData!.businessOverview!.wards = wards?.title?.trim();
    newData!.businessOverview!.district = district?.title?.trim();
    newData!.businessOverview!.province = province?.title?.trim();

    switch (type) {
      case 'SUBMIT_SUBINFO':
        delete newData.businessOverview?.type;
        break;
      case '':
        break;
    }

    return { ...newData };
  };

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
          case 'licenseImages':
            setValueFormInfo('businessDetails.licenseImages', [
              ...(getValuesFormInfo('businessDetails.licenseImages') || []),
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
      case 'licenseImages':
        updateImage?.licenseImages?.splice(index, 1);
        setValueFormInfo('businessDetails.licenseImages', updateImage?.licenseImages);
        break;
      case 'otherImages':
        updateImage?.otherImages?.splice(index, 1);
        setValueFormInfo('businessDetails.otherImages', updateImage?.otherImages);
        break;
      default:
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

  useEffect(() => {
    formInfo.setValue(
      'businessOverview.abbreviationName',
      profile?.businessOverview?.abbreviationName
    );
    formInfo.setValue('businessOverview.taxCode', profile?.businessOverview?.taxCode);
    formInfo.setValue('contactInfo.position', profile?.contactInfo?.position);
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

      setFormatPaymentMethods([...nodes]);

      setCheckboxTree({
        checked: [
          ...(profile?.paymentMethod
            ?.filter((ele) => !methodFolder.includes(+(ele?.referId || 0)))
            .map((ele) => `${ele.referId}`) || []),
        ],
        expanded: [...nodes.map((ele) => ele.value)],
      });
    }
  }, [collapse, loading, setCheckboxTree, setFormatPaymentMethods]);

  useEffect(() => {
    const nodes = initNodesCheckboxTree();

    setFormatPaymentMethods([...nodes]);
  }, [t, localStorage.getItem('NEXT_LOCALE'), profile]);

  useEffect(() => {}, []);
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
                        className={`form-group ${
                          formInfo?.formState?.errors?.businessOverview?.type
                            ? 'input-custom-error'
                            : ''
                        }`}>
                        <label>
                          {t('Loại đối tác')}
                          {/* <span className='text-danger ml-1'>(*)</span> */}
                        </label>
                        <Controller
                          control={controlFormInfo}
                          name='businessOverview.type'
                          // rules={{ required: true }}
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
                        className={`form-group ${
                          formInfo.formState.errors.operator ? 'input-custom-error' : ''
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
                        merchantType={watch('businessOverview.type')}
                      />
                    </div>
                    <div className='info-content'>
                      <InfoMerchantForm
                        form={formInfo}
                        merchantType={watch('businessOverview.type')}
                      />
                    </div>
                  </div>
                  <div className='section-type-mc'>
                    <div className='inputs-group-v2'>
                      <div
                        className={`form-group active form-input-textarea flex-full ${
                          errorsFormInfo?.businessOverview?.description ? 'input-custom-error' : ''
                        }`}>
                        <label>{t('Description')}</label>
                        <textarea
                          className='input-textarea'
                          placeholder={t('Nhập mô tả doanh nghiệp')}
                          style={{ width: '100%', maxHeight: '250px', minHeight: '50px' }}
                          {...registerFormInfo('businessOverview.description')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xxl-12'>
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
                <div className={`col-xxl-12 d-flex`}>
                  {/* <button
                    ref={btnSubmitFormInfo}
                    className='btn btn-primary btn-submit-form mx-auto mb-0 mt-3'>
                    <i className='fas fa-save'></i>
                    {t('Lưu thông tin')}
                  </button> */}
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
                  </div>
                </div>

                <div className='col-xxl-12 d-flex'>
                  {/* <button
                    ref={btnSubmitFormSubInfo}
                    className='btn btn-primary btn-submit-form mx-auto mb-0 mt-3'>
                    <i className='fas fa-save'></i>
                    {t('Lưu thông tin')}
                  </button> */}
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
