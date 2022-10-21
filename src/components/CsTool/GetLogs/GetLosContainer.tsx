import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getLog } from 'redux/actions';
import DataTableGetLogs from './DatatableGetLogs';

interface Props {
  id?: number | any;
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
  onPreviewImg?: (e: React.MouseEvent<HTMLDivElement>,row?:any) => void ;
}

const GetLogsContainer: React.FC<Props> = ({ id,onPreviewImg }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [totalRow, setTotalRow] = useState<number>(0);
  const [listDetailGetLogs, setListDetailGetLogs] = useState([]);


  useEffect(() => {
    const payload = { filter: { id: +id } };
    dispatch(
      getLog(payload, (status, response) => {
        if (status) {
          setListDetailGetLogs(response);
          setTotalRow(response.length);
        }
      })
    );
  }, []);

  return (
    <div className='update-ticket-container'>
      <DataTableGetLogs t={t} data={listDetailGetLogs} onPreviewImg={onPreviewImg} totalFilter={totalRow} />
    </div>
  );
};

export default GetLogsContainer;
