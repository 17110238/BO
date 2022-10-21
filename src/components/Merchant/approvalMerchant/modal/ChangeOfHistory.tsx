import React, { FC, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TableColumn } from 'react-data-table-component';
import { LogsType } from 'models';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });
import { useDispatch, useSelector } from 'react-redux';
import { getMerchantLog } from 'redux/actions';
import { GetAccountMerchantLogInput } from 'models';
interface Props {
  show: boolean;
  onHide: () => void;
  merchantId: string;
  merchantName: string;
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

export const ChangeOfHistoryModal: FC<Props> = ({ show, onHide, merchantId, merchantName }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const dispatch = useDispatch();
  const [listMerchantLog, setListMerchantLog] = useState<LogsType[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      setSubmitForm(true);
    }
  }, [show]);

  const handleGetMerchantLog = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetAccountMerchantLogInput = {
      paging: {
        start: start!,
        limit: limit!,
      },
      search: merchantId,
      createdAt: {
        from: getParameterInURL(startDate),
        to: getParameterInURL(endDate),
      },
    };
    function handleGetMerchantLog(payload: GetAccountMerchantLogInput) {
      setLoadingTable(true);
      dispatch(
        getMerchantLog(payload, (status, res) => {
          setSubmitForm(false);
          setListMerchantLog(res);
          setLoadingTable(false);
        })
      );
    }
    return {
      payload,
      getList: handleGetMerchantLog,
      submitForm,
    };
  };

  const columns: TableColumn<LogsType>[] = useMemo(
    () => [
      {
        name: t('Thời gian'),
        minWidth: '200px',
        maxWidth: '220px',
        cell: (row) => <span>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</span>,
      },
      {
        name: t('Nhân viên'),
        minWidth: '150px',
        maxWidth: '250px',
        cell: (row) => <span>{row?.userName}</span>,
      },
      {
        name: t('Actions'),
        cell: (row) => <span>{row?.action}</span>,
        minWidth: '200px',
        maxWidth: '220px',
      },
      {
        name: t('Details'),
        cell: (row) => {
          return row?.jsonData && <div dangerouslySetInnerHTML={{ __html: row?.jsonData }}></div>;
        },
        minWidth: '480px',
        maxWidth: '480px',
      },
    ],
    [lang]
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
            {t('MC_Operation_History')}
            <span>
              : {merchantId} - {merchantName}
            </span>
          </span>
        </Modal.Header>
        <Modal.Body>
          <DataTableCustom
            isLoading={loadingTable}
            columns={columns}
            dataList={listMerchantLog}
            t={t}
            className='approval-merchant-table'
            getDataList={handleGetMerchantLog}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
