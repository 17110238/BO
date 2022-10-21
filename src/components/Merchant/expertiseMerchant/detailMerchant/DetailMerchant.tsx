import { yupResolver } from '@hookform/resolvers/yup';
import callUploadAPI from 'api/UploadFiles';
import ModalCreateDelegateAccount from 'components/common/ModalAccountMc/ModalCreateDelegateAccount';
import { ChangeOfFeeConfigurationModal } from 'components/Merchant/approvalMerchant/modal/ChangeOfFeeConfiguration';
import dayjs from 'dayjs';
import $ from 'jquery';
import _ from 'lodash';
import {
  DefaultFeeMerchantConfig,
  FeeMerchantConfig,
  MerchantAccount,
  MerchantFeeItem,
  MerchantFeeItemType,
  OperatorType,
  PaymentMethod,
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
  getpaymentMethodList,
  TypeConfigFeeMcEnum,
  updateActiveAccountMerchant,
  updateConfigFeeMerchant,
  updateInfoMerchant,
  requestUpdateInfo,
  requestUpdateFee,
} from 'redux/actions';
import { swalCustom } from 'utils/helpers';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import * as yup from 'yup';
import DataTableEmployee from './DataTableMerchantEmployee';
import HeaderMerchantContainer from './HeaderDetailMerchant';
import defaultMethod from './utils/constDefaultMethod';
import { formatDataFee, formatValueDefaultOnData } from './utils/formatDataFee';
enum appraisalStateEnum {
  NEW = 'NEW',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

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

// const schema = yup.object({
//   logInfo: yup.object({
//     description: yup.string().required(),
//     images: yup.array().required().min(1, 'Cần tối thiểu 1 hình ảnh'),
//   }),
// });

function DetailMerchant({ merchantId }: Props) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();
  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  );
  const defaultMerchantFee = useSelector<any, DefaultFeeMerchantConfig>(
    (state) => state?.utility?.defaultMerchantFee
  );
  const merchantFee = useSelector<any, FeeMerchantConfig>((state) => state?.merchantRD.merchantFee);

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

  const viewer = useRef<any>();

  const merchantProfile = useSelector<any, MerchantAccount>(
    (state) => state.merchantRD.merchantProfile
  );

  const tablePaymentPosition = paymentMethods
    .filter((ele) => ele.paymentType !== 'FOLDER')
    .map((ele) => ele.id);
  const methodFolder = paymentMethods
    .filter((ele) => ele.paymentType === 'FOLDER')
    .map((ele) => ele.id);

  const [loading, setLoading] = useState<boolean>(false);

  const convertToDateString = (date?: string) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : undefined;
  };

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
    // resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

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
            ...JSON.parse(extraData),
          },
        };

        return result;
      }),
    ];
  };

  const formatPayload = (data: MerchantAccount) => {
    const { wards, district, province, ...dataMerchant } = data as any;

    //format address
    dataMerchant!.businessOverview!.locationIdentifyCode = wards?.identifyCode;
    dataMerchant!.businessOverview!.wards = wards?.title?.trim();
    dataMerchant!.businessOverview!.district = district?.title?.trim();
    dataMerchant!.businessOverview!.province = province?.title?.trim();

    if (dataMerchant.paymentMethodExtend) {
      !dataMerchant.paymentMethodExtend.length && delete dataMerchant.paymentMethodExtend;

      // merchantProfile?.accountInfo?.username === dataMerchant.contactInfo?.email &&
      //   delete dataMerchant.contactInfo?.email;
      // merchantProfile?.accountInfo?.username === dataMerchant.contactInfo?.phone &&
      //   delete dataMerchant.contactInfo?.phone;
    }

    delete dataMerchant.state;

    return dataMerchant;
  };

  const handleSubmitForm = (data: MerchantAccount, type: string) => {
    setLoading(false);
    dispatch(
      updateInfoMerchant(
        {
          id: +(merchantId || 0),
          ...data,
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
    ['ALL_INFO', 'SUBMIT_INFO'].includes(type) &&
      (() => {
        formInfo.setValue('contactInfo', {
          ..._.pick(data?.contactInfo, [
            'name',
            'identifyNumber',
            'issuePlace',
            'position',
            'phone',
            'email',
          ]),
          issueDate: convertToDateString(data?.contactInfo?.issueDate),
          birthday: convertToDateString(data?.contactInfo?.birthday),
        });
        formInfo.setValue(
          'businessOverview',
          _.pick(data?.businessOverview, [
            'abbreviationName',
            'address',
            'category',
            'categoryName',
            'description',
            'homeUrl',
            'maxAmountTransaction',
            'maxRange',
            'taxCode',
            'type',
          ])
        );
        formInfo.setValue(
          'businessOverview.brandName',
          data?.businessOverview?.brandName?.toUpperCase()
        );
        formInfo.setValue('minBalance', data?.minBalance);
        formInfo.setValue('operator', data?.operator as OperatorType[]);
        formInfo.setValue('emailBcc', data?.emailBcc);
      })();

    ['ALL_INFO', 'SUBMIT_SUBINFO'].includes(type) &&
      (() => {
        formSubInfo.setValue('authType', data?.authType);
        formSubInfo.setValue('withdrawVerifyType', data?.withdrawVerifyType);
        formSubInfo.setValue('crossCheckInfo', {
          crossCheckNum: data?.crossCheckInfo?.crossCheckNum || 0,
          type: data?.crossCheckInfo?.type || undefined,
        });
        formSubInfo.setValue('notifyTelegram', data?.notifyTelegram);
        formSubInfo.setValue('currency', data?.currency);
        formSubInfo.setValue('isSecurityPayout', data?.isSecurityPayout);
        formSubInfo.setValue(
          'businessOverview.connectionType',
          data?.businessOverview?.connectionType
        );
        formSubInfo.setValue('connectionTypeList', data?.connectionTypeList);
        formSubInfo.setValue(
          'paymentMethod',
          data?.paymentMethod?.filter((ele) => !methodFolder.includes(+(ele?.referId || 0)))
        );
        formSubInfo.setValue('paymentMethodExtend', formatMethodDataExtend(data));
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
        if (res.data[0]?.appraisalState === 'APPROVED') {
          alert('error', 'Merchant đã được thẩm định');
          router.push('/cong-thanh-toan/tham-dinh');
          return;
        }

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

    const checkHasError = (error: any) => {
      if (!hasError && !!Object.keys(error).length) {
        hasError = true;
      }
    };

    // check fee change to validate
    // const dataMerchantFee = formatDataFee(
    //   {
    //     ecommerceFeeList: formatValueDefaultOnData(merchantFee, 'ecommerceFeeList'),
    //     poboFeeList: formatValueDefaultOnData(merchantFee, 'poboFeeList'),
    //   },
    //   +(merchantId || 0)
    // );

    const dataSubmitFee = formatDataFee(
      {
        ...formEcommerceFee.getValues(),
        ...formPoboFee.getValues(),
      },
      +(merchantId || 0)
    );

    // check fee change to validate
    // const arrResult = [...dataSubmitFee].map((fee) => {
    //   const feeTarget = dataMerchantFee.find(
    //     (dataFee) => fee.paymentMethod === dataFee.paymentMethod
    //   );
    //   return JSON.stringify(fee) !== JSON.stringify(feeTarget);
    // });
    // const isFeeChange = arrResult.reduce((a, b) => a + +b, 0) !== 0;

    formLogFee.clearErrors('logInfo');
    await formInfo.handleSubmit((data, e) => {}, checkHasError)();
    await formSubInfo.handleSubmit((data, e) => {}, checkHasError)();
    await formEcommerceFee.handleSubmit((data, e) => {}, checkHasError)();
    await formPoboFee.handleSubmit((data, e) => {}, checkHasError)();
    await formLogFee.handleSubmit((data, e) => {
      // check fee change to validate
      // if (isFeeChange) {
      //   !formLogFee.getValues('logInfo.description') &&
      //     formLogFee.setError('logInfo.description', { type: 'required', message: '' });
      //   // !formLogFee.getValues('logInfo.images')?.length &&
      //   //   formLogFee.setError('logInfo.images', { type: 'required', message: '' });
      //   checkHasError(formLogFee.formState.errors);
      //   return;
      // }
    }, checkHasError)();

    if (hasError) {
      return;
    }

    const dataSubmitInfo = _.merge({
      businessOverview: {
        description: formInfo.getValues()?.businessOverview?.description,
        // ...formSubInfo.getValues().businessOverview,
      },
      businessDetails: {
        ...formInfo.getValues('businessDetails'),
        merchantContract: formInfo.getValues('businessDetails.merchantContract.url'),
      },
    });

    const dataFormat = formatPayload(dataSubmitInfo);

    // request update info;
    dispatch(
      approvingMerchant(
        {
          id: +(merchantId || 0),
          appraisalState: appraisalStateEnum.APPROVED,
          ...dataFormat,
        },
        (stateUpdateInfo, res) => {
          if (stateUpdateInfo) {
            alert('success', t('Thẩm định thành công'), t);
            router.push('/cong-thanh-toan/quan-ly-mc');
            // dispatch(
            //   requestUpdateFee(
            //     {
            //       data: JSON.stringify(dataSubmitFee),
            //       logInfo: formLogFee.getValues()?.logInfo || {},
            //     },
            //     (stateUpdateFee, res) => {
            //       if (stateUpdateFee) {
            //         alert('success', t('Thẩm định thành công'), t);
            //         router.push('/cong-thanh-toan/quan-ly-mc');
            //       } else {
            //         alert('error', res.message, t);
            //       }
            //     }
            //   )
            // );
          } else {
            alert('error', res.message, t);
          }
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

  useEffect(() => {
    setLoading(true);

    //check to get default value
    !Object.keys(defaultMerchantFee || {}).length && dispatch(getDefaultMerchantFeeConfig());
    !paymentMethods.length && dispatch(getpaymentMethodList());
    dispatch(getMccCodeListPartial());

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
        // !merchantProfile?.paymentMethod?.length &&
        //   setSubmitAllForm({
        //     ...submitAllForm,
        //     index: submitAllForm.index + 1,
        //   });
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

  return (
    <div className='detail-merchant-container detail-expertise-merchant'>
      <div className='header-section-merchant detail-merchant'>
        <BodyMerchantProfile
          profile={merchantProfile}
          collapse={collapseState.sectionInfo}
          formInfo={formInfo}
          formSubInfo={formSubInfo}
          handleSubmitForm={handleSubmitForm}
          handleSubmitError={handleSubmitError}
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
          {t('Thẩm định')}
        </button>
      )}

      {/* {merchantProfile?.state === 'APPROVED' && router?.query?.expertise && (
        <button className='btn btn-primary btn-request-change' onClick={() => {}}>
          <i className='fas fa-paper-plane'></i>
          {t('Thẩm định')}
        </button>
      )} */}

      {/* <div className='header-section-merchant table-store'>
        <HeaderMerchantContainer
          title={'Danh sách cửa hàng'}
          onClickHeader={() => {
            setCollapseState({
              ...collapseState,
              sectionStore: !collapseState.sectionStore,
            });
          }}
          rightControlElement={
            <button className='btn btn-add btn-primary'>
              <i className='fas fa-plus'></i>
              {t('Thêm cửa hàng')}
            </button>
          }
        />
        <DataTableStore
          data={merchantProfile?.stores || []}
          t={t}
          collapse={collapseState.sectionStore}
        />
      </div> */}

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
