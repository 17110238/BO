import React, { useState, useEffect, useRef, MouseEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import ModalStoreHistory from '../Modals/ModalStoreHistory';
import Viewer from 'viewerjs';
import { useRouter } from 'next/router';
import {
  AlipayStoreTypes,
  FilterSearchParams,
  InputAlipayStore,
  LocationSearchPayload,
  LocationType,
  MccCodeListType,
  MerchantAccount,
  PayloadFilterMccCodeType,
  SearchStoreInput,
  StoreMerchant,
  StoreState,
} from 'models';
import {
  approvalAlipayStore,
  checkStatusAlipayStore,
  getBussinessDetail,
  getInfoMerchant,
  getListStore,
  getMccCodeList,
  getSubLocationList,
} from 'redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import alert from 'utils/helpers/alert';
import dayjs from 'dayjs';
import ModalStatusAlipay from '../Modals/ModalStatusAlipay';

interface Collapse {
  collapseItem1: boolean;
  collapseItem2: boolean;
  collapseItem3: boolean;
  collapseItem4: boolean;
}

interface indentifyLocation {
  identifyCode?: string;
  path?: string;
  title?: string;
}

interface AlipayStatus {
  data: AlipayStoreTypes;
  isShowModal?: boolean;
}

export default function StoreDetailsContainer() {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector<any, StoreState>((state) => state?.storeReducer.loading);
  const [collapse, setCollapse] = useState<Collapse>({
    collapseItem1: true,
    collapseItem2: true,
    collapseItem3: true,
    collapseItem4: true,
  });
  const [visiableAction, setVisiableAction] = useState<boolean>(false);
  const [isShowModal, setShowModal] = useState<boolean>(false);
  const [urlImage, setUrlImage] = useState<string>('');
  const [dataStore, setDataStore] = useState<StoreMerchant>();
  const infoMerchant = useSelector<any, MerchantAccount>(
    (state) => state.merchantRD.merchantProfile
  );
  const [category, setCategory] = useState<MccCodeListType>();
  const [locationIndentify, setLocationIndentify] = useState<LocationType>();
  const [dataAlipay, setDataAlipay] = useState<AlipayStatus>({
    data: {},
    isShowModal: false,
  });
  const [loadingAlipay, setLoadingAlipay] = useState<boolean>(false);
  const menuDropDown = useRef<HTMLButtonElement>(null);
  const viewer = useRef<any>();
  const handleShowModal = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };
  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, url: string) => {
    setUrlImage(url);
    viewer.current && viewer.current.show();
  };
  const handleConvertType = (data?: any) => {
    const replaceFile = data?.url?.split('.')[1];
    switch (replaceFile) {
      case 'pdf':
        return (
          <div className='storeDetail-image__preview'>
            <a target={'_blank'} href={process.env.NEXT_PUBLIC_API_UPLOAD + data?.url}>
              <img style={{ objectFit: 'contain' }} src={'/assets/img/pdf-icon.png'} alt='' />
            </a>
          </div>
        );
      default:
        return (
          <div
            className='storeDetail-image__preview'
            onClick={(e) => handlePreviewImg(e, process.env.NEXT_PUBLIC_API_UPLOAD + data?.url)}>
            <img
              style={{ objectFit: 'contain' }}
              src={process.env.NEXT_PUBLIC_API_UPLOAD + data?.url}
              alt=''
            />
          </div>
        );
    }
  };
  const handleConvertAddress = (arr: Array<indentifyLocation>): string => {
    const tempArray = [...arr].reverse();
    return tempArray.reduce((temp: string, item: indentifyLocation, index: number): any => {
      if (item.title !== 'root') {
        temp += tempArray.length > 2 ? `${index > 0 ? ',' : ''} ${item.title}` : `${item.title}`;
      }
      return temp;
    }, '');
  };
  const handleAlipayStore = (methodId: number, isStatus: boolean) => {
    setLoadingAlipay(true);
    const payload: InputAlipayStore = {
      storeId: parseInt(dataStore?.storeId.toString()!),
      methodId,
    };
    if (isStatus) {
      dispatch(
        approvalAlipayStore(payload, (stateApproval, resApproval) => {
          if (stateApproval) {
            const payload: SearchStoreInput = {
              filter: {
                storeId: parseInt(dataStore?.storeId.toString()!),
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
                  setDataStore(res.data[0]);
                }
              })
            );
            alert('success', resApproval.message, t);
          } else {
            alert('error', resApproval.message, t);
          }
          setLoadingAlipay(false);
        })
      );
    } else {
      dispatch(
        checkStatusAlipayStore(payload, (stateCheck, resCheck) => {
          if (stateCheck && resCheck?.succeeded) {
            setDataAlipay({
              data: resCheck?.data || {},
              isShowModal: true,
            });
          } else {
            alert('error', resCheck.message, t);
          }
          setLoadingAlipay(false);
        })
      );
    }
  };
  const renderButtonAlipay = (paymentItem: any) => {
    if (paymentItem?.state === 'NEW' || !paymentItem?.state) {
      return (
        <button
          className='storeDetail-btn__approval'
          onClick={() => handleAlipayStore(paymentItem?.paymentMethodId, true)}>
          {t('G???i duy???t')}
        </button>
      );
    } else if (paymentItem?.state === 'APPROVING' || paymentItem?.state === 'APPROVED') {
      return (
        <button
          className='storeDetail-btn__approval'
          onClick={() => handleAlipayStore(paymentItem?.paymentMethodId, false)}>
          {t('Ki???m tra')}
        </button>
      );
    } else if (paymentItem?.state === 'REJECTED') {
      return (
        <>
          <button
            className='storeDetail-btn__approval'
            style={{ marginRight: '10px' }}
            onClick={() => handleAlipayStore(paymentItem?.paymentMethodId, false)}>
            {t('Ki???m tra')}
          </button>
          <button
            className='storeDetail-btn__approval'
            onClick={() => handleAlipayStore(paymentItem?.paymentMethodId, true)}>
            {t('G???i duy???t')}
          </button>
        </>
      );
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (menuDropDown.current && e.target && !menuDropDown.current.contains(e.target as Node)) {
        setVisiableAction(false);
      }
    });
    return () => {
      document.removeEventListener('mousedown', (e) => {});
    };
  }, []);
  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      title: false,
      button: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
    return () => {
      viewer.current && viewer.current.hide();
    };
  }, []);
  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [urlImage]);
  useEffect(() => {
    if (router.query?.id) {
      const payload: SearchStoreInput = {
        filter: {
          storeId: parseInt(router.query?.id.toString()),
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
            const payloadSearchMerchant: FilterSearchParams = {
              filter: {
                merchantId: res.data[0].merchantId,
              },
              paging: {
                start: 0,
                limit: 20,
              },
              sort: {
                createdAt: 1,
              },
            };

            dispatch(getInfoMerchant(payloadSearchMerchant, (status, data) => {}));
            dispatch(getBussinessDetail(payloadSearchMerchant, (status, data) => {}));
            setDataStore(res.data[0]);
          }
        })
      );
    }
  }, [router.query?.id]);
  useEffect(() => {
    const indentifyPayload: LocationSearchPayload = {
      identifyCode: infoMerchant?.businessOverview?.locationIdentifyCode,
    };
    const mccPayload: PayloadFilterMccCodeType = {
      filter: {},
      paging: {
        start: 0,
        limit: 999,
      },
      sort: {
        createdAt: 1,
      },
    };
    dispatch(
      getMccCodeList(mccPayload, (status, category) => {
        if (status) {
          const obj = category.data.find(
            (item: MccCodeListType) => item.code === infoMerchant.businessOverview?.category
          );
          setCategory(obj);
        }
      })
    );
    dispatch(
      getSubLocationList(indentifyPayload, (stateIndentify, dataLocationIndentify) => {
        if (stateIndentify) {
          setLocationIndentify(dataLocationIndentify.data[0]);
        }
      })
    );
  }, [infoMerchant]);
  return (
    <Fragment>
      {loading || (loadingAlipay && <LoadingFullScreen />)}
      <img
        src={urlImage}
        className='preview-identity-img'
        onError={handleErrorImage}
        style={{ display: 'none' }}
      />
      {!loading && (
        <div className='storeDetail-container'>
          <div className='storeDetail-header'>
            <div className='btn-back'>
              <button onClick={() => router.push('/cong-thanh-toan/quan-ly-cua-hang')}>
                <i className='fas fa-arrow-left btn-back__icon'></i>
                Tr??? v???
              </button>
            </div>
            <div className='btn-action'>
              <button onClick={() => setVisiableAction(!visiableAction)} ref={menuDropDown}>
                <i className='fa fa-th-large' aria-hidden='true'></i>
              </button>
              <ul className={`list-action ${visiableAction && 'list-action__visiable'}`}>
                <li
                  onClick={(e) => {
                    router.push(`/cong-thanh-toan/quan-ly-cua-hang/cap-nhat/${router.query.id}`);
                  }}>
                  <a onClick={(e) => e.preventDefault()}>{t('C???p nh???t')}</a>
                </li>
                <li>
                  <a href='' onClick={handleShowModal}>
                    {t('L???ch s??? thay ?????i')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='storeDetail-content'>
            <div className='storeDetail-list__collapse'>
              <div
                className='storeDetail-collapse'
                style={
                  collapse.collapseItem1
                    ? {}
                    : {
                        backgroundColor: 'transparent',
                        borderRadius: '12px 12px 0 0',
                        boxShadow: 'none',
                      }
                }>
                <div
                  className='storeDetail-collapse__header'
                  style={
                    collapse.collapseItem1 ? {} : { marginBottom: '0px', borderRadius: '12px' }
                  }>
                  <h3>{t('Th??ng tin ??i???m GD')}</h3>
                  <button
                    onClick={() =>
                      setCollapse({ ...collapse, collapseItem1: !collapse.collapseItem1 })
                    }>
                    {collapse.collapseItem1 ? (
                      <i className='fa fa-minus'></i>
                    ) : (
                      <i className='fa fa-plus'></i>
                    )}
                  </button>
                </div>
                <div
                  className='storeDetail-list'
                  style={collapse.collapseItem1 ? {} : { display: 'none' }}>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('Store ID')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dataStore?.storeId}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('T??n C???a H??ng')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dataStore?.storeName}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('T??n ????ng Nh???p')}</h4>
                    </div>
                    {/* <div className='storeDetail-text'>
                      <span>{dataStore?.username}</span>
                    </div> */}
                    {/* UP SANBOX, chua co api */}
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('M?? T???')}</h4>
                    </div>
                    {/* <div className='storeDetail-text'>
                      <span>{dataStore?.description}</span>
                    </div> */}
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('?????a Ch???')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dataStore?.address}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('H??nh ???nh')}</h4>
                    </div>
                    {dataStore?.storeImage && (
                      <div
                        className='storeDetail-text image'
                        onClick={(e) =>
                          handlePreviewImg(
                            e,
                            'https://sbx-static.payme.vn/2022/03/23/FxImAy2HG.jpg'
                          )
                        }>
                        <div className='storeDetail-image__preview'>
                          <img src='https://sbx-static.payme.vn/2022/03/23/FxImAy2HG.jpg' alt='' />
                        </div>
                      </div>
                    )}
                    <span>[Ch??a c???p nh???t]</span>
                  </div>
                </div>
              </div>
              <div
                className='storeDetail-collapse'
                style={
                  collapse.collapseItem3
                    ? {}
                    : {
                        backgroundColor: 'transparent',
                        borderRadius: '12px 12px 0 0',
                        boxShadow: 'none',
                      }
                }>
                <div
                  className='storeDetail-collapse__header'
                  style={
                    collapse.collapseItem3 ? {} : { marginBottom: '0px', borderRadius: '12px' }
                  }>
                  <h3>{t('Th??ng tin Doanh Nghi???p')}</h3>
                  <button
                    onClick={() =>
                      setCollapse({ ...collapse, collapseItem3: !collapse.collapseItem3 })
                    }>
                    {collapse.collapseItem3 ? (
                      <i className='fa fa-minus'></i>
                    ) : (
                      <i className='fa fa-plus'></i>
                    )}
                  </button>
                </div>
                <div
                  className='storeDetail-list'
                  style={collapse.collapseItem3 ? {} : { display: 'none' }}>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('ID')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dataStore?.merchantId}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('T??n Doanh Nghi???p')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dataStore?.merchantName}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('H??nh Th???c KD')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>
                        {infoMerchant.businessOverview?.categoryName
                          ? infoMerchant.businessOverview?.categoryName
                          : '[Ch??a c???p nh???t]'}
                      </span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('Logo')}</h4>
                    </div>
                    <div className='storeDetail-text image'>
                      {infoMerchant?.businessOverview?.logo ? (
                        <div className='storeDetail-image__preview'>
                          <img
                            src={
                              process.env.NEXT_PUBLIC_API_UPLOAD +
                              infoMerchant?.businessOverview?.logo
                            }
                            alt=''
                          />
                        </div>
                      ) : (
                        <span>[Ch??a c???p nh???t]</span>
                      )}
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('MST')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{infoMerchant?.businessOverview?.taxCode}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('L??nh V???c KD (MCC)')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{category?.content}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('M?? T???')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{infoMerchant?.businessOverview?.description}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('?????a Ch???')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>
                        {locationIndentify?.parentPath &&
                          handleConvertAddress(locationIndentify?.parentPath)}
                      </span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('Gi???y CN ??KKD')}</h4>
                    </div>
                    <div className='storeDetail-text image'>
                      {infoMerchant?.businessDetails?.licenseImages ? (
                        infoMerchant?.businessDetails?.licenseImages.map((item, index) => {
                          return (
                            <div
                              key={Math.random()}
                              className='storeDetail-image__preview'
                              onClick={(e) =>
                                handlePreviewImg(e, `${process.env.NEXT_PUBLIC_API_UPLOAD}${item}`)
                              }>
                              <img src={process.env.NEXT_PUBLIC_API_UPLOAD + item} alt='' />
                            </div>
                          );
                        })
                      ) : (
                        <span>[Ch??a c???p nh???t]</span>
                      )}
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('H???p ?????ng')}</h4>
                    </div>
                    <div className='storeDetail-text image'>
                      {infoMerchant?.businessDetails?.merchantContract ? (
                        handleConvertType(infoMerchant?.businessDetails?.merchantContract)
                      ) : (
                        <span>[Ch??a c???p nh???t]</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className='storeDetail-collapse'
                style={
                  collapse.collapseItem3
                    ? {}
                    : {
                        backgroundColor: 'transparent',
                        borderRadius: '12px 12px 0 0',
                        boxShadow: 'none',
                      }
                }>
                <div
                  className='storeDetail-collapse__header'
                  style={
                    collapse.collapseItem3 ? {} : { marginBottom: '0px', borderRadius: '12px' }
                  }>
                  <h3>{t('Th??ng tin meta h??? th???ng')}</h3>
                  <button
                    onClick={() =>
                      setCollapse({ ...collapse, collapseItem3: !collapse.collapseItem3 })
                    }>
                    {collapse.collapseItem3 ? (
                      <i className='fa fa-minus'></i>
                    ) : (
                      <i className='fa fa-plus'></i>
                    )}
                  </button>
                </div>
                <div
                  className='storeDetail-list'
                  style={collapse.collapseItem3 ? {} : { display: 'none' }}>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('Nh??n vi??n kinh doanh')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>
                        {dataStore?.operator?.username ? dataStore?.operator?.username : ''}
                      </span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('Nh??n vi??n duy???t')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('TG t???o')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dayjs(dataStore?.createdAt).format('DD-MM-YYYY HH:m:s')}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('TG duy???t')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dayjs(dataStore?.createdAt).format('DD-MM-YYYY HH:m:s')}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('Tr???ng th??i store')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>{dataStore?.isActive ? 'M???' : '????ng'}</span>
                    </div>
                  </div>
                  <div className='storeDetail-item'>
                    <div className='storeDetail-label'>
                      <h4>{t('Lo???i giao d???ch')}</h4>
                    </div>
                    <div className='storeDetail-text'>
                      <span>
                        {dataStore?.transactionType === 'PAYMENT' ? 'C???ng thanh to??n' : 'Thu h???'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className='storeDetail-collapse'
                style={
                  collapse.collapseItem4
                    ? {}
                    : {
                        backgroundColor: 'transparent',
                        borderRadius: '12px 12px 0 0',
                        boxShadow: 'none',
                      }
                }>
                <div
                  className='storeDetail-collapse__header'
                  style={
                    collapse.collapseItem4 ? {} : { marginBottom: '0px', borderRadius: '12px' }
                  }>
                  <h3>{t('Danh s??ch ph????ng th???c thanh to??n')}</h3>
                  <button
                    onClick={() =>
                      setCollapse({ ...collapse, collapseItem4: !collapse.collapseItem4 })
                    }>
                    {collapse.collapseItem4 ? (
                      <i className='fa fa-minus'></i>
                    ) : (
                      <i className='fa fa-plus'></i>
                    )}
                  </button>
                </div>
                <div
                  className='storeDetail-list'
                  style={collapse.collapseItem4 ? {} : { display: 'none' }}>
                  <table className='storeDetail-collapse__table'>
                    <thead>
                      <tr>
                        <td>{t('Lo???i thanh to??n')}</td>
                        <td>{t('Tr???ng th??i')}</td>
                        <td>{t('Thao t??c')}</td>
                      </tr>
                    </thead>
                    <tbody>
                      {dataStore?.paymentMethod.map((item, index) => {
                        if (item.paymentMethodId) {
                          return (
                            <tr key={Math.random()}>
                              <td>{item.paymentMethodName}</td>
                              <td>{item.state ? item.state : ``}</td>
                              <td>
                                {(item.paymentMethodId == 5 || item.paymentMethodId == 7) &&
                                  renderButtonAlipay(item)}
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='row storeDetail-bot'>
              <div className='col-6 storeDetail-left'></div>
              <div className='col-6 storeDetail-right'></div>
            </div>
          </div>
          {isShowModal && (
            <ModalStoreHistory
              isShow={isShowModal}
              onHide={() => setShowModal(false)}
              totalFilter={5}
            />
          )}
        </div>
      )}
      <ModalStatusAlipay
        isShow={dataAlipay.isShowModal}
        onHide={() => {
          setDataAlipay({ ...dataAlipay, isShowModal: false });
        }}
        data={dataAlipay.data}
      />
    </Fragment>
  );
}
