import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { stateWalletKYCEnum, WalletKYC } from 'models';
import React, { memo, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useSelector } from 'react-redux';
import Viewer from 'viewerjs';
interface Props {
  t: (a: string) => string;
  data: WalletKYC[];
  totalFilter?: number;
  onChangeRowsPerPage?: PaginationChangeRowsPerPage;
  onChangePage?: PaginationChangePage;
  // onCloseMerchant: React.ChangeEventHandler<HTMLInputElement>;
  // onRejectMerchant: React.MouseEventHandler<HTMLButtonElement>;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onClickUpdate?: (id: WalletKYC) => React.MouseEventHandler<HTMLDivElement>;
  onClickReject?: (id: WalletKYC) => React.MouseEventHandler<HTMLDivElement>;
  onClickAcceptApproved?: (id: WalletKYC) => React.MouseEventHandler<HTMLDivElement>;
}

const DatatableSocialLink: React.FC<Props> = ({
  data,
  t,
  totalFilter,
  getDataList,
  onClickUpdate,
  onClickReject,
  onClickAcceptApproved,
  ...rest
}) => {
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
      setImgSrc(process.env.NEXT_PUBLIC_API_UPLOAD + img);
      viewer.current && viewer.current.show();
    }
  };

  const generateStateMC = (state?: stateWalletKYCEnum) => {
    if (!state) return '';

    switch (state) {
      case stateWalletKYCEnum.AUTO_APPROVED:
        return 'state-cancel';
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

  const columns: TableColumn<WalletKYC>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '130px',
        cell: (row) => {
          return <div className='highlight-text'>{row?.id || '-'}</div>;
        },
      },
      {
        name: t('Link ID'),
        minWidth: '110px',
        cell: (row) => {
          return <div>{row?.accountId || '-'}</div>;
        },
      },
      {
        name: t('Token link'),
        minWidth: '160px',
        cell: (row) => {
          return <div>{row?.phone || '-'}</div>;
        },
      },
      {
        name: t('Loại'),
        minWidth: '160px',
        cell: (row) => {
          return <div>{row?.phone || '-'}</div>;
        },
      },
      {
        name: t('Từ SDT'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{row?.appName || '-'}</div>;
        },
      },
      {
        name: t('Đến SDT'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.fullname || '-'}</div>;
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '130px',
        cell: (row) => {
          return (
            <div>{row?.birthday ? dayjs(row?.birthday).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('TG tạo'),
        minWidth: '100px',
        cell: (row) => {
          return (
            <div>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('Giá trị GD'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.identifyNumber}</div>;
        },
      },
      {
        name: t('Thực nhận'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.identifyNumber}</div>;
        },
      },
      {
        name: t('Nội dung GD'),
        minWidth: '100px',
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },

      {
        name: t('Phương thức TT'),
        minWidth: '100px',
        cell: (row) => {
          return (
            <div>
              {row?.registeredAt ? dayjs(row?.registeredAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
            </div>
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
        paginationTotalRows={totalFilter}
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

export default memo(DatatableSocialLink);
