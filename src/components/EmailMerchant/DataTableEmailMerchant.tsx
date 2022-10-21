// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { reSendEmail } from 'redux/actions';
import alert from 'utils/helpers/alert';
import ModalEmailMerchantContent from 'components/EmailMerchant/modal/ModalEmailMerchantContent';
interface Props {
  t: (a: string) => string;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  data: any | [];
  totalRow?: number;
  loading?: any;
}

const DataTableEmailMerchant: React.FC<Props> = ({
  t,
  getDataList,
  data,
  loading,
  totalRow,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<number>();

  const [templateContent, setTemplateContent] = useState<string>('');
  const onHide = () => {
    setShow(!show);
  };

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Thời gian '),
        minWidth: '300px',
        maxWidth: '300px',
        cell: (row, index) => {
          return (
            <div >{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>
          );
        },
      },
      {
        name: t('Tên Merchant'),
        minWidth: '270px',
        maxWidth: '270px',
        cell: (row, index) => {
          return <div>{row?.merchantName || '-'}</div>;
        },
      },
      {
        name: t('Tiêu đề email'),
        minWidth: '375px',
        maxWidth: '750px',
        cell: (row, index) => {
          return (
            <div
              onClick={() => {
                setId(row?.id);
                setShow(true);
                setTemplateContent(row?.content);
              }}
              className='text-link  w-100'>
              {row?.title ? row?.title : '-'}
            </div>
          );
        },
      },

      {
        name: t('Thao tác'),
        minWidth: '180px',
        maxWidth: '300px',
        center: true,

        cell: (row, index) => (
          <div
            onClick={() => {
              dispatch(
                reSendEmail(
                  {
                    filter: {
                      id: row?.id,
                    },
                  },
                  (status, res) => {
                    if (status) {
                      alert('success', 'Gửi lại mail ' + res?.message, t);
                    } else {
                      alert('error', res?.message, t);
                    }
                  }
                )
              );
            }}
            className='text-right w-100  btn btn-primary'>
            Gửi lại Email
          </div>
        ),
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        isLoading={loading}
        className='data-table-custom  data-table-email-merchant'
        columns={columns}
        dataList={data}
        paginationTotalRows={totalRow}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
      />
      {templateContent && (
        <ModalEmailMerchantContent templateContent={templateContent} show={show} onHide={onHide} />
      )}
    </div>
  );
};

export default DataTableEmailMerchant;
