import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import ModalUpdateTicketCustomerSupport from 'components/common/ModalCustomerSupport/ModalUpdateTicketCustomerSupport';
import dayjs from 'dayjs';
import { StringChain } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { formatPhone } from 'utils/helpers';

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
  loading?: boolean | any;
  onSubmitForm?: any;
  onPreviewImg?:  (e: React.MouseEvent<HTMLDivElement>,row?:any) => void ;
}
interface FormLoginSubmit {
  id?: number;
  contactPhone: string;
  customerPhone?: string;
  customerEmail?: string;
  classify?: string;
  category?: string;
  method?: string;
  summary: string;
  level?: string;
  status: string;
  assignTarget: string;
  supportStaff: string;
  updatedAt: string;
  createdAt: string;
}
interface Role {
  key?: string;
  name?: string;
}
[];
export default function DataTableCsTool({
  // t,
  data,
  totalFilter,
  onChangeActiveUser,
  getDataList,
  onCheckUpdate,
  onSubmitForm,
  loading,
  onPreviewImg,
  ...rest
}: DataTableCsToolProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<number | any>();

  const onHide = () => {
    setShow(!show);
    router.push(router.pathname);
  };

  const handleResetId = () => {
    setId(null);
  };

  useEffect(() => {
    if (router?.query?.id) {
      setId(router?.query?.id);
      setShow(true);
    }
  }, []);

  const columns: TableColumn<FormLoginSubmit>[] = useMemo(
    () => [
      {
        name: 'Ticket ID',
        minWidth: '100px',

        cell: (row) => {
          return <span>{row?.id}</span>;
        },
      },
      {
        name: t('SĐT Liên hệ'),
        minWidth: '170px',
        center: true,
        cell: (row) => {
          return <div>{row?.contactPhone}</div>;
        },
      },

      {
        name: t('SĐT Tài khoản'),
        minWidth: '170px',
        center: true,
        cell: (row) => {
          return <div>{row?.customerPhone ? formatPhone(row?.customerPhone) : '-'}</div>;
        },
      },
      {
        name: t('Email'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.customerEmail ? row?.customerEmail : '-'}</div>;
        },
      },

      {
        name: t('Danh mục'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row.classify ? t(row.classify) : '-'}</div>;
        },
      },

      {
        name: t('Phân loại'),
        minWidth: '250px',
        maxWidth: '250px',

        cell: (row) => {
          return <div>{row?.category ? t(row?.category) : '-'}</div>;
        },
      },
      {
        minWidth: '250px',
        maxWidth: '250px',
        name: t('Phương thức'),
        cell: (row) => {
          return <div>{row?.method ? t(row?.method) : '-'}</div>;
        },
      },
      {
        name: t('Mô tả'),
        minWidth: '250px',
        maxWidth: '250px',

        cell: (row) => {
          return (
            <div className={row?.summary?.length > 100 ? 'row-cs-tool-content' : ''}>
              {row?.summary ? row?.summary : '-'}
            </div>
          );
        },
      },
      // {
      {
        minWidth: '250px',
        maxWidth: '250px',
        name: t('Cấp độ'),
        cell: (row) => {
          return (
            row?.level && (
              <div className={row?.level === 'CRITICAL' ? 'text-danger' : 'text-normal'}>
                <i className='fas fa-circle'></i>
                <span style={{ marginLeft: '12px' }}>{t(row?.level)}</span>
              </div>
            )
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
            row?.status && (
              <div className='col-right text-right'>
                <span
                  className={`${
                    row?.status === 'PROCESSING'
                      ? 'state-pending-modal'
                      : row?.status === 'RESOLVED' ||
                        row?.status === 'USED' ||
                        row?.status === 'CLAIMED' ||
                        row?.status === 'AUTHORIZED'
                      ? 'state-success-modal'
                      : row?.status === 'NEW'
                      ? 'state-refunded-modal'
                      : row?.status === 'CANCELED_SUCCEEDED'
                      ? 'state-cancel-success-modal'
                      : row?.status === 'CLOSE'
                      ? 'state-close-modal'
                      : row?.status === 'OPEN'
                      ? 'state-cancel-success-modal'
                      : 'state-cancel-modal'
                  } `}>
                  {t(row?.status)}
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
        name: t('Nhân viên tiếp nhận'),
        minWidth: '170px',
        maxWidth: '180px',
        cell: (row) => {
          return <div>{row?.supportStaff}</div>;
        },
      },
      {
        name: t('Thời gian cập nhật'),
        minWidth: '170px',
        maxWidth: '200px',

        cell: (row) => {
          return <div>{dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Thời gian tiếp nhận'),
        minWidth: '170px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <>
              <div className='justify-content-center w-100 edit__comtent'>
                <button
                  className=''
                  onClick={() => {
                    setId(row?.id);
                    setShow(true);
                    router.push(`${router.pathname}?id=${row?.id}`);
                  }}>
                  <i className='fas fa-edit fa-lg edit__icon text-muted'></i>
                </button>
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
      <DataTableCustom
        className='data-table-custom data-table-custom-cs-tool-dashboard'
        columns={columns}
        dataList={data}
        paginationTotalRows={totalFilter}
        t={t}
        fixedHeader
        fixedHeaderScrollHeight='1000px'
        nameDataTable='data-table-cs-tool-ticket'
        getDataList={getDataList}
        isLoading={loading}
        csToolCheck={true}
        {...rest}
      />

      <ModalUpdateTicketCustomerSupport
        onSubmitForm={onSubmitForm}
        id={id}
        onResetId={handleResetId}
        show={show}
        onHide={onHide}
        onPreviewImg={onPreviewImg}
      />
    </>
  );
}
