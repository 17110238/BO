import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { GetLockedCardsInput, LockedCard } from 'models/lockedCards/lockedCardsState';
import React, { useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import ModalViewLogs from './viewLogs/ModalViewLogs';
import alert from 'utils/helpers/alert';
import { updateLockedCard } from 'redux/actions/lockedCardActions';
import Loading from 'components/common/Loading/LoadingFullScreen';

interface Props {
  t: (a: string) => string;
  data: LockedCard[];
  totalFilter?: number;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: GetLockedCardsInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  rest?: any;
}

function DataTable({ t, data, getDataList, setSubmitForm, ...rest }: Props) {
  const dispatch = useDispatch();
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, boolean>((state) => state?.lockedCardReducer?.loading);
  const isLoadingUpdate = useSelector<any, boolean>(
    (state) => state?.lockedCardReducer?.loadingUpdate
  );
  const [isShowModalViewLogs, setIsShowModalViewLogs] = useState<boolean>(false);
  const [logs, setLogs] = useState<any>();

  const convertState = (_state: string) => {
    const state = _state?.toLowerCase();
    switch (state) {
      case 'open':
        return 'Mở';
      case 'locked':
        return 'Khóa';

      default:
        return state ? state.charAt(0).toUpperCase() + state?.slice(1) : state;
    }
  };

  const handleLockCard = (serialNumber: string, state: string) => {
    const payload = {
      serialNumber,
      type: state === 'LOCKED' ? 'OPEN' : 'LOCKED',
    };

    dispatch(
      updateLockedCard(payload, (status, res) => {
        if (status) {
          alert('success', res);
        } else {
          alert('error', res);
        }
        setSubmitForm && setSubmitForm(true);
      })
    );
  };

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Số thẻ'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.number}</div>;
        },
      },
      {
        name: t('Loại thẻ'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.type}</div>;
        },
      },
      {
        name: t('Tên chủ thẻ'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.name}</div>;
        },
      },
      {
        name: t('Mã ngân hàng'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.swiftCode || '-'}</div>;
        },
      },
      {
        name: t('Trạng thái'),
        center: true,
        minWidth: '140px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <div className={`state ${row?.state?.toLowerCase()}`}>{convertState(row?.state)}</div>
          );
        },
      },
      {
        name: t('Log'),
        center: true,
        minWidth: '100px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <i
              className={`fas fa-eye fa-lg update-icon text-muted`}
              onClick={() => {
                setIsShowModalViewLogs(true);
                setLogs(row?.stateAt);
              }}
            />
          );
        },
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <label className='switch'>
              <input type='checkbox' checked={row?.state === 'OPEN'} readOnly />
              <span
                className='slider'
                onClick={() => handleLockCard(row?.number, row?.state)}></span>
            </label>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        isLoading={isLoading}
        className='data-table-custom locked-cards-table'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colProcessingList'
        getDataList={getDataList}
        {...rest}
      />
      <ModalViewLogs
        logs={logs}
        t={t}
        show={isShowModalViewLogs}
        handleClose={() => setIsShowModalViewLogs(false)}
        convertState={convertState}
      />
      {isLoadingUpdate && <Loading />}
    </div>
  );
}

export default DataTable;
