import _ from 'lodash';
import { EWalletBankReport, UserInfoBankReportType } from 'models';
import numeral from 'numeral';
import { useMemo } from 'react';
import { ReportEwalletDetail } from '../BankReportFormContainer';
import Datatable from '../dataTable/Datatable';
import DatatableBasic from '../dataTable/DatatableBasic';
import DatatableHeaderLeft from '../dataTable/DatatableHeaderLeft';
import {
  defaultHeaderContactBank,
  defaultHeaderTop5MerchantValueTransaction,
  defaultHeaderTopTransCustomer,
  defaultLabelAllStatusTranSystem,
  defaultLabelHeaderUserInfo,
  defaultLabelStatusTrans,
  defaultLabelStatusTransCustomer,
  defaultLabelUserInfo,
} from '../utils/defaultLabel';
import {
  arrKeyTopTransCustomer,
  defaultKeysAllStatusTransSystem,
  defaultKeysStatusTransCustomer,
  defaultKeysUserBusinessInfo,
  defaultKeysUserInfo,
  defaultKeysUserPersonalInfo,
  objectKeysStatusTrans,
} from '../utils/objectKeys';

export const tableReport = (
  merchantReport: EWalletBankReport,
  ewalletReport: EWalletBankReport,
  billReport: EWalletBankReport,
  detailReport: ReportEwalletDetail
) => {
  const arrayUserInfo = useMemo(() => {
    if (!Object.keys(ewalletReport?.userInfo || {}).length) return [];

    return defaultLabelHeaderUserInfo.map((label: string, index: number) => {
      const keyPersonal = defaultKeysUserPersonalInfo[(index + 1) as keyof {}];
      const keyBusiness = defaultKeysUserBusinessInfo[(index + 1) as keyof {}];
      return {
        label,
        userPersonal:
          ewalletReport.userInfo &&
          ewalletReport.userInfo[keyPersonal as keyof UserInfoBankReportType],
        userBusiness:
          ewalletReport.userInfo &&
          ewalletReport.userInfo[keyBusiness as keyof UserInfoBankReportType],
      };
    });
  }, [ewalletReport.userInfo]);

  return [
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '1. Dịch vụ cổng thanh toán điện tử',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '1.1 Tình hình cung ứng dịch vụ',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '1.1.1 Thông tin đối tác',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-1',
      target: 'Ngân hàng hợp tác',
      detail: (
        <div className='w-100'>
          <p className='my-3 d-flex'>
            Tổng số ngân hàng hợp tác:{' '}
            <span className='ml-auto highlight-text font-weight-bold highlight-number-table'>
              {numeral(merchantReport.coopBank?.total).format('0,0')}
            </span>
          </p>
          <Datatable
            defaultHeader={defaultHeaderContactBank}
            data={merchantReport?.coopBank?.data?.map((item) => _.omit(item, 'id')) || []}
          />
        </div>
      ),
      note: '',
    },
    {
      heading: 'G-2',
      target: 'Đơn vị chấp nhận thanh toán (ĐVCNTT)',
      detail: (
        <p className='ml-auto highlight-number-table'>
          <span className='ml-auto highlight-text font-weight-bold '>
            {numeral(merchantReport?.totalMerchant).format('0,0')}
          </span>
        </p>
      ),
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '1.1.2 Tình hình giao dịch',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-3 G-4 G-5 G-6',
      target: {
        colspan: 2,
        value: (
          <DatatableHeaderLeft
            headerKey='month'
            defaultLabel={defaultLabelStatusTrans}
            objectKeys={objectKeysStatusTrans}
            data={merchantReport?.transaction || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-7',
      target: {
        colspan: 2,
        value: '05 ĐVCNTT có số lượng giao dịch nhiều nhất trong kỳ báo cáo',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <>
            <Datatable
              defaultHeader={defaultHeaderTop5MerchantValueTransaction}
              data={merchantReport?.topCount?.map((item) => _.omit(item, 'merchantId')) || []}
            />
          </>
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-8',
      target: {
        colspan: 2,
        value: '05 ĐVCNTT có giá trị giao dịch nhiều nhất trong kỳ báo cáo',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <Datatable
            defaultHeader={defaultHeaderTop5MerchantValueTransaction}
            data={merchantReport?.topAmount?.map((item) => _.omit(item, 'merchantId')) || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '1.2 Tình hình rủi ro',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '1.2.1 Rủi ro vận hành',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-1',
      target: 'Khoảng thời gian xảy ra sự cố',
      detail: '',
      note: '',
    },
    {
      heading: 'R-2',
      target: 'Số lượng giao dịch liên quan đến sự cố',
      detail: '',
      note: '',
    },
    {
      heading: 'R-3',
      target: 'Giá trị giao dịch liên quan đến sự cố',
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '1.2.2 Rủi ro gian lận, giả mạo',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-4',
      target: 'Số lượng giao dịch liên quan đến các vụ việc phát sinh rủi ro',
      detail: '',
      note: '',
    },
    {
      heading: 'R-5',
      target: 'Giá trị giao dịch liên quan đến vụ các việc phát sinh rủi ro',
      detail: '',
      note: '',
    },
    {},
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2 Dịch vụ ví điện tử',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.1 Tình hình cung ứng dịch vụ',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.1.1 Thông tin đối tác',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-1',
      target: 'Thông tin Ví điện tử',
      detail: (
        <div className='w-100'>
          <p className='my-1 d-flex'>
            Tên Ví điện tử:
            <span
              className='ml-auto highlight-text font-weight-bold highlight-number-table'
              style={{ minWidth: '200px' }}>
              PayME
            </span>
          </p>
          <p className='my-1 d-flex'>
            Tên ứng dụng:
            <span
              className='ml-auto highlight-text font-weight-bold highlight-number-table'
              style={{ minWidth: '200px' }}>
              Ví điện tử PayMe
            </span>
          </p>
          <p className='my-1 d-flex'>
            Địa chỉ trang thông tin điện tử được sử dụng để cung cấp dịch vụ Ví điện tử:
            <span
              className='ml-auto highlight-text font-weight-bold highlight-number-table'
              style={{ minWidth: '200px' }}>
              https://payme.vn
            </span>
          </p>
        </div>
      ),
      note: '',
    },
    {
      heading: 'G-2',
      target: 'Ngân hàng hợp tác',
      detail: (
        <div className='w-100'>
          <p className='my-3 d-flex'>
            Tổng số ngân hàng hợp tác:{' '}
            <span className='ml-auto highlight-text font-weight-bold highlight-number-table'>
              {numeral(ewalletReport.coopBank?.total).format('0,0')}
            </span>
          </p>
          <Datatable
            defaultHeader={defaultHeaderContactBank}
            data={ewalletReport?.coopBank?.data?.map((item) => _.omit(item, 'id')) || []}
          />
        </div>
      ),
      note: '',
    },
    {
      heading: 'G-3 G-4 G-5',
      target: {
        colspan: 2,
        value: (
          <DatatableHeaderLeft
            headerKey='label'
            defaultLabel={defaultLabelUserInfo}
            objectKeys={defaultKeysUserInfo}
            data={arrayUserInfo || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.1.2 Tình hình giao dịch',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.1.2.1 Giao dịch toàn hệ thống',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-6 G-7 G-8 G-9 G-10 G-11 G-12 G-13 G-14 G-15 G-16 G-17',
      target: {
        colspan: 2,
        value: (
          <DatatableHeaderLeft
            headerKey='month'
            defaultLabel={defaultLabelAllStatusTranSystem}
            objectKeys={defaultKeysAllStatusTransSystem}
            data={ewalletReport.transaction || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.1.2.2 Giao dịch của khách hàng tổ chức (không bao gồm ĐVCNTT)',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-18 G-19 G-20 G-21 G-22 G-23 G-24 G-25',
      target: {
        colspan: 2,
        value: (
          <DatatableHeaderLeft
            headerKey='month'
            defaultLabel={defaultLabelStatusTransCustomer}
            objectKeys={defaultKeysStatusTransCustomer}
            data={detailReport?.reportBusiness?.transaction || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-26',
      target: {
        colspan: 2,
        value:
          'Giao dịch của khách hàng là tổ chức (không bao gồm ĐVCNTT) có số lượng giao dịch nhiều nhất',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <DatatableBasic
            defaultHeader={defaultHeaderTopTransCustomer}
            keyArray={arrKeyTopTransCustomer}
            data={detailReport?.reportBusiness?.topCount || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-27',
      target: {
        colspan: 2,
        value:
          'Giao dịch của khách hàng là tổ chức (không bao gồm ĐVCNTT) có giá trị giao dịch nhiều nhất',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <DatatableBasic
            defaultHeader={defaultHeaderTopTransCustomer}
            keyArray={arrKeyTopTransCustomer}
            data={detailReport?.reportBusiness?.topAmount || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.1.2.3 Giao dịch của khách hàng cá nhân (không bao gồm ĐVCNTT)',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-28 G-29 G-30 G-31 G-32 G-33 G-34 G-35',
      target: {
        colspan: 2,
        value: (
          <DatatableHeaderLeft
            headerKey='month'
            defaultLabel={defaultLabelStatusTransCustomer}
            objectKeys={defaultKeysStatusTransCustomer}
            data={detailReport?.reportPersonal?.transaction || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-36',
      target: {
        colspan: 2,
        value:
          'Giao dịch của khách hàng cá nhân (không bao gồm ĐVCNTT) có số lượng giao dịch nhiều nhất',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <DatatableBasic
            defaultHeader={[...defaultHeaderTopTransCustomer].fill(
              {
                name: 'Số CMND/CCCD',
                option: { rowSpan: 2 },
              },
              2,
              3
            )}
            keyArray={arrKeyTopTransCustomer}
            data={detailReport?.reportPersonal?.topCount || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-37',
      target: {
        colspan: 2,
        value:
          'Giao dịch của khách hàng cá nhân (không bao gồm ĐVCNTT) có giá trị giao dịch nhiều nhất',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <DatatableBasic
            defaultHeader={[...defaultHeaderTopTransCustomer].fill(
              {
                name: 'Số CMND/CCCD',
                option: { rowSpan: 2 },
              },
              2,
              3
            )}
            keyArray={arrKeyTopTransCustomer}
            data={detailReport?.reportPersonal?.topAmount || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.1.2.4 Giao dịch của ĐVCNTT',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-38 G-39 G-40 G-41 G-42 G-43 G-44 G-45',
      target: {
        colspan: 2,
        value: (
          <DatatableHeaderLeft
            headerKey='month'
            defaultLabel={defaultLabelStatusTransCustomer}
            objectKeys={defaultKeysStatusTransCustomer}
            data={new Array(13).fill(null).map((item, index) => {
              if (index === 0) {
                return {
                  month: `Tháng ${index + 1}`,
                  successCount: 'Không phát sinh',
                  successAmount: 'Không phát sinh',
                  paymentCount: 'Không phát sinh',
                  paymentAmount: 'Không phát sinh',
                  depositCount: 'Không phát sinh',
                  depositAmount: 'Không phát sinh',
                  withdrawCount: 'Không phát sinh',
                  withdrawAmount: 'Không phát sinh',
                };
              }
              if (index === 12) {
                return {
                  month: 'Tổng cộng',
                };
              }
              return {
                month: `Tháng ${index + 1}`,
              };
            })}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-46',
      target: {
        colspan: 2,
        value: 'Giao dịch của ĐVCNTT có số lượng giao dịch nhiều nhất',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <DatatableBasic
            defaultHeader={[...defaultHeaderTopTransCustomer].fill(
              {
                name: 'Số ĐKKD/CMND/CCCD',
                option: { rowSpan: 2 },
              },
              2,
              3
            )}
            keyArray={arrKeyTopTransCustomer}
            data={[{ fullname: 'Không phát sinh' }]}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-47',
      target: {
        colspan: 2,
        value: 'Giao dịch của ĐVCNTT có giá trị giao dịch nhiều nhất',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        value: (
          <DatatableBasic
            defaultHeader={[...defaultHeaderTopTransCustomer].fill(
              {
                name: 'Số ĐKKD/CMND/CCCD',
                option: { rowSpan: 2 },
              },
              2,
              3
            )}
            keyArray={arrKeyTopTransCustomer}
            data={[{ fullname: 'Không phát sinh' }]}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.2 Tình hình rủi ro',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.2.1 Rủi ro vận hành',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-1',
      target: 'Khoảng thời gian xảy ra sự cố',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: 'R-2',
      target: 'Số lượng giao dịch liên quan đến sự cố',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: 'R-3',
      target: 'Giá trị giao dịch liên quan đến sự cố',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.2.2 Rủi ro gian lận, giả mạo',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-4',
      target: 'Số lượng giao dịch liên quan đến các vụ việc phát sinh rủi ro',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: 'R-5',
      target: 'Giá trị giao dịch liên quan đến các vụ việc phát sinh rủi ro',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.2.3 Rủi ro thanh khoản',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-6',
      target: 'Số dư tài khoản đảm bảo thanh toán',
      detail: '',
      note: '',
    },
    {
      heading: 'R-7',
      target: 'Tổng số dư Ví điện tử',
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '2.2.4 Các chỉ tiêu khác',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'O-1',
      target: 'Số lượng Ví điện tử đã phát hành',
      detail: '',
      note: '',
    },
    {
      heading: 'O-2',
      target: 'Số lượng Ví điện tử đã kích hoạt',
      detail: '',
      note: '',
    },
    {
      heading: 'O-3',
      target: 'Số lượng Ví điện tử đang hoạt động',
      detail: '',
      note: '',
    },
    {},
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3 Dịch vụ hỗ trợ thu hộ, chi hộ',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3.1 Tình hình cung ứng dịch vụ',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3.1.1 Thông tin đối tác',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-1',
      target: 'Ngân hàng hợp tác',
      detail: (
        <div className='w-100'>
          <p className='my-3 d-flex'>
            Tổng số ngân hàng hợp tác:{' '}
            <span className='ml-auto highlight-text font-weight-bold highlight-number-table'>
              {numeral(billReport?.coopBank?.total).format('0,0')}
            </span>
          </p>
          <Datatable
            defaultHeader={defaultHeaderContactBank}
            data={billReport?.coopBank?.data?.map((item) => _.omit(item, 'id')) || []}
          />
        </div>
      ),
      note: '',
    },
    {
      heading: 'G-2',
      target: 'Đơn vị chấp nhận thanh toán (ĐVCNTT)',
      detail: (
        <p className='ml-auto highlight-number-table'>
          <span className='ml-auto highlight-text font-weight-bold '>
            {numeral(billReport?.totalMerchant).format('0,0')}
          </span>
        </p>
      ),
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3.1.2 Tình hình giao dịch',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'G-3 G-4 G-5 G-6',
      target: {
        colspan: 2,
        value: (
          <DatatableHeaderLeft
            headerKey='month'
            defaultLabel={defaultLabelStatusTrans}
            objectKeys={objectKeysStatusTrans}
            data={billReport?.transaction || []}
          />
        ),
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3.2 Tình hình rủi ro',
      },
      detail: '',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3.2.1 Rủi ro vận hành',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-1',
      target: 'Khoảng thời gian xảy ra sự cố',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: 'R-2',
      target: 'Số lượng giao dịch liên quan đến sự cố',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: 'R-3',
      target: 'Giá trị giao dịch liên quan đến sự cố',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3.2.2 Rủi ro gian lận, giả mạo',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-4',
      target: 'Số lượng giao dịch liên quan đến các vụ việc phát sinh rủi ro',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: 'R-5',
      target: 'Giá trị giao dịch liên quan đến các vụ việc phát sinh rủi ro',
      detail: 'Không phát sinh',
      note: '',
    },
    {
      heading: '',
      target: {
        colspan: 2,
        style: { fontWeight: 'bold' },
        value: '3.2.3 Rủi ro thanh khoản',
      },
      detail: '',
      note: '',
    },
    {
      heading: 'R-5',
      target: 'Biện pháp đảm bảo khả năng thanh toán',
      detail:
        'Là các hình thức đảm bảo thanh toán theo quy định của Ngân hàng Nhà nước cho hoạt động hỗ trợ thu hộ, chi hộ (số dư tài khoản đảm bảo thanh toán, chứng thư bảo lãnh, …).',
      note: '',
    },
  ];
};
