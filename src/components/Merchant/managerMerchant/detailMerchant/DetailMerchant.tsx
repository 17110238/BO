import callUploadAPI from 'api/UploadFiles';
import ModalCreateDelegateAccount from 'components/common/ModalAccountMc/ModalCreateDelegateAccount';
import { ChangeOfFeeConfigurationModal } from 'components/Merchant/approvalMerchant/modal/ChangeOfFeeConfiguration';
import dayjs from 'dayjs';
import $ from 'jquery';
import _, { remove } from 'lodash';
import {
  DefaultFeeMerchantConfig,
  FeeMerchantConfig,
  MerchantAccount,
  MerchantFeeItem,
  OperatorType,
  PaymentMethod,
  ShareHolderType,
  stateMcEnum,
} from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  approvingMerchant,
  getBussinessDetail,
  getDefaultMerchantFeeConfig,
  getInfoMerchant,
  getMccCodeListPartial,
  getMerchantFeeConfig,
  getNationalList,
  getpaymentMethodList,
  requestUpdateFee,
  requestUpdateInfo,
  TypeConfigFeeMcEnum,
  updateActiveAccountMerchant,
  updateConfigFeeMerchant,
  updateInfoMerchant,
} from 'redux/actions';
import { swalCustom } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import DataTableEmployee from './DataTableMerchantEmployee';
import HeaderMerchantContainer from './HeaderDetailMerchant';
import defaultMethod from './utils/constDefaultMethod';
import { formatDataFee, formatValueDefaultOnData } from './utils/formatDataFee';

const ModalRejectMerchant = dynamic(
  () => import('components/Merchant/approvalMerchant/modal/ModalRejectMerchant'),
  { ssr: false }
);

const FeeConfigMerchantProfile = dynamic(() => import('./FeeConfigMerchantProfile'), {
  ssr: false,
});
const BodyMerchantProfile = dynamic(() => import('./BodyMerchantProfile'), {
  ssr: false,
});

interface Props {
  merchantId: undefined | string | string[];
}

function DetailMerchant({ merchantId }: Props) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();

  //#region useSelector
  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  );
  const defaultMerchantFee = useSelector<any, DefaultFeeMerchantConfig>(
    (state) => state?.utility?.defaultMerchantFee
  );
  const merchantFee = useSelector<any, FeeMerchantConfig>((state) => state?.merchantRD.merchantFee);
  const checked = useSelector<any, string[]>((state) => state?.merchantRD.methodChecked);
  const merchantProfile = useSelector<any, MerchantAccount>(
    (state) => state.merchantRD.merchantProfile
  );
  //#endregion

  //#region useState
  const [collapseState, setCollapseState] = useState({
    sectionInfo: true,
    sectionFeeConfig: true,
    sectionEmployee: true,
    sectionStore: true,
  });
  const [modalState, setModalState] = useState({
    modalAddDelegate: false,
    modalRejectMC: false,
    modalHistoryFee: false,
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [submitAllForm, setSubmitAllForm] = useState<any>({ index: -1, isAllSubmit: false });
  const [isApproveFeeConfig, setIsApproveFeeConfig] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  //#endregion

  const viewer = useRef<any>();

  const tablePaymentPosition = paymentMethods
    .filter((ele) => ele.paymentType !== 'FOLDER')
    .map((ele) => ele.id);
  const methodFolder = paymentMethods
    .filter((ele) => ele.paymentType === 'FOLDER')
    .map((ele) => ele.id);

  //#region form Merchant
  const formInfo = useForm<MerchantAccount>({
    reValidateMode: 'onSubmit',
    shouldFocusError: true,
  });

  const formSubInfo = useForm<MerchantAccount>({
    reValidateMode: 'onSubmit',
    shouldFocusError: true,
  });

  const formEcommerceFee = useForm<FeeMerchantConfig>({
    shouldFocusError: false,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const formPoboFee = useForm<FeeMerchantConfig>({
    shouldFocusError: false,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const formLogFee = useForm<Pick<MerchantFeeItem, 'logInfo'>>({
    shouldFocusError: true,
    reValidateMode: 'onSubmit',
  });
  //#endregion

  //#region format Data
  const convertToDateString = (date?: string) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : undefined;
  };

  const formatMethodDataExtend = (data: MerchantAccount) => {
    return [
      ...tablePaymentPosition.map((pos) => {
        const target = data?.paymentMethodExtend?.find(
          (value) => !methodFolder.includes(+(value?.method || 0)) && value.method === +pos
        );
        let result: any = {
          method: pos,
          extraData: defaultMethod[pos as keyof {}] || { isTransferNow: false },
        };

        if (!target && !data.paymentMethod?.find((val) => val.referId === pos)) return {};

        const extraData: string = target?.extraData ? (target?.extraData as string) : '{}';

        result = {
          ...result,
          extraData: {
            ...result.extraData,
            ..._.pickBy(JSON.parse(extraData), (v) => [true, false].includes(v) || v),
          },
        };

        return result;
      }),
    ];
  };

  const formatPaymentMethodPayload = (data: MerchantAccount) => {
    const cloneData: MerchantAccount = { ...data };
    if (cloneData.paymentMethodExtend) {
      const newFormat: any[] = cloneData.paymentMethodExtend.reduce(
        (arr: any, value: any, index: number) => {
          if (checked?.includes(`${value.method}`)) {
            return [...arr, value];
          }

          return arr;
        },
        []
      );

      cloneData.paymentMethod = [
        ...(checked || []).map((ele) => ({
          referId: +ele,
        })),
      ];

      cloneData.paymentMethodExtend = newFormat.filter((ele) => !!ele);

      !cloneData.paymentMethodExtend.length && delete cloneData.paymentMethodExtend;
    }
    return cloneData;
  };

  const formatPayload = (data: MerchantAccount) => {
    const { wards, district, province, ...dataMerchant } = data as any;
    const newData = formatPaymentMethodPayload(dataMerchant);
    //format address
    newData!.businessOverview!.locationIdentifyCode = wards?.identifyCode;
    newData!.businessOverview!.wards = wards?.title?.trim();
    newData!.businessOverview!.district = district?.title?.trim();
    newData!.businessOverview!.province = province?.title?.trim();

    if (newData.paymentMethodExtend) {
      !newData.paymentMethodExtend.length && delete newData.paymentMethodExtend;
    }

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

    delete newData.state;

    // Custom newData add field contractDateEnd
    const { contractDateStart, contractDateEnd, ...cloneNewData } = newData;
    const finishData: any = {
      ...cloneNewData,
      contactInfo: {
        ...cloneNewData.contactInfo,
        expiredDate: contractDateEnd,
      },
      benefitOwner: {
        ...cloneNewData.businessOverview?.benefitOwner,
      },
    };
    delete finishData?.businessOverview?.benefitOwner;

    return finishData;
  };
  //#endregion

  //#region handle action
  const handleSubmitForm = (data: MerchantAccount, type: string) => {
    setLoading(false);

    const { contractDateStart, contractDateEnd, ...cloneNewData } = data;
    const finishData: any = {
      ...cloneNewData,
      contactInfo: {
        ...cloneNewData.contactInfo,
        expiredDate: contractDateEnd,
      },
      benefitOwner: {
        ...cloneNewData.businessOverview?.benefitOwner,
      },
    };
    delete finishData.businessOverview.benefitOwner;
    dispatch(
      updateInfoMerchant(
        {
          id: +(merchantId || 0),
          ...finishData,
        },
        (state, res) => {
          if (state) {
            !submitAllForm.isAllSubmit && alert('success', res?.message, t);
            !submitAllForm.isAllSubmit && getMerchantProfile(type);
            submitAllForm.isAllSubmit &&
              setSubmitAllForm({
                ...submitAllForm,
                index: submitAllForm.index + 1,
              });
          } else {
            alert('error', res.message, t);
          }
        }
      )
    );
  };

  const handleSubmitFormConfigFee = (
    data: MerchantFeeItem[],
    type: TypeConfigFeeMcEnum,
    isFeeChange: boolean
  ) => {
    setIsSubmit(false);
    let result = true;
    let success = 0;
    let message = '';

    if (!isFeeChange) {
      submitAllForm.isAllSubmit &&
        setSubmitAllForm({
          ...submitAllForm,
          index: submitAllForm.index + 1,
        });
      return;
    }
    if (isFeeChange && Object.keys(formLogFee.formState.errors).length) {
      setSubmitAllForm({ index: -1, isAllSubmit: false });
      setIsSubmit(false);
      return;
    }

    data.forEach((value) => {
      dispatch(
        updateConfigFeeMerchant(
          { merchantId: +(merchantId || 0), ...value, type },
          (state, res) => {
            success += +state;
            result = state;
            message = res.message;
            !state && alert('error', res.message + value.paymentMethodId, t);
            if (success === data.length) {
              formLogFee.reset();
              !submitAllForm.isAllSubmit &&
                (alert('success', message, t),
                  dispatch(
                    getMerchantFeeConfig({
                      merchantId: +(merchantId || 0),
                    })
                  ));
              submitAllForm.isAllSubmit &&
                setSubmitAllForm({
                  ...submitAllForm,
                  index: submitAllForm.index + 1,
                });
            }
          }
        )
      );
    });
  };

  const handleSetDefaultValue = (data: MerchantAccount, type: string) => {
    const isIndividualMerchant = ['INDIVIDUAL', 'FOREIGN_INDIVIDUAL'].includes(
      data.businessOverview?.type || ''
    );
    const shareHolder_individual: ShareHolderType = {
      fullname: data?.contactInfo?.name,
      identifyNumber: data?.contactInfo?.identifyNumber,
      title: 'Chủ cửa hàng',
      capitalRatio: '100',
      nationality: data?.contactInfo?.nationality,
    };
    let businessOverview = data?.businessOverview || {};
    if (!!isIndividualMerchant) businessOverview.shareholders = [shareHolder_individual];
    // let formatData = { ...data, ...(Boolean(isIndividualMerchant) && { 'businessOverview':  businessOverview  }) };
    ['ALL_INFO', 'SUBMIT_INFO'].includes(type) &&
      (() => {
        const formInfoValue = {
          contactInfo: {
            ..._.pick(data?.contactInfo, [
              'name',
              'identifyNumber',
              'issuePlace',
              'position',
              'phone',
              'email',
              'nationality',
            ]),
            issueDate: convertToDateString(data?.contactInfo?.issueDate),
            birthday: convertToDateString(data?.contactInfo?.birthday),
          },
          businessDetails: formInfo.getValues('businessDetails'),
          businessOverview: _.merge(
            _.pick(data?.businessOverview, [
              'abbreviationName',
              'address',
              'category',
              'categoryName',
              'homeUrl',
              'maxAmountTransaction',
              'maxRange',
              'taxCode',
              'type',
              'averageIncome',
              'totalRevenue',
              'operatingStaff',
              'companyAddress',
              'shareholders',
              'description',
              'benefitOwner',
            ]),

            { brandName: data?.businessOverview?.brandName?.toUpperCase() }
          ),
          minBalance: data?.minBalance,
          operator: data?.operator as OperatorType[],
          emailBcc: data?.emailBcc,
          product: data?.product,
          contractDateStart: data?.contractDateStart,
          contractDateEnd: data?.contractDateEnd,
        };
        formInfo.reset(formInfoValue);
      })();

    ['ALL_INFO', 'SUBMIT_SUBINFO'].includes(type) &&
      (() => {
        const formSubInfoValue = {
          ..._.pick(data, [
            'authType',
            'withdrawVerifyType',
            'notifyTelegram',
            'currency',
            'isSecurityPayout',
            'connectionTypeList',
          ]),
          crossCheckInfo: {
            crossCheckNum: data?.crossCheckInfo?.crossCheckNum || 0,
            type: data?.crossCheckInfo?.type || undefined,
          },
          businessOverview: _.pick(data.businessOverview, ['connectionType', 'description']),
          paymentMethod: data?.paymentMethod?.filter(
            (ele) => !methodFolder.includes(+(ele?.referId || 0))
          ),
          paymentMethodExtend: formatMethodDataExtend(data),
        };

        formSubInfo.reset(formSubInfoValue);
      })();
  };

  const getMerchantProfile = (type: string = 'ALL_INFO') => {
    const payloadFilter = { merchantId: +(merchantId || 0) };

    ['SUBMIT_INFO', 'ALL_INFO'].includes(type) &&
      dispatch(
        getBussinessDetail({ filter: payloadFilter }, (state, res) => {
          if (state) {
            formInfo.setValue('businessDetails', res?.businessDetails);
          }
        })
      );
    dispatch(
      getInfoMerchant({ filter: payloadFilter }, (state, res) => {
        if (!state) {
          alert('error', res?.message || 'Server error', t);
          return;
        }
        setLoading(false);
        handleSetDefaultValue(res.data[0], type);

        ['SUBMIT_SUBINFO', 'ALL_INFO'].includes(type) &&
          dispatch(
            getMerchantFeeConfig({
              merchantId: +(merchantId || 0),
            })
          );
      })
    );
  };

  const handleSubmitAllForm = () => {
    setSubmitAllForm({
      index: 0,
      isAllSubmit: true,
    });
  };

  const handleRequestChangeInfo = async () => {
    let hasError: boolean = false;
    let errorMessage: string = '';
    const methodSelected = sessionStorage.getItem('feeMethodSelected');

    const checkHasError = (error: any) => {
      if (!hasError && !!Object.keys(error).length) {
        hasError = true;
      }
    };

    // check fee change to validate
    const dataMerchantFee = formatDataFee(
      {
        ecommerceFeeList: formatValueDefaultOnData(merchantFee, 'ecommerceFeeList'),
        poboFeeList: formatValueDefaultOnData(merchantFee, 'poboFeeList'),
      },
      +(merchantId || 0)
    );

    await formInfo.handleSubmit((data, e) => { }, checkHasError)();
    await formSubInfo.handleSubmit((data, e) => { }, checkHasError)();
    await formEcommerceFee.handleSubmit((data, e) => { }, checkHasError)();
    await formPoboFee.handleSubmit((data, e) => { }, checkHasError)();
    await formLogFee.handleSubmit((data, e) => { }, checkHasError)();

    if (hasError) {
      return;
    }

    const dataSubmitFee = formatDataFee(
      {
        ...formEcommerceFee.getValues(),
        ...formPoboFee.getValues(),
      },
      +(merchantId || 0)
    );

    // check fee change to validate
    const arrResult = [...dataSubmitFee].map((fee, index) => {
      const feeTarget = dataMerchantFee.find(
        (dataFee) => fee.paymentMethod === dataFee.paymentMethod
      );

      if (!methodSelected?.startsWith(feeTarget.paymentMethod, 0)) {
        dataSubmitFee.splice(index, index + 1);
        return false;
      }

      return JSON.stringify(fee) !== JSON.stringify(feeTarget);
    });
    const isFeeChange = arrResult.reduce((a, b) => a + +b, 0) !== 0;

    const dataSubmitInfo = _.merge(formInfo.getValues(), formSubInfo.getValues(), {
      businessDetails: {
        merchantContract: formInfo.getValues('businessDetails.merchantContract.url'),
      },
    });

    // const dataSubmitInfoNew = {
    //   ...dataSubmitInfo,
    //   benefitOwner: dataSubmitInfo?.businessOverview?.benefitOwner,
    // };
    // delete dataSubmitInfoNew?.businessOverview?.benefitOwner;
    // console.log('dataSubmitInfoNew', dataSubmitInfoNew);
    const dataFormat = formatPayload(dataSubmitInfo);
    // const dataFormatNew = formatPayload(dataSubmitInfoNew);
    // request update info;
    dispatch(
      requestUpdateInfo(
        {
          id: +(merchantId || 0),
          ...dataFormat,
        },
        (stateUpdateInfo, res) => {
          if (!stateUpdateInfo) {
            errorMessage = res?.message;
          }

          if (!isFeeChange) {
            alert(stateUpdateInfo ? 'success' : 'error', res?.message, t);
            stateUpdateInfo && router.back();
            return;
          }

          dispatch(
            requestUpdateFee(
              {
                data: JSON.stringify(dataSubmitFee),
                logInfo: _.pickBy(formLogFee.getValues()?.logInfo) || {},
              },
              (stateUpdateFee, feeRes) => {
                if (stateUpdateFee) {
                  alert('success', t('Tạo yêu cầu cập nhật merchant thành công'), t);
                  router.back();
                } else {
                  alert('error', errorMessage || feeRes?.message, t);
                }
              }
            )
          );
        }
      )
    );
  };

  const handleCloseMerchant: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const delegateId = +(target.getAttribute('data-index') || 0);

    dispatch(
      updateActiveAccountMerchant(
        {
          merchantId: +(merchantId || 0),
          delegateId,
          isActive: target.checked,
        },
        (state, res) => {
          !state && alert('error', res?.message || res?.data?.message, t);
        }
      )
    );
  };

  const handleCloseModal = (type: string) => {
    return () => {
      switch (type) {
        case 'ADD_DELEGATE':
          setModalState({
            ...modalState,
            modalAddDelegate: false,
          });
          break;
        case 'REJECT_MERCHANT':
          setModalState({
            ...modalState,
            modalRejectMC: false,
          });
          break;
        case 'HISTORY_FEE':
          setModalState({
            ...modalState,
            modalHistoryFee: false,
          });
          break;
        default:
          break;
      }
    };
  };

  const handleSubmitError: SubmitErrorHandler<
    MerchantAccount | FeeMerchantConfig | Pick<MerchantFeeItem, 'logInfo'>
  > = (error) => {
    if (!!Object.keys(error).length) {
      setSubmitAllForm({ index: -1, isAllSubmit: false });
      setIsSubmit(false);
    }
  };

  const handleOpenModal = (type: string) => {
    const result: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      switch (type) {
        case 'ADD_DELEGATE':
          setModalState({
            ...modalState,
            modalAddDelegate: true,
          });
          break;
        case 'REJECT_MERCHANT':
          setModalState({
            ...modalState,
            modalRejectMC: true,
          });
          break;
        case 'HISTORY_FEE':
          setModalState({
            ...modalState,
            modalHistoryFee: true,
          });
          break;

        default:
          break;
      }
    };

    return result;
  };

  const handleUploadImgLogFee: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      formLogFee.clearErrors('logInfo.images');

      const { data: resUpload } = await callUploadAPI(formData);

      if (resUpload.code !== 1000) {
        alert('error', resUpload?.message || 'Error Upload File', t);
        return;
      }
      const imgPathData = resUpload.data.map((infoUpload: { path: string }) => infoUpload.path);
      const currentImg = formLogFee.getValues('logInfo.images');
      formLogFee.setValue('logInfo.images', [...(currentImg || []), ...imgPathData]);
    } catch (error) {
      alert('error', 'Error Upload File', t);
    }
  };

  const handleRemoveImgLogFee: React.MouseEventHandler<HTMLElement> = async (e) => {
    const target = e.target as HTMLElement;

    const index = +(target.getAttribute('data-index') || -1);

    const currentImg = formLogFee.getValues('logInfo.images');

    const popup = await swalCustom.fire({
      icon: 'info',
      title: 'Xác nhận xóa hình ảnh',
    });

    if (!popup.isConfirmed) return;

    currentImg?.splice(index, 1);

    formLogFee.setValue('logInfo.images', currentImg);
  };

  const handleClickImgLogFee: React.MouseEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    const src = target.src.replace('?w=100', '');

    setImgSrc(src);
    viewer.current && viewer.current.show();
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    setLoading(true);

    //check to get default value
    !Object.keys(defaultMerchantFee || {}).length && dispatch(getDefaultMerchantFeeConfig());
    !paymentMethods.length && dispatch(getpaymentMethodList());
    dispatch(getMccCodeListPartial());
    dispatch(getNationalList((status, res) => { }));
    getMerchantProfile('ALL_INFO');

    setTimeout(() => {
      $('.contents').animate({ scrollTop: 0 }, 1000);
    }, 500);

    const imgsPreview = document.querySelector('.merchant-imgs-preview-log-fee') as HTMLElement;

    if (Object.keys(merchantProfile).length) {
      viewer.current = new Viewer(imgsPreview, {
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
  }, []);

  useEffect(() => {
    switch (submitAllForm.index) {
      case 2:
        merchantProfile.paymentMethod && setIsSubmit(true);

        break;
      case 3:
        dispatch(
          approvingMerchant(
            { id: +(merchantId || 0), state: stateMcEnum.APPROVED },
            (state, res) => {
              if (state) {
                alert('success', res.message, t);
                router.back();
              } else {
                alert('error', res.message, t);
              }
              setSubmitAllForm({ index: -1, isAllSubmit: false });
            }
          )
        );
        break;
      default:
        break;
    }
  }, [submitAllForm]);

  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [imgSrc]);
  //#endregion

  return (
    <div className='detail-merchant-container'>
      <div className='header-section-merchant detail-merchant'>
        <BodyMerchantProfile
          profile={merchantProfile}
          collapse={collapseState.sectionInfo}
          formInfo={formInfo}
          formSubInfo={formSubInfo}
          handleSubmitForm={handleSubmitForm}
          handleSubmitError={handleSubmitError}
          onClickImage={handleClickImgLogFee}
          submitForm={submitAllForm}
          loading={loading}
        />
      </div>

      <div>
        <div className='header-section-merchant fee-config-merchant block-section-body'>
          <HeaderMerchantContainer
            title={'Cấu hình phí'}
            onClickHeader={() => {
              setCollapseState({
                ...collapseState,
                sectionFeeConfig: !collapseState.sectionFeeConfig,
              });
            }}
          />

          <FeeConfigMerchantProfile
            onUploadImage={handleUploadImgLogFee}
            onClickImage={handleClickImgLogFee}
            onRemoveImage={handleRemoveImgLogFee}
            onSubmitForm={handleSubmitFormConfigFee}
            onSubmitError={handleSubmitError}
            onClickHistoryFee={handleOpenModal('HISTORY_FEE')}
            profile={merchantProfile}
            collapse={collapseState.sectionFeeConfig}
            loading={loading}
            isSubmit={isSubmit}
            isApproveFeeConfig={isApproveFeeConfig}
            setIsSubmit={setIsSubmit}
            formPoboFee={formPoboFee}
            formEcommerceFee={formEcommerceFee}
            formLogFee={formLogFee}
          />
          <img
            src={imgSrc}
            className='merchant-imgs-preview-log-fee'
            style={{ visibility: 'hidden', height: '0' }}
          />
        </div>
      </div>

      {merchantProfile.state !== 'APPROVED' && (
        <div className='btn-control-mc btn-group'>
          <button
            className='btn btn-primary'
            onClick={() => {
              handleSubmitAllForm();
              setIsApproveFeeConfig(!isApproveFeeConfig);
            }}>
            <i className='fas fa-user-check'></i>
            {t('Approval')}
          </button>
          <button className='btn btn-danger' onClick={handleOpenModal('REJECT_MERCHANT')}>
            <i className='fas fa-user-times'></i>
            {t('Reject')}
          </button>
        </div>
      )}

      {merchantProfile.state === 'APPROVED' && (
        <div className='header-section-merchant table-employee block-section-body'>
          <HeaderMerchantContainer
            title={'Danh sách nhân viên'}
            onClickHeader={() => {
              setCollapseState({
                ...collapseState,
                sectionEmployee: !collapseState.sectionEmployee,
              });
            }}
            rightControlElement={
              <button className='btn btn-add btn-primary' onClick={handleOpenModal('ADD_DELEGATE')}>
                <i className='fas fa-plus'></i>
                {t('Thêm nhân viên')}
              </button>
            }
          />

          <DataTableEmployee
            data={merchantProfile?.delegate || []}
            t={t}
            collapse={collapseState.sectionEmployee}
            onCloseMerchant={handleCloseMerchant}
            {...{ isLoading: loading }}
          />
        </div>
      )}

      {merchantProfile?.state === 'APPROVED' && !router?.query?.expertise && (
        <button
          className='btn btn-primary btn-request-change'
          onClick={() => {
            handleRequestChangeInfo();
            setIsApproveFeeConfig(!isApproveFeeConfig);
          }}>
          <i className='fas fa-paper-plane'></i>
          {t('Gửi duyệt')}
        </button>
      )}

      {merchantProfile?.state === 'APPROVED' && router?.query?.expertise && (
        <button className='btn btn-primary btn-request-change' onClick={() => { }}>
          <i className='fas fa-paper-plane'></i>
          {t('Thẩm định')}
        </button>
      )}

      <ModalCreateDelegateAccount
        show={modalState.modalAddDelegate}
        onHide={handleCloseModal('ADD_DELEGATE')}
        merchantId={+(merchantId || 0)}
      />
      <ModalRejectMerchant
        merchantId={+(merchantId || 0)}
        show={modalState.modalRejectMC}
        onHide={(type) => {
          handleCloseModal('REJECT_MERCHANT')();
          type === 'RESET_FORM' && router.back();
        }}
      />

      <ChangeOfFeeConfigurationModal
        merchantId={merchantProfile.merchantId!}
        show={modalState.modalHistoryFee}
        onHide={() => {
          handleCloseModal('HISTORY_FEE')();
        }}
      />
    </div>
  );
}

export default DetailMerchant;
