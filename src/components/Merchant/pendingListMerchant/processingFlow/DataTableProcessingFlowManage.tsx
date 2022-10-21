import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import { ProcessingFlowResponse, ProcessingFlowState, ProcessListType } from 'models';
import React, { useMemo, useState, Fragment } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import ModalUpdate from './update/ModalUpdate';
import checkPermisson from 'utils/helpers/checkPermission';

interface DataTableProcessingFlowProps {
  t: (a: string) => string;
  data: ProcessingFlowResponse[];
  totalFilter: number;
  getDataList: (start?: number, limit?: number, sort?: {}) => {
    payload: any,
    getList: (payload: any) => void
  };
  submitForm: boolean;
  handleRecallProcessingList: (a: any) => void;
  rest?: any;
}

interface scopeUserProps {
  scope: string[];
}

function DataTableProcessingFlow({
  t,
  data,
  totalFilter,
  getDataList,
  submitForm,
  handleRecallProcessingList,
  ...rest
}: DataTableProcessingFlowProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, ProcessingFlowState>(
    (state) => state?.processingFlowReducer.loading
  );
  const [detailType, setDetailType] = useState<string | undefined>('');
  const [idDetail, setIdDetail] = useState<number>(0);
  const [isShowModalUpdateProcessingFlow, setShowModalUpdateProcessingFlow] = useState<boolean>(false);
  const [processingFlowInfo, setProcessingFlowInfo] = useState<ProcessingFlowResponse>({
    eventId: '',
    eventName: '',
  });

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Mã quy trình'),
        minWidth: '300px',
        maxWidth: '500px',
        cell: (row, index) => (
          <div>{row?.eventId}</div>
        ),
      },
      {
        name: t('Tên quy trình'),
        minWidth: '300px',
        maxWidth: '500px',
        cell: (row) => {
          return <div>{row?.eventName}</div>
        },
      },
      {
        name: t('Quy trình duyệt'),
        minWidth: '300px',
        cell: (row) => {
          return (
            <ul className="processing-list-flow-container">
              <li>
                {
                  row.processList.map((process: any) => {
                    if (process?.order === 1) {
                      return process?.user?.map((user: any, index: number) => {
                        return <p key={index}>{user?.username}</p>
                      })
                    }
                  })
                }
              </li>
              {
                row?.processList.length > 1 &&
                row?.processList.map((process: any, index: number) => {
                  if (index >= 1) {
                    return (
                      <li key={index}>
                        {
                          process?.order === index + 1 && process?.user?.map((user: any, index: number) => {
                            return <p key={index}>{user?.username}</p>
                          })
                        }
                      </li>
                    )
                  }
                })
              }
            </ul>
          )
        },
      },
      {
        name: t("Thao tác"),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <div className="update-icon">
              <i
                className="fas fa-edit fa-lg update-icon text-muted"
                onClick={() => {
                  setProcessingFlowInfo({
                    ...processingFlowInfo,
                    eventName: row.eventName,
                    eventId: row.eventId,
                    processList: row.processList
                  });
                  setShowModalUpdateProcessingFlow(true)
                }}>
              </i>
            </div>
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
        className='data-table-custom pending-list-merchant-table'
        columns={columns}
        dataList={data}
        paginationTotalRows={totalFilter}
        t={t}
        nameDataTable='colProcessingList'
        getDataList={getDataList}
        {...rest}
      />
      <DetailTransDrawer
        type={detailType}
        idDetail={idDetail}
        closeDrawerDetail={() => {
          setDetailType('');
          setIdDetail(0);
        }}
        showOtherDetail={(type, itemId) => {
          setDetailType(type);
          setIdDetail(itemId);
        }}
        t={t}
      />
      <ModalUpdate
        t={t}
        show={isShowModalUpdateProcessingFlow}
        handleClose={() => {
          setShowModalUpdateProcessingFlow(false)
        }}
        processingFlowInfo={processingFlowInfo}
        submitForm={submitForm}
        handleRecallProcessingList={handleRecallProcessingList}
      />
    </div>
  );
}

export default DataTableProcessingFlow;
