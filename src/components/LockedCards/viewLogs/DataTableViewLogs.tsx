import Nodata from 'components/common/NoData/Nodata';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  t: (a: string) => string;
  logs: any[];
  convertState: (state: string) => string;
}

function DataTableViewLogs({ logs, t, convertState }: Props) {
  return (
    <div className="data-table-view-logs">
      {logs?.length ? (
        <table className='table-view-logs'>
          <thead>
            <th>{t('Mã người dùng')}</th>
            <th>{t('Tên người dùng')}</th>
            <th>{t('Trạng thái')}</th>
            <th>{t('Thời gian')}</th>
          </thead>
          <tbody>
            {logs?.map((log: any) => (
              <tr>
                <td>{log?.accountId}</td>
                <td>{log?.fullName}</td>
                <td>
                  <div className={`state ${log?.state?.toLowerCase()}`}>{convertState(log?.state)}</div>
                </td>
                <td>{dayjs(log?.date).format('HH:mm:ss DD/MM/YYYY')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <Nodata imageDataEmpty='' messageDataEmpty='' />}
    </div>
  );
}

export default DataTableViewLogs;
