import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useTranslation } from 'react-i18next';

interface ReactTree {
  checked: string[];
  expanded: string[];
}

export default function StoreMemberScopeContainer() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isCheckTree, setCheckTree] = useState<ReactTree>({
    checked: ['002', '003'],
    expanded: ['000', '004', '005', '016', '022', '010', '007'],
  });
  const data = [
    {
      value: '000',
      label: 'TẤT CẢ PHƯƠNG THỨC',
      children: [
        { value: '001', label: 'Ví PayME', checked: true },
        { value: '002', label: 'Thẻ ATM', checked: true },
        { value: '003', label: 'Chuyển Khoản', checked: true },
        { value: '004', label: 'QR Pay', checked: true },
        { value: '005', label: 'Thai QR', checked: true },
        { value: '006', label: 'VIETQR', checked: true },
        {
          value: '007',
          label: 'Alipay',
          children: [
            {
              value: '008',
              label: 'Alipay (Online)',
              checked: true,
            },
            {
              value: '009',
              label: 'Alipay (Ofline)',
              checked: true,
            },
          ],
        },
        {
          value: '010',
          label: 'Store',
          checked: true,
          children: [
            { value: '011', label: 'Xem store', checked: true },
            { value: '012', label: 'Thêm store', checked: true },
            { value: '013', label: 'Sửa store', checked: true },
          ],
        },
        {
          value: '016',
          label: 'Transaction',
          checked: true,
          children: [
            { value: '017', label: 'Xem giao dịch', checked: true },
            { value: '018', label: 'Thêm giao dịch', checked: true },
            { value: '019', label: 'Giao dịch tại quầy', checked: true },
            { value: '020', label: 'Hủy giao dịch', checked: true },
            { value: '021', label: 'Hoàn tiền giao dịch', checked: true },
          ],
        },
        {
          value: '022',
          label: 'Transaction',
          checked: true,
          children: [
            { value: '023', label: 'Xem giao dịch', checked: true },
            { value: '024', label: 'Thêm giao dịch', checked: true },
            { value: '025', label: 'Giao dịch tại quầy', checked: true },
            { value: '026', label: 'Hủy giao dịch', checked: true },
            { value: '027', label: 'Hoàn tiền giao dịch', checked: true },
          ],
        },
      ],
    },
  ];
  return (
    <>
      <div className='storeDetail-container'>
        <div className='storeDetail-header'>
          <div className='btn-back'>
            <button
              onClick={() =>
                router.push(`/cong-thanh-toan/quan-ly-cua-hang/delegate/${router.query?.storeId}`)
              }>
              <i className='fas fa-arrow-left btn-back__icon'></i>
              Trở về
            </button>
          </div>
        </div>
        <div className='storeDetail-member__content'>
          <div className='storeDetail-member__header'>
            <div className='header-left'>
              <p>{t('Phân quyền cho nhân viên')}</p>
            </div>
          </div>
          <div className='storeDetail-member__scope'>
            <div className='inputs-group inputs-group-custom'>
              <div className='methods-ctt-merchant methods-ctt-custom'>
                <CheckboxTree
                  icons={{
                    check: <i className='icon-checkbox-custom icon-checkbox-custom--check'></i>,
                    uncheck: <i className='icon-checkbox-custom icon-checkbox-custom--uncheck'></i>,
                    halfCheck: (
                      <i className='icon-checkbox-custom icon-checkbox-custom--halfcheck'></i>
                    ),
                  }}
                  checked={isCheckTree.checked}
                  expanded={isCheckTree.expanded}
                  onCheck={(value) => {
                    console.log(value);
                    setCheckTree({ ...isCheckTree, checked: value });
                  }}
                  onExpand={(value) => setCheckTree({ ...isCheckTree, expanded: value })}
                  iconsClass='fa5'
                  nodes={data}></CheckboxTree>
              </div>
            </div>
            <div className='storeDetail-memberScope__btn'>
              <button className='btn btn-primary mt-5'>{t('Cập nhật')}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
