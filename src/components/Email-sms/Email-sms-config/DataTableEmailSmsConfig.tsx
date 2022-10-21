import React, { useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { useRouter } from 'next/router';
import { TableColumn } from 'react-data-table-component';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useTranslation } from 'react-i18next';
import ModalUpdateEmailSms from './ModalUpdateEmailSms';
import { EmailSmsProductReponse } from 'models/emailSms/emailSms';
import { useSelector, useDispatch } from 'react-redux';
import { getEmailSmsProduct } from 'redux/actions/emailSmsAction';
import useWindowDimensions from 'hook/useWindowDimension';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  dataEmailSmsProduct?: EmailSmsProductReponse[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  totalFilter: number;
  heightBoxSearch?: number;
  setEmailSmsProduct?: any;
}

const DataTableEmailSms: React.FC<Props> = ({
  dataEmailSmsProduct,
  getDataList,
  totalFilter,
  heightBoxSearch,
  setEmailSmsProduct,
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [isShow, setIsShow] = useState<boolean>(false);
  const onHide = () => setIsShow(false);

  const [emailSmsDetail, setEmailSmsDetail] = useState<EmailSmsProductReponse[]>([]);
  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer

  const dispatch = useDispatch();

  const columns: TableColumn<EmailSmsProductReponse>[] = useMemo(
    () => [
      {
        name: t('Tên gói'),
        minWidth: '100px',
        maxWidth: '250px',

        cell: (row, index) => <div>{row?.title}</div>,
      },
      {
        name: t('Số lượng email'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row, index) => <div>{formatCurrency(row?.package?.mail)}</div>,
        right : true
      },
      {
        name: t('Số lượng Sms'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{formatCurrency(row?.package?.sms)}</div>;
        },
        right : true
      },
      {
        name: t('Tổng giá trị'),
        minWidth: '100px',
        maxWidth: '130px',
        cell: (row) => {
          return <div>{formatCurrency(row?.amount)} đ</div>;
        },
        right : true
      },
      {
        name: t('Description'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row.description}</div>;
        },
      },
      {
        name: t('TG tạo'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row.createdAt}</div>;
        },
      },
      {
        name: t('TG Cập Nhật'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row.updatedAt}</div>;
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '150px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <span className={row?.isVisible ? 'state-success-modal' : 'state-cancel-modal'}>
              {row?.isVisible ? t('Hoạt động') : t('Ngưng hoạt động')}
            </span>
          );
        },
        center : true
      },
      {
        name: t('Thao tác'),
        minWidth: '130px',
        maxWidth: '130px',
        center: true,
        cell: (row) => {
          return (
            <div className='d-flex justify-content-center edit__comtent'>
              <button className='' onClick={() => {
                    setIsShow(true);
                    const payload = {
                      filter: {
                        id: row?.id!,
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
                      getEmailSmsProduct(payload, (status, res) => {
                        if (status) {
                          setEmailSmsDetail(res?.data);
                        } else {
                          setEmailSmsDetail([]);
                        }
                      })
                    );
                  }}>
                <i className='fas fa-edit fa-lg edit__icon text-muted'></i>
              </button>
            </div>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        className='data-table-custom'
        columns={columns}
        dataList={dataEmailSmsProduct}
        paginationTotalRows={totalFilter}
        t={t}
        getDataList={getDataList}
        fixedHeader={true}
        fixedHeaderScrollHeight={`${totalFixedHeightDatatable}px`}
        nameDataTable='colEmailSms'
        isSorting={true}
      />
      {isShow && (
        <ModalUpdateEmailSms
          setEmailSmsProduct={setEmailSmsProduct}
          emailSmsDetail={emailSmsDetail[0]}
          show={isShow}
          onHide={onHide}
        />
      )}
    </>
  );
};

export default DataTableEmailSms;
