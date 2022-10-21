import { EwalletAccount } from 'models/merchantInfo/merchantInfoState';
import React, { FC } from 'react';
import dayjs from 'dayjs';
import formatCurrency from 'utils/helpers/formatCurrency';
import { formatPhone } from 'utils/helpers';
import { useTranslation } from 'react-i18next';

interface Props {
  customerPayload: EwalletAccount[];
}

const DepositWithdrawUserTable: FC<Props> = ({ customerPayload }) => {
  const { t } = useTranslation('common');
  const customerPayloadObj = customerPayload[0];
  return (
    <div className='table-container'>
      <h5>Thông tin khách hàng</h5>
      <table className='customer-table'>
        <tr>
          <td>ID</td>
          <td>{customerPayloadObj.id}</td>
        </tr>
        <tr>
          <td>Họ và tên</td>
          <td>{customerPayloadObj.fullname}</td>
        </tr>
        <tr>
          <td>Số điện thoại</td>
          <td>{formatPhone(customerPayloadObj.phone, '')}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{customerPayloadObj.email}</td>
        </tr>
        <tr>
          <td>Ngày sinh</td>
          <td>
            {customerPayloadObj.birthday && dayjs(customerPayloadObj.birthday).format('DD/MM/YYYY')}
          </td>
        </tr>
        <tr>
          <td>Giới tính</td>
          <td>{t(customerPayloadObj.gender)}</td>
        </tr>
        <tr>
          <td>Thời điểm đăng ký</td>
          <td>
            {customerPayloadObj.createdAt &&
              dayjs(customerPayloadObj.createdAt).format('DD/MM/YYYY, HH:mm')}
          </td>
        </tr>
        <tr>
          <td>Thời điểm đăng nhập cuối</td>
          <td>
            {customerPayloadObj.lastedLoginAt &&
              dayjs(customerPayloadObj.lastedLoginAt).format('DD/MM/YYYY, HH:mm')}
          </td>
        </tr>
        <tr>
          <td>Trạng thái</td>
          <td>{t(customerPayloadObj.state)}</td>
        </tr>
        <tr>
          <td>Trạng thái hoạt động</td>
          <td style={{ color: customerPayloadObj.isActive ? 'green' : 'red' }}>
            {customerPayloadObj.isActive ? 'Hoạt động' : 'Không hoạt động'}
          </td>
        </tr>
        <tr>
          <td>Số dư ví</td>
          <td style={{ color: '#116112' }}>{formatCurrency(customerPayloadObj.balance)}</td>
        </tr>
      </table>
    </div>
  );
};

export default DepositWithdrawUserTable;
