import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  t: (a: string) => string;
  data: [];
}

const DataTableReportTransaction: React.FC<Props> = ({}) => {
  const { t } = useTranslation('common');
  return (
    <div className='reportTransaction-content'>
      <table className='reportTransaction-content__tableFixed'>
        <tbody>
          <tr className='tableFixed-head'>
            <td style={{ minHeight: '54px'}}></td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Tổng Ví')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Nạp')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Rút')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Chuyển')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>{t('Chuyển Ví')}</td>
          </tr>
          <tr>
            <td>{t('Nhận tiền')}</td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('TT Dịch Vụ')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Hoàn Tiền')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Tiền khóa')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Số GD Nạp')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Số GD rút')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Số GD chuyển')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span>{t('Số GD Chuyển Ví')}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{t('Số GD Nhận Chuyển Ví')}</span>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Số GD TT Dịch Vụ')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <i className='fa fa-plus mr-3'></i>
                <span>{t('Số GD Hoàn Tiền')}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span>{t('CheckSum')}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className='overflow-table'>
        <table className='reportTransaction-content__table'>
          <tbody>
            <tr>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
              <th className='table-fixedHead'>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
            <tr>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
              <th>12/2020</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableReportTransaction;
