import React, { FC, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TableColumn } from 'react-data-table-component';
import { FilterLogTransactionFeeInput, LogsTransactionFee } from 'models';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import Viewer from 'viewerjs';
import { getLogTransactionFee, getpaymentMethodList } from 'redux/actions';
interface Props {
  show: boolean;
  onHide: () => void;
  merchantId: string;
}

const getParameterInURL = (params: string) => {
  const emptyString = '';
  const currentLocation = window.location.href;
  const url = new URL(currentLocation);
  let getParam = url.searchParams.get(params);
  if (getParam) {
    return getParam;
  } else {
    return emptyString;
  }
};

const startDate = 'from';
const endDate = 'to';

export const ChangeOfFeeConfigurationModal: FC<Props> = ({ show, onHide, merchantId }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const dispatch = useDispatch();
  const [paymentMethodList, setPaymentMethodList] = useState<any[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [listFeeConfiguration, setListFeeConfiguration] = useState<LogsTransactionFee[]>([]);
  const [imgSrc, setImgSrc] = useState('');
  const viewer = useRef<any>();

  useEffect(() => {
    if (show) {
      setSubmitForm(true);
      dispatch(
        getpaymentMethodList((status, response) => {
          setPaymentMethodList(response);
        })
      );
    }
  }, [show]);

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

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, row: LogsTransactionFee) => {
    const target = e.currentTarget as HTMLDivElement;
    const index = target.getAttribute('data-index');
    if (index !== null && row?.images) {
      setImgSrc(process.env.NEXT_PUBLIC_API_UPLOAD + row?.images[+index]);
      viewer.current && viewer.current.show();
    }
  };

  const handleFeeConfiguration = (start?: number, limit?: number, sort?: {}) => {
    const payload: FilterLogTransactionFeeInput = {
      filter: {
        search: merchantId,
        createdAt: {
          from: getParameterInURL(startDate),
          to: getParameterInURL(endDate),
        },
      },
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function getLogFeeConfigurations(payload: FilterLogTransactionFeeInput) {
      setLoadingTable(true);
      dispatch(
        getLogTransactionFee(payload, (status, res) => {
          setSubmitForm(false);
          setListFeeConfiguration(res);
          setLoadingTable(false);
        })
      );
    }
    return {
      payload,
      getList: getLogFeeConfigurations,
      submitForm,
    };
  };

  const columns: TableColumn<LogsTransactionFee>[] = useMemo(
    () => [
      {
        name: t('Họ và tên'),
        minWidth: '200px',
        maxWidth: '220px',
        cell: (row) => <span>{row?.fullname}</span>,
      },
      {
        name: t('Loại'),
        minWidth: '140px',
        maxWidth: '180px',
        cell: (row) => (
          <span>{row?.type === 'ecommerce' ? t('Phí thanh toán') : t('Phí chi hộ')}</span>
        ),
      },
      {
        name: t('Phương thức TT'),
        minWidth: '180px',
        maxWidth: '200px',
        cell: (row) => (
          <span>
            {paymentMethodList.length > 0 &&
              paymentMethodList.map((method) => {
                const paymentId = row?.paymentMethodId ? +row.paymentMethodId : '';
                if (method.id === paymentId) {
                  return <span>{t(`${method.name}`)}</span>;
                }
              })}
          </span>
        ),
      },
      {
        name: t('Phí người dùng'),
        right: true,
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => <span>{row?.jsonAfterParams?.gateway}</span>,
      },
      {
        name: t('Phí người dùng cố định'),
        right: true,
        minWidth: '180px',
        maxWidth: '250px',
        cell: (row) => <span>{row?.jsonAfterParams?.fixedGateway}</span>,
      },
      {
        name: t('Phí đối soát'),
        right: true,
        cell: (row) => <span>{row?.jsonAfterParams?.transaction}</span>,
        minWidth: '100px',
        maxWidth: '120px',
      },
      {
        name: t('Phí đối soát cố định'),
        right: true,
        cell: (row) => <span>{row?.jsonAfterParams?.fixedTransaction}</span>,
        minWidth: '150px',
        maxWidth: '180px',
      },
      {
        name: t('Hình ảnh'),
        cell: (row) => (
          <div className='d-flex'>
            {row?.images.map((image, index) => (
              <div
                key={index}
                data-index={index}
                onClick={(e) => handlePreviewImg(e, row)}
                className='list-image-preview'>
                <img
                  src={process.env.NEXT_PUBLIC_API_UPLOAD + image}
                  data-src={process.env.NEXT_PUBLIC_API_UPLOAD + image}
                  onError={handleErrorImage}
                  alt='Lịch sử cấu hình phí'
                  className='image-preview'
                />
              </div>
            ))}
          </div>
        ),
        minWidth: '370px',
      },
      {
        name: t('Mô tả'),
        cell: (row) => <span>{row?.description ?? '-'}</span>,
        minWidth: '250px',
        maxWidth: '280px',
      },
      {
        name: t('TG tạo'),
        cell: (row) => <span>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</span>,
        minWidth: '140px',
        maxWidth: '150px',
      },
    ],
    [lang, paymentMethodList, viewer.current, imgSrc]
  );

  return (
    <>
      <Modal
        className='change_of_history_modal'
        show={show}
        onHide={() => {
          onHide();
        }}>
        <Modal.Header closeButton>
          <span className='font-weight-bold'>
            {t('Lịch sử thay đổi cấu hình phí')}
            <span className='font-weight-normal'>: {merchantId}</span>
          </span>
        </Modal.Header>
        <Modal.Body>
          {paymentMethodList.length > 0 && (
            <>
              <DataTableCustom
                isLoading={loadingTable}
                columns={columns}
                dataList={listFeeConfiguration}
                t={t}
                className='approval-merchant-table'
                getDataList={handleFeeConfiguration}
              />
            </>
          )}
        </Modal.Body>
      </Modal>
      <img src={imgSrc} className='preview-identity-img' onError={handleErrorImage} />
    </>
  );
};
