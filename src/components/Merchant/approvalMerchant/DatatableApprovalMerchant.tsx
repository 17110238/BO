// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { MerchantAccount, OperatorType, stateMcEnum } from 'models';
import Link from 'next/link';
import React, { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Viewer from 'viewerjs';
interface Props {
  data: MerchantAccount[];
  onCloseMerchant: React.ChangeEventHandler<HTMLInputElement>;
  onRejectMerchant: React.MouseEventHandler<HTMLButtonElement>;
  onToggleHistory: React.MouseEventHandler<HTMLButtonElement>;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
}

const DatatableApprovalMerchant: React.FC<Props> = ({
  data,
  onCloseMerchant,
  onRejectMerchant,
  onToggleHistory,
  getDataList,
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

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, row: MerchantAccount) => {
    const target = e.currentTarget as HTMLDivElement;
    const index = target.getAttribute('data-index');
    if (index !== null && row?.businessDetails?.identifyImages) {
      setImgSrc(process.env.NEXT_PUBLIC_API_UPLOAD + row?.businessDetails?.identifyImages[+index]);
      viewer.current && viewer.current.show();
    }
  };

  const generateStateMC = (state?: stateMcEnum) => {
    if (!state) return '';

    switch (state) {
      case stateMcEnum.PENDING:
      case stateMcEnum.APPROVING:
        return 'state-refunded';
      case stateMcEnum.REJECTED:
        return 'state-cancel';
      case stateMcEnum.CONTRACT_SIGNED:
        return 'state-success';
      case stateMcEnum.CONTRACT:
      case stateMcEnum.CONTRACT_APPROVING:
        return 'state-pending';
      default:
        break;
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const columns: TableColumn<MerchantAccount>[] = useMemo(
    () => [
      {
        name: t('Mã đối tác'),
        minWidth: '100px',
        maxWidth: '130px',
        cell: (row) => {
          return (
            <Link href={`/cong-thanh-toan/quan-ly-mc/${row?.merchantId}`}>{row?.merchantId}</Link>
          );
        },
      },

      {
        name: t('Mã tài khoản'),
        minWidth: '110px',
        cell: (row) => {
          return (
            <Link href={`/cong-thanh-toan/tai-khoan?search=${row?.accountInfo?.id}`}>
              {row?.accountInfo?.id}
            </Link>
          );
        },
      },
      {
        name: t('Tên đối tác'),
        minWidth: '160px',
        cell: (row) => {
          return <div>{row?.businessOverview?.abbreviationName}</div>;
        },
      },
      {
        name: t('SDT'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{row?.contactInfo?.phone}</div>;
        },
      },

      {
        name: t('Email'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.contactInfo?.email}</div>;
        },
      },
      {
        name: t('Loại đối tác'),
        minWidth: '130px',
        cell: (row) => {
          return (
            <div style={{ textTransform: 'uppercase' }}>{t(row?.businessOverview?.type || '')}</div>
          );
        },
      },
      {
        name: t('Nhân viên phát triển'),
        minWidth: '180px',
        cell: (row) => {
          return (
            <div>{row?.operator?.length ? (row?.operator[0] as OperatorType).username : '-'}</div>
          );
        },
      },
      {
        name: t('Tên hiển thị khi giao dịch'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.businessOverview?.brandName?.toUpperCase() || '-'}</div>;
        },
      },

      {
        name: t('TG Tạo'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('TG cập nhật'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Trạng Thái'),
        minWidth: '200px',
        cell: (row) => {
          return <div className={generateStateMC(row?.state)}>{t(`MC_${row?.state}`)}</div>;
        },
      },

      {
        name: t('Ảnh định danh'),
        minWidth: '240px',
        cell: (row) => {
          return row?.businessDetails?.identifyImages ? (
            <div className='d-flex row-identify-images'>
              <div
                data-index={0}
                onClick={(e) => handlePreviewImg(e, row)}
                className='row-img-preview'>
                <img
                  src={
                    process.env.NEXT_PUBLIC_API_UPLOAD +
                    row?.businessDetails?.identifyImages[0] +
                    '?w=100'
                  }
                  data-src={
                    process.env.NEXT_PUBLIC_API_UPLOAD + row?.businessDetails?.identifyImages[0]
                  }
                  onError={handleErrorImage}
                />
              </div>
              <div
                data-index={1}
                onClick={(e) => handlePreviewImg(e, row)}
                className='row-img-preview'>
                <img
                  src={
                    process.env.NEXT_PUBLIC_API_UPLOAD +
                    row?.businessDetails?.identifyImages[1] +
                    '?w=100'
                  }
                  data-src={
                    process.env.NEXT_PUBLIC_API_UPLOAD + row?.businessDetails?.identifyImages[1]
                  }
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
        name: t('Thao tác'),
        minWidth: '80px',
        cell: (row) => {
          return (
            <Dropdown className='transfer-manage-table-dropdown'>
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
                <Link href={`/cong-thanh-toan/quan-ly-mc/${row.merchantId}`} passHref>
                  <Dropdown.Item>
                    <i className='fas fa-edit fa-lg mr-2' />
                    {t('Cập nhật')}
                  </Dropdown.Item>
                </Link>
                <Dropdown.Item data-index={row?.merchantId} onClick={onRejectMerchant}>
                  <i className='fas fa-minus-circle fa-lg mr-2' />
                  {t('Từ chối')}
                </Dropdown.Item>
                <Dropdown.Item  data-name={row?.businessOverview?.abbreviationName} data-index={row?.merchantId} onClick={onToggleHistory}>
                  <i className='fas fa fa-history fa-lg mr-2' />
                  {t('Lịch sử thay đổi')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],

    [lang, viewer.current, data]
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

export default DatatableApprovalMerchant;
