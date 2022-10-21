import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import ModalDashBoardRelyTicket from 'components/common/ModalDashBoardCustomerSupportTicket/ModalDashBoardRelyTicket';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import Viewer from 'viewerjs';
import { statusOptionsObject, SupportTicketStateEnum } from './AddTicket';
interface DataTableCsToolProps {
  t: (a: string) => string;
  data: string[] | any;
  totalFilter?: number;
  onRowSelected?: () => void;
  deleteDefault?: boolean;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm?: any;
  onChangeActiveUser?: (e: any, data: any) => void;
  rest?: any;
  handleCheckUpdate: () => void;
  loading?: any;
}

export default function DataTableCsTool({
  t,
  data,
  totalFilter,
  onChangeActiveUser,
  getDataList,
  setSubmitForm,
  handleCheckUpdate,
  loading,
  ...rest
}: DataTableCsToolProps) {
  const router = useRouter();
  const [id, setId] = useState<number | any>(null);
  const [show, setShow] = useState<boolean>(false);
  const lang = localStorage.getItem('NEXT_LOCALE');

  const handleResetId = () => {
    setId(null);
  };

  const onHide = () => {
    setShow(!show);
  };
  const viewer = useRef<any>();
  const [img, setImg] = useState<string>('');

  const onSetModal = () => {
    setShow(true);
  };

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img10') as HTMLElement;
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
      // {
      //   name: t('ID'),
      //   minWidth: '50px',
      //   maxWidth: '120px',
      //   cell: (row, index) => <div className='position-relative w-100'>{index}</div>,
      // },
      {
        name: t('Tên merchant'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.merchantName}</div>;
        },
      },
      {
        name: t('ID'),
        minWidth: '120px',
        mmaxWidth: '140px',
        cell: (row) => {
          return <div>{row?.ticketId}</div>;
        },
      },

      {
        name: t('Email'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{row?.email}</div>;
        },
      },
      {
        name: t('Tiêu đề'),
        minWidth: '110px',
        cell: (row) => {
          return <div>{row?.title}</div>;
        },
      },
      // {
      //   name: t('Chức vụ'),
      //   minWidth: '110px',
      //   cell: (row) => {

      //     let index: any = row.group[0];
      //     return <div>{object?.[index]?.description || ''} </div>;
      //   },
      // },

      {
        name: t('Mô tả'),
        minWidth: '250px',
        maxWidth: '250px',

        cell: (row) => {
          return (
            <div className={row?.content?.length > 119 ? 'row-cs-tool-content' : ''}>
              {row?.content}
            </div>
          );
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '160px',
        maxWidth: '160px',
        left: true,
        cell: (row) => {
          return (
            row?.state && (
              <div className='col-right text-right'>
                <span
                  className={`${
                    row?.state === 'PROCESSING'
                      ? 'state-pending-modal'
                      : row?.state === 'USED' ||
                        row?.state === 'CLAIMED' ||
                        row?.state === 'AUTHORIZED'
                      ? 'state-success-modal'
                      : row?.state === 'NEW'
                      ? 'state-refunded-modal'
                      : row?.state === 'CANCELED_SUCCEEDED'
                      ? 'state-cancel-success-modal'
                      : row?.state === 'RESOLVED' || row?.state === 'CLOSE'
                      ? 'state-close-modal'
                      : row?.state === 'OPEN'
                      ? 'state-cancel-success-modal'
                      : 'state-cancel-modal'
                  } `}>
                  {t(statusOptionsObject[row?.state as keyof {}])}
                </span>
              </div>
            )
          );
        },
      },
      {
        name: t('Bộ phận xử lý'),
        minWidth: '120px',
        maxWidth: '150px',

        cell: (row) => {
          return <div>{row?.assignTarget ? t(row?.assignTarget) : ''}</div>;
        },
      },
      {
        name: t('User'),
        minWidth: '180px',
        maxWidth: '180px',

        cell: (row) => {
          return (
            row?.accountInfo && (
              <div>
                Id tài khoản: {row?.accountInfo?.id}
                <br />
                Tên tài khoản: <br />
                {row?.accountInfo?.name}
              </div>
            )
          );
        },
      },

      {
        name: t('Thời gian cập nhật'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <div className='form-group form-input-checkbox' style={{ margin: '0px' }}>
              {dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}
            </div>
          );
        },
      },
      {
        name: t('Hình đính kèm'),
        minWidth: '220px',
        maxWidth: '220px',
        cell: (row) => {
          return (
            <>
              <div className={row?.ticketImages?.length >= 3 ? 'imgGetLog scrollX' : 'imgGetLog'}>
                <div className='image-groups'>
                  {row?.ticketImages &&
                    row?.ticketImages?.map((img: string, index: number) => {
                      return (
                        <div
                          className='row-img-preview'
                          data-index={index}
                          key={index}
                          onClick={(e) => handlePreviewImg(e, img)}>
                          <img src={img} alt='img-kyc' onError={handleErrorImage} />
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
        name: t('Thao tác'),
        minWidth: '130px',
        maxWidth: '130px',
        center: true,
        cell: (row) => {
          return (
            <>
              <div
                onClick={() => {
                  // setId(row?.ticketId);
                  // console.log("2131231231321313213213")
                  setShow(true);
                  router.push(router.pathname + `?ticketId=${row?.ticketId}`);
                }}
                className='d-flex justify-content-center w-100  align-items-center btn btn-primary'>
                Theo dõi
              </div>
            </>
          );
        },
      },
    ],
    [lang, data]
  );

  return (
    <>
      <div className='preview-identity-img10 d-none' style={{ zIndex: '10000' }}>
        <img src={img} alt='' />
      </div>
      {data && (
        <DataTableCustom
          // className='data-table-custom-cs-tool-dashboard'
          isLoading={loading}
          columns={columns}
          dataList={data}
          t={t}
          nameDataTable='data-table-cs-tool-dashboard'
          getDataList={getDataList}
          {...rest}
        />
      )}
      {(id || router?.query?.ticketId) && (
        <ModalDashBoardRelyTicket
          router={router}
          onResetId={handleResetId}
          handleCheckUpdate={handleCheckUpdate}
          id={id ? id : router?.query?.ticketId}
          show={show}
          onSetModal={onSetModal}
          onHide={onHide}
        />
      )}
    </>
  );
}
