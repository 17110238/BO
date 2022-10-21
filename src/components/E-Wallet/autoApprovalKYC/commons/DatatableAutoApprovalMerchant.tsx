// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { AddressWalletKYC, stateWalletKYCEnum, WalletKYC } from 'models';
import Link from 'next/link';
import React, { memo, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { swalVideoCustom } from 'utils/helpers';
import Viewer from 'viewerjs';
interface Props {
  data: WalletKYC[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onClickUpdate: (id: WalletKYC, type?: string) => React.MouseEventHandler<HTMLDivElement>;
  onClickReject: (id: WalletKYC, type?: string) => React.MouseEventHandler<HTMLDivElement>;
  onClickAcceptApproved: (id: WalletKYC, type?: string) => React.MouseEventHandler<HTMLDivElement>;
  onClickHistoryKYC: (id: WalletKYC, type?: string) => React.MouseEventHandler<HTMLDivElement>;
}

const DatatableApprovalMerchant: React.FC<Props> = ({
  data,
  getDataList,
  onClickUpdate,
  onClickReject,
  onClickHistoryKYC,
  onClickAcceptApproved,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [imgSrc, setImgSrc] = useState('');
  const viewer = useRef<any>();
  const loading = useSelector<any, boolean>((state) => state?.merchantRD?.loading);

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
  }, [imgSrc]);

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, img?: string) => {
    const target = e.currentTarget as HTMLDivElement;
    const index = target.getAttribute('data-index');
    if (index !== null && img) {
      setImgSrc(img);
      viewer.current && viewer.current.show();
    }
  };

  const generateStateMC = (state?: stateWalletKYCEnum) => {
    if (!state) return '';

    switch (state) {
      case stateWalletKYCEnum.PENDING:
      case stateWalletKYCEnum.FILLING:
      case stateWalletKYCEnum.AUTO_APPROVED:
        return 'state-refunded';
      case stateWalletKYCEnum.FAIL_FILLED:
      case stateWalletKYCEnum.MANUAL_REJECTED:
      case stateWalletKYCEnum.REJECTED:
        return 'state-cancel';
      case stateWalletKYCEnum.APPROVED:
      case stateWalletKYCEnum.MANUAL_APPROVED:
        return 'state-success';
      default:
        break;
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const renderImageSrc = (src?: string, type?: string) => {
    const valid = new RegExp(/^(https)+/g);
    let subParams = '';
    switch (type) {
      case 'VIDEO':
        subParams = '?t=5';
        break;
      case 'EMPTY':
        subParams = '';
        break;

      default:
        subParams = '?w=100';
        break;
    }
    if (!src) return '/assets/images/img-na.png';

    if (valid.test(src)) return src + subParams;

    return process.env.NEXT_PUBLIC_API_UPLOAD + src + subParams;
  };

  const columns: TableColumn<WalletKYC>[] = useMemo(
    () => [
      {
        name: t('Mã định danh'),
        minWidth: '130px',
        cell: (row) => {
          return (
            <div className='highlight-text' onClick={onClickUpdate(row, 'MODAL_UPDATE')}>
              {row?.id || '-'}
            </div>
          );
        },
      },

      {
        name: t('Mã người dùng'),
        minWidth: '130px',
        cell: (row) => {
          return <div>{row?.accountId || '-'}</div>;
        },
      },
      {
        name: t('Số điện thoại'),
        minWidth: '160px',
        cell: (row) => {
          return row?.phone ? (
            <Link
              href={`/vi-dien-tu/thong-tin-khach-hang?searchValue=${row?.phone}&searchType=PHONE`}
              passHref>
              <a>{row?.phone}</a>
            </Link>
          ) : (
            '-'
          );
        },
      },
      {
        name: t('Ứng dụng'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{row?.appName || '-'}</div>;
        },
      },

      {
        name: t('Họ tên'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.fullname || '-'}</div>;
        },
      },
      {
        name: t('Ngày sinh'),
        minWidth: '130px',
        cell: (row) => {
          return <div>{row?.birthday ? dayjs(row?.birthday).format('DD/MM/YYYY') : '-'}</div>;
        },
      },
      {
        name: t('Giới tính'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.gender ? t(`GENDER_${row?.gender?.toUpperCase()}` || '-') : '-'}</div>;
        },
      },
      {
        name: t('Địa chỉ'),
        minWidth: '300px',
        cell: (row) => {
          return <div>{row?.addressString || '-'}</div>;
        },
      },
      {
        name: t('CMND/Hộ chiếu'),
        minWidth: '150px',
        cell: (row) => {
          return (
            <div>
              <p className='font-weight-bold'>{row?.identifyNumber || '-'}</p>
              <p className='py-1'>
                {row?.issuedAt ? dayjs(row?.issuedAt).format('DD/MM/YYYY') : '-'}
              </p>
              <p>{row?.placeOfIssue || '-'}</p>
            </div>
          );
        },
      },

      {
        name: t('TG định danh'),
        minWidth: '130px',
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('TG cập nhật'),
        minWidth: '100px',
        cell: (row) => {
          return (
            <div>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('TG đăng ký'),
        minWidth: '100px',
        cell: (row) => {
          return (
            <div>
              {row?.registeredAt ? dayjs(row?.registeredAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
            </div>
          );
        },
      },
      {
        name: t('TG duyệt'),
        minWidth: '100px',
        cell: (row) => {
          return (
            <div>
              {row?.approvedAt ? dayjs(row?.approvedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
            </div>
          );
        },
      },

      {
        name: t('Ảnh định danh'),
        minWidth: '240px',
        cell: (row) => {
          // const hasImgIC =
          //   ['APPROVED', 'PENDING'].includes(row?.identifyIC?.state || '') &&
          //   row?.state === 'APPROVED';

          // const back = hasImgIC ? row?.identifyIC?.back : row?.image?.back;
          // const front = hasImgIC ? row?.identifyIC?.front : row?.image?.front;
          // const state = hasImgIC ? row?.identifyIC?.state : row?.image?.state;

          return row?.image ? (
            <div
              className={`d-flex row-identify-images identify-${row?.image?.state?.toLowerCase()}`}>
              <div
                data-index={0}
                onClick={(e) => handlePreviewImg(e, renderImageSrc(row?.image?.front, 'EMPTY'))}
                className='row-img-preview'>
                <img
                  src={renderImageSrc(row?.image?.front)}
                  data-src={renderImageSrc(row?.image?.front)}
                  onError={handleErrorImage}
                />
              </div>
              <div
                data-index={1}
                onClick={(e) => handlePreviewImg(e, renderImageSrc(row?.image?.back, 'EMPTY'))}
                className='row-img-preview'>
                <img
                  src={renderImageSrc(row?.image?.back)}
                  data-src={renderImageSrc(row?.image?.back)}
                  onError={handleErrorImage}
                />
              </div>
            </div>
          ) : (
            <></>
          );
        },
      },
      {
        name: t('Video'),
        minWidth: '120px',
        cell: (row) => {
          return row?.video ? (
            <div
              className={`d-flex row-identify-images identify-${row?.video?.state?.toLowerCase()}`}>
              <a
                className='row-img-preview'
                onClick={async (e) => {
                  swalVideoCustom(renderImageSrc(row?.video?.video, 'EMPTY'));
                }}>
                <video src={renderImageSrc(row?.video?.video, 'VIDEO')} />
              </a>
            </div>
          ) : (
            <></>
          );
        },
      },
      {
        name: t('Ảnh khuôn mặt'),
        minWidth: '120px',
        cell: (row) => {
          return row?.face ? (
            <div
              className={`d-flex row-identify-images identify-${row?.face?.state?.toLowerCase()}`}>
              <div
                data-index={0}
                onClick={(e) => handlePreviewImg(e, renderImageSrc(row?.face?.face, 'EMPTY'))}
                className='row-img-preview'>
                <img
                  src={renderImageSrc(row?.face?.face)}
                  data-src={renderImageSrc(row?.face?.face)}
                  onError={handleErrorImage}
                />
              </div>
            </div>
          ) : (
            <></>
          );
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '175px',
        cell: (row) => {
          return <div className={generateStateMC(row?.state)}>{t(`MC_${row?.state}`)}</div>;
        },
      },
      {
        name: t('Hình thức duyệt'),
        minWidth: '175px',
        cell: (row) => {
          return row?.kycAutoState ? (
            <div className={generateStateMC(row?.kycAutoState as stateWalletKYCEnum)}>
              {t(`MC_${row?.kycAutoState}`)}
            </div>
          ) : (
            '-'
          );
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '80px',
        cell: (row) => {
          return (
            <Dropdown className='merchant-approval-manage-table-dropdown'>
              <Dropdown.Toggle
                className='p-0 w-100'
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)',
                }}
                id='dropdown-menu-align-end'>
                <div className='d-flex justify-content-center w-100'>
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item onClick={onClickUpdate(row, 'MODAL_UPDATE')}>
                  <i className='fas fa-edit fa-lg mr-2' />
                  {t('Cập nhật')}
                </Dropdown.Item>
                {row?.state !== 'REJECTED' && (
                  <Dropdown.Item onClick={onClickReject(row, 'MODAL_REJECT')}>
                    <i className='fas fa-minus-circle fa-lg mr-2' />
                    {t('Từ chối')} KYC
                  </Dropdown.Item>
                )}
                {row?.kycAutoState && !['FAIL_FILLED','FILLING', 'MANUAL_APPROVED'].includes(row?.kycAutoState) && (
                  <Dropdown.Item onClick={onClickAcceptApproved(row)}>
                    <i className='fas fa-check-double fa-lg mr-2' />
                    {t('Đã kiểm duyệt')}
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  data-index={row?.id}
                  onClick={onClickHistoryKYC(row, 'MODAL_HISTORY')}>
                  <i className='fas fa-history fa-lg mr-2' />
                  {t('Lịch sử')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],

    [lang]
  );

  return (
    <div>
      <img src={imgSrc} className='preview-identity-img' onError={handleErrorImage} />
      <DataTableCustom
        dataList={data}
        columns={columns}
        t={t}
        isLoading={loading}
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table'
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
    </div>
  );
};

export default memo(DatatableApprovalMerchant);
