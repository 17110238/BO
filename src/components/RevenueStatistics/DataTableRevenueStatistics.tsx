// import DataTableCustom from 'components/common/Datatable/DatatableCusTomFooter';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { FilterMerchantReportCrossCheck, FilterMerchantReportCrossCheckInput, FilterSendMerchantReportCrossCheck, FilterSendMerchantReportCrossCheckInput, GetMerchantReportCrossCheckDataReponse, PayloadSearchMerchantRevenue, RevenueReport, SumRevenueReport } from 'models';
import numeral from 'numeral';
import React, { useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { loadingIndicatorCSS } from 'react-select/dist/declarations/src/components/indicators';
import { sendMailMerchantReportCrossCheck } from 'redux/actions';
import { getMerchantReportCrossCheck } from 'redux/actions/accountantAction';
import alert from 'utils/helpers/alert';
import ModalComporisan from './Modal/ModalComporisan';
import ModalSendMail from './Modal/ModalSendMail';

interface Props {
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchMerchantRevenue;
    getList: (payload: PayloadSearchMerchantRevenue) => void;
  };
  data: RevenueReport[] | [];
  onClickRow: (data: RevenueReport) => React.MouseEventHandler<HTMLDivElement>;
  finishedAt?: any
}

interface ShowModal {
  modalDetail: boolean,
  modalSendMail: boolean
}

const DataTableRevenueStatistics: React.FC<Props> = ({
  onClickRow,
  getDataList,
  data,
  finishedAt,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const sumReport = useSelector<any, SumRevenueReport>((state) => state.reportMerchant.sumReport);
  const [merchantCrossCheck, setMerchantCrossCheck] = useState<GetMerchantReportCrossCheckDataReponse>({})

  const genderMoneyClass = (data?: number) => {
    return data && data < 0 ? 'text-danger' : '';
  };

  const dispatch = useDispatch()

  const [showModal, setShowModal] = useState<ShowModal>({
    modalDetail: false,
    modalSendMail: false
  })

  const [mcId, setMcId] = useState<any>(null)
  const [emailMc, setEmailMc] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetMerchantReportCrossCheck = (merchantId: number) => {
    const payload: FilterMerchantReportCrossCheckInput = {
      filter: {
        merchantId,
        finishedAt,
      }
    }
    setLoading(true)
    dispatch(
      getMerchantReportCrossCheck(payload, (state, res) => {
        if (state) {
          setMerchantCrossCheck(res)
        }
        setLoading(false)
      })
    )
  }
  const onHide = (name: string) => {
    setShowModal({
      ...showModal,
      [name]: false
    })
    setEmailMc('')
    setMcId(null)
    setMerchantCrossCheck({})
  }

  const handleSendMail = (email: string[]) => {
    const payload: FilterSendMerchantReportCrossCheckInput = {
      filter: {
        merchantId: mcId,
        email,
        finishedAt
      }
    }
    dispatch(
      sendMailMerchantReportCrossCheck(payload, (state, res) => {
        if (state) {
          alert('success', res.message, t);
          onHide('modalSendMail')
          setEmailMc('')
          setMcId(null)
        } else {
          alert('error', res.message, t);
          setEmailMc('')
          setMcId(null)
        }
      })
    )
  }



  const columns: TableColumn<RevenueReport>[] = useMemo(
    () => [
      {
        name: t('Merchant ID'),
        minWidth: '100px',
        maxWidth: '110px',
        footer: 'Tổng',
        cell: (row, index) => {
          return <div>{row?.merchantId}</div>;
        },
      },
      {
        name: t('Tên đối tác'),
        minWidth: '80px',
        right: true,
        footerName: 'Tổng đối tác',
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(sumReport?.totalMerchant).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right ml-auto highlight-text' onClick={onClickRow(row)}>
              {row?.title || '-'}
            </div>
          );
        },
      },
      {
        name: t('Tổng thanh toán (VND)'),
        minWidth: '175px',
        maxWidth: '210px',
        right: true,
        footerName: 'Tổng thanh toán',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              sumReport?.totalPayment
            )}`}>
            {numeral(sumReport?.totalPayment).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.totalPayment ? numeral(row?.totalPayment).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng giá trị nạp (VND)'),
        minWidth: '175px',
        maxWidth: '210px',
        right: true,
        footerName: 'Tổng giá trị nạp',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              sumReport?.totalTopup
            )}`}>
            {numeral(sumReport?.totalTopup).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.totalTopup ? numeral(row?.totalTopup).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng phí (VND)'),
        right: true,
        minWidth: '170px',
        maxWidth: '200px',
        footerName: 'Tổng phí',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              sumReport?.fee
            )}`}>
            {numeral(sumReport?.fee).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => (
          <div className='text-right w-100'>{row?.fee ? numeral(row?.fee).format('0,0') : '0'}</div>
        ),
      },
      {
        name: t('Tổng số giao dịch'),
        right: true,
        minWidth: '140px',
        maxWidth: '180px',
        footerName: 'Tổng số giao dịch',
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(sumReport?.count).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.count ? numeral(row?.count).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng đối soát (VND)'),
        right: true,
        minWidth: '120px',
        maxWidth: '250px',
        footerName: 'Tổng đối soát',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              sumReport?.crossCheckTotal
            )}`}>
            {numeral(sumReport?.crossCheckTotal).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.crossCheckTotal ? numeral(row?.crossCheckTotal).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Số giao dịch đối soát'),
        right: true,
        minWidth: '150px',
        maxWidth: '200px',
        footerName: 'Tổng giao dịch đối soát',
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(sumReport?.crossCheckCount).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.crossCheckCount ? numeral(row?.crossCheckCount).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '150px',
        maxWidth: '200px',
        footer: (
          <></>
        ),
        cell: (row, index) => {
          return (
            <Dropdown>
              <Dropdown.Toggle
                className='p-0 w-100'
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)',
                }}
                id='dropdown-menu-align-end'>
                <div className='d-flex justify-content-center w-100'>
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item onClick={() => {
                  handleGetMerchantReportCrossCheck(row?.merchantId!)
                  setShowModal({
                    ...showModal,
                    modalDetail: true
                  })
                }}>
                  <i className="fas fa-solid fa-eye fa-lg mr-2"></i>
                  {t('Xem')}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  setShowModal({
                    ...showModal,
                    modalSendMail: true
                  })
                  setMcId(row?.merchantId)
                  setEmailMc(row?.email!)
                }}>
                  <i className="fas fa-solid fa-envelope fa-lg mr-2"></i>
                  {t('Gửi mail')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [lang, sumReport]
  );

  return (
    <>
      <DataTableCustom
        hasFooter
        className='data-table-custom revenue-statistics__datatable'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
      // {...{ disableFixHeight: true }}
      />
      {
        showModal.modalDetail && (
          <ModalComporisan
            merchantCrossCheck={merchantCrossCheck}
            showModalDetail={showModal?.modalDetail}
            onHide={onHide}
            finishedAt={finishedAt}
            loading={loading}
          />
        )
      }
      {
        showModal.modalSendMail && (
          <ModalSendMail
            showModalSendEmail={showModal.modalSendMail}
            onHide={onHide}
            handleSendMail={handleSendMail}
            email={emailMc}
          />
        )
      }
      {/* { loading && <LoadingFullScreen />} */}
    </>
  );
};

export default DataTableRevenueStatistics;
