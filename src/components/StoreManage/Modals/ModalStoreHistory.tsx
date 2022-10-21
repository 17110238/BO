import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TableColumn } from 'react-data-table-component';
import { useSelector, useDispatch } from 'react-redux';
import { getLogStore } from 'redux/actions';
import { InputLogStore, InputSearchLogStore } from 'models';
import dayjs from 'dayjs';
import dynamic from "next/dynamic";
const ReactJson = dynamic(import('react-json-view'), { ssr: false });

interface PropsComponent {
  isShow: boolean;
  onHide: () => void;
  storeId?: number;
  totalFilter?: number;
  merchantName?: string;
}

export default function ModalStoreHistory({
  isShow,
  onHide,
  totalFilter = 5,
  storeId,
  merchantName,
  ...rest
}: PropsComponent) {
  const loading = useSelector<any, boolean>((state) => state?.storeReducer?.loading);
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const [data, setData] = useState([]);
  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Thời gian'),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row) => {
          return <>{dayjs(row.createdAt).format('H:m DD-MM-YYYY')}</>;
        },
      },
      {
        name: t('Nhân viên'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <>{row.fullName}</>;
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '250px',
        maxWidth: '300px',
        cell: (row) => {
          return <>{row.action}</>;
        },
      },
      {
        name: t('Chi tiết'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <>
              <ReactJson src={JSON.parse(row.jsonData)} collapsed={true} />
            </>
          );
        },
      },
    ],
    [data]
  );
  const getListLogStore = (payload: InputSearchLogStore) => {
    dispatch(
      getLogStore(payload, (status: boolean, res: any) => {
        if (status) {
          const logsData: InputLogStore = res.data;
          console.log(logsData.ip);
        }
      })
    );
  };
  const handleGetLogsStore = (start?: number, limit?: number): any => {
    if (storeId) {
      const payload: InputSearchLogStore = {
        search: storeId.toString(),
        createdAt: {},
        paging: {
          start: start!,
          limit: limit!,
        },
      };
      const getListData = (payload: InputSearchLogStore) => {
        dispatch(
          getLogStore(payload, (status: boolean, res: any) => {
            if (status) {
              const logsData: InputLogStore = res.data;
            }
          })
        );
      };
      return {
        payload,
        getDataList: getListData,
      };
    }
  };
  useEffect(() => {
    if (storeId) {
      const payload: InputSearchLogStore = {
        search: storeId.toString(),
        createdAt: {},
        paging: {
          start: 0,
          limit: 20,
        },
      };
      dispatch(
        getLogStore(payload, (status: boolean, res: any) => {
          if (status) {
            setData(res.data);
          }
        })
      );
    }
  }, [storeId]);
  return (
    <>
      <Modal className='modal-storeDetail' show={isShow} onHide={onHide} backdrop='static'>
        <Modal.Header closeButton>
          <div className='modal-storeDetail__left'>
            <p>{t('Lịch Sử Thao Tác Store')}</p>
            <span>
              {storeId}-{merchantName}
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <DataTableCustom
            dataList={data}
            paginationTotalRows={totalFilter}
            columns={columns}
            t={t}
            isLoading={loading}
            nameDataTable='colStoreManage'
            className='storeManage-table'
            getDataList={handleGetLogsStore}
            isSorting={true}
            fixedHeader={true}
            {...rest}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
