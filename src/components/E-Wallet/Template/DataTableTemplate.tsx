import { EmailTemplateResponse, GetEmailTemplateInput, ProcessingFlowState } from 'models';
import React, { useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import UpdateTemplate from './UpdateTemplate/UpdateTemplate';

interface Props {
  t: (a: string) => string;
  data: EmailTemplateResponse[];
  totalFilter: number;
  getDataList: (start?: number, limit?: number, sort?: {}) => {
    payload: GetEmailTemplateInput,
    getList: (payload: any) => void
  };
  setSubmitForm: (a: boolean) => void;
  rest?: any;
}

const DataTableTemplate : React.FC<Props> = ({
  t,
  data,
  totalFilter,
  getDataList,
  setSubmitForm,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, ProcessingFlowState>(
    (state) => state?.templateReducer.loading
  );
  const [isShowUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [info, setInfo] = useState<EmailTemplateResponse>({
    id: 0,
    content: '',
    shortName: '',
    description: '',
    title: '',
    type: '',
  })

  const renderTypeTemplate = (type?: string) => {
    if (!type) return;
    switch (type) {
      case "EMAIL":
        return (
          <span className='badge badge-email'>
            <i className="fas fa-envelope fa-lg"></i>
            <p>EMAIL</p>
          </span>
        )
      case "SMS":
        return (
          <span className='badge badge-sms'>
            <i className="fas fa-sms fa-lg"></i>
            <p>SMS</p>
          </span>
        )
      case "NOTIFICATION":
        return (
          <span className='badge badge-notification'>
            <i className="fas fa-bell fa-lg"></i>
            <p>NOTIFICATION</p>
          </span>
        )
      default:
        return ""
    }
  }

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '50px',
        maxWidth: '70px',
        cell: (row) => (
          <div
            className='text-link'
            onClick={() => {
              setInfo({
                id: row?.id,
                content: row?.content,
                description: row?.description,
                shortName: row?.shortName,
                title: row?.title,
                type: row?.type,
              })
              setShowUpdateModal(true);
            }}
          >
            {row?.id}
          </div>
        ),
      },
      {
        name: t('Tên rút gọn'),
        minWidth: '150px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{row?.shortName}</div>
        },
      },
      {
        name: t('Tiêu đề'),
        minWidth: '350px',
        cell: (row) => {
          return <div>{row?.title}</div>
        },
      },
      {
        name: t('Diễn giải'),
        minWidth: '400px',
        cell: (row) => {
          return <div>{row?.description}</div>
        },
      },
      {
        name: t('Loại'),
        center: true,
        minWidth: '140px',
        maxWidth: '140px',
        cell: (row) => renderTypeTemplate(row?.type),
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
                  setInfo({
                    id: row?.id,
                    content: row?.content,
                    description: row?.description,
                    shortName: row?.shortName,
                    title: row?.title,
                    type: row?.type,
                  })
                  setShowUpdateModal(true);
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
        className='data-table-custom template-manage-table'
        columns={columns}
        dataList={data}
        paginationTotalRows={totalFilter}
        t={t}
        nameDataTable='colProcessingList'
        getDataList={getDataList}
        {...rest}
      />
      <UpdateTemplate
        t={t}
        show={isShowUpdateModal}
        info={info}
        handleClose={() => setShowUpdateModal(false)}
        setSubmitForm={setSubmitForm}
      />
    </div>
  )
}

export default DataTableTemplate
