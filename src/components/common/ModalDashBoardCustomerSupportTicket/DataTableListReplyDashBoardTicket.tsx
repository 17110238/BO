import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import Viewer from 'viewerjs';

interface DataTableCsToolProps {
  t?: any;
  data: any[];
  totalFilter: number;
  onRowSelected?: () => void;
  deleteDefault?: boolean;
  setSubmitForm?: (a: boolean) => void;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onChangeActiveUser?: (e: any, data: any) => void;
  rest?: any;
  filter?: any;
  heightBoxSearch?: number;
  onCheckUpdate?: () => void;
}
interface FormLoginSubmit {
  username?: string;
  password: string;
  repassword?: string;
  fullname?: string;
  phone?: number | string;
  email?: string;
  gender?: any;
  birthday?: Date | null;
  isActive?: any;
  role: string[];
  group?: string[] | any;
  scope: string[];
}
interface Role {
  key?: string;
  name?: string;
}
[];
export default function DataTableCsTool({
  t,
  data,
  totalFilter,
  onChangeActiveUser,
  getDataList,
  onCheckUpdate,
  ...rest
}: DataTableCsToolProps) {
  const router = useRouter();
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [checkIsActive, setCheckIsActive] = useState<Boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const viewer = useRef<any>();
  const [img, setImg] = useState<string>('');

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img2') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      zIndex: 10000,
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
  }, [img]);

  //update show image by viewerjs
  const handlePreviewImg = (e: MouseEvent<any>, row?: any) => {
    viewer.current && viewer.current.show();
    const target = e.target as any;
    setImg(row);
  };

  const handleErrorImage: React.ReactEventHandler<any> = (e) => {
    const target = e.target as any;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Id'),
        minWidth: '90px',
        maxWidth: '90px',

        cell: (row) => {
          return (
            <span className='text-link' onClick={() => {}}>
              {row?.replyId ? row?.replyId : '-'}
            </span>
          );
        },
      },
      {
        name: t('Ngày tạo'),
        minWidth: '130px',
        maxWidth: '200px',
        center: true,
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('Nội dung'),
        minWidth: '150px',
        maxWidth: '250px',

        cell: (row) => {
          return (
            <div className={row?.content.length > 100 ? 'row-cs-tool-content' : ''}>
              {row?.content ? row?.content : '-'}
            </div>
          );
        },
      },

      {
        name: t(' Hình ảnh '),
        minWidth: '200px',
        maxWidth: '250px',
        overflowX: 'scroll',
        center: true,

        cell: (row) => {
          return (
            <>
              <div className={row?.images?.length >= 3 ? 'imgGetLog scrollX' : 'imgGetLog'}>
                <div className='image-groups'>
                  {row?.images &&
                    row?.images?.map((img: string, index: number) => {
                      return (
                        <div
                          className='row-img-preview'
                          data-index={index}
                          key={index}
                          onClick={(e) => {
                            handlePreviewImg(
                              e,
                              img.startsWith('http')
                                ? img
                                : process.env.NEXT_PUBLIC_API_UPLOAD + img
                            );
                          }}>
                          <img
                            src={
                              img.startsWith('http')
                                ? img
                                : process.env.NEXT_PUBLIC_API_UPLOAD + img
                            }
                            alt='img-kyc'
                            onError={handleErrorImage}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          );
        },
      },

      {
        name: t('Người hỗ trợ'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row) => {
          return <div>{row?.accountInfo?.name ? row?.accountInfo?.name : '-'}</div>;
        },
      },
    ],
    [lang, data]
  );

  return (
    <>
      <div className='preview-identity-img2 d-none' style={{ zIndex: '10000' }}>
        <img src={img} alt='' />
      </div>
      <DataTableCustom
        className='data-table-custom-cs-tool-dashboard'
        columns={columns}
        dataList={data}
        paginationTotalRows={totalFilter}
        t={t}
        fixedHeader
        fixedHeaderScrollHeight='1000px'
        nameDataTable='dataTable-list-reply-ticket'
        getDataList={getDataList}
        {...rest}
      />
    </>
  );
}
