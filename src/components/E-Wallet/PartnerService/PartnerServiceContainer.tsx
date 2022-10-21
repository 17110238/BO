import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import {
  EwalletGateReportReponsed,
  GetBankReportInput,
  GetBankReportReponsed,
  GetEwalletGateReportInput,
  GetEwalletHistoryReportInput,
  GetEwalletHistoryReportType,
  GetEwalletServiceBillReportInput,
  GetEwalletServiceBillReportResponed,
  GetEwalletSsccReportInput,
  GetEwalletSsccReportType,
} from 'models/ewalletPartnerService';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBankReport,
  getEwalletGateReport,
  getEwalletHistoryReport,
  getEwalletServiceBillReport,
  getEwalletSsccReport,
} from 'redux/actions/ewalletPartnerService';
import BoxSearchPartnerService from './BoxSearchPartnerService';
import DataTable from './DataTable';
import DataTableFooter from './DataTableFooter';
import DataTableGroup from './DataTableGroup';
import HeaderPartnerService from './HeaderPartnerService';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import MainLayout from 'layouts/MainLayout';
import LoadingInline from 'components/common/Loading/LoadingInline';
dayjs.extend(utc);

interface Props {}

const PartnerServiceContainer: React.FC<Props> = ({}) => {
  const [showFilter, setShowFilter] = useState<boolean>(true);

  const { t } = useTranslation('common');
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [ewalletPartnerService, setEwalletPartnerService] =
    useState<GetEwalletServiceBillReportResponed>({});
  const [ewalletGateReport, setEwalletGateReport] = useState<EwalletGateReportReponsed>({});
  const [bankReport, setBankReport] = useState<GetBankReportReponsed>({});
  const [historyReport, setHistoryReport] = useState<GetEwalletHistoryReportType[]>([]);
  const [ssccReport, setSsccReport] = useState<GetEwalletSsccReportType[]>([])
  const [type, setType] = useState<string>('ESTIO');
  const [filter, setFilter] = useState<any>({
    gateway: type,
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const router: any = useRouter();

  const isLoading = useSelector<any, boolean>((state) => state.EwalletPartnerService.loading);

  const toggleFilter = () => setShowFilter(!showFilter);

  const formatDataSearch = (data: any) => {
    const dataCopy: any = { ...data };
    dataCopy.createdAt &&
      Object.keys(dataCopy?.createdAt).forEach(
        (key) => !dataCopy.createdAt[key] && delete dataCopy.createdAt[key]
      );

    Object.keys(dataCopy).forEach((key) => !dataCopy[key] && delete dataCopy[key]);

    return dataCopy;
  };

  const handleSubmitSearch = (data: any) => {
    const newData = formatDataSearch(data);
    if (type === 'ESTIO' || type === 'OCB') {
      setFilter({ ...newData, gateway: type });
    } else if (type === 'PVCOMBANK' || type === 'NAPAS') {
      setFilter({ ...newData, supplierName: newData?.gateway });
    } else if (type === 'PAY_QRCODE') {
      setFilter({ ...newData, serviceCode: newData?.gateway });
    } else {
      setFilter(newData);
    }
  };

  // Handle Ewallet Service Bill Report
  const handleEwalletServiceBillReport = (data: any) => {
    const payload: GetEwalletServiceBillReportInput = {
      createdAt: filter?.createdAt || {},
      gateway: filter?.gateway || data,
    };
    setBtnLoading(true);
    dispatch(
      getEwalletServiceBillReport(payload, (state, res) => {
        setLoadingTable(false);
        setEwalletPartnerService(res);
        setBtnLoading(false);
      })
    );
  };

  // Handle Ewallet Gate Report
  const handleEwalletGateReport = () => {
    const payload: GetEwalletGateReportInput = {
      createdAt: filter?.createdAt,
    };
    setBtnLoading(true);
    dispatch(
      getEwalletGateReport(payload, (state, res) => {
        setLoadingTable(false);
        setEwalletGateReport(res);
        setBtnLoading(false);
      })
    );
  };

  // Handle Bank Report
  const handleBankReport = () => {
    const payload: GetBankReportInput = {
      createdAt: filter?.createdAt,
      supplierName: filter?.supplierName,
    };
    setBtnLoading(true);
    dispatch(
      getBankReport(payload, (state, res) => {
        setLoadingTable(false);
        setBankReport(res);
        setBtnLoading(false);
      })
    );
  };

  // Handle History Report
  const handleHistoryReport = (data?: string) => {
    const payload: GetEwalletHistoryReportInput = {
      createdAt: filter?.createdAt,
      serviceCode: filter?.serviceCode || data,
    };
    setBtnLoading(true);
    dispatch(
      getEwalletHistoryReport(payload, (state, res) => {
        setLoadingTable(false);
        setHistoryReport(res);
        setBtnLoading(false);
      })
    );
  };

  // handle Sscc Report
  const handleSsccReport = () => {
    const payload: GetEwalletSsccReportInput = {
      createdAt: filter?.createdAt
    };
    setBtnLoading(true);
    dispatch(
      getEwalletSsccReport(payload, (state, res) => {
        setLoadingTable(false);
        setSsccReport(res);
        setBtnLoading(false);
      })
    );
  };

  useEffect(() => {
    if (router?.query?.gateway) {
      setType(router?.query?.gateway);
    }
  }, []);

  useEffect(() => {
    switch (type) {
      case 'ESTIO':
        handleEwalletServiceBillReport(type);
        break;
      case 'OCB':
        handleEwalletServiceBillReport(type);
        break;
      case 'SSCC' :
        handleSsccReport()
        break;
      case 'PVCOMBANK':
        handleBankReport();
        break;
      case 'NAPAS':
        handleBankReport();
        break;
      case 'PAY_QRCODE':
        handleHistoryReport('PAY_QRCODE');
        break;
      default:
        handleEwalletGateReport();
        break;
    }
  }, [filter]);

  const handleChangeType = (data: any) => {
    setType(data);
    switch (data) {
      case 'ESTIO':
        setFilter({ ...filter, gateway: data });
        //handleEwalletServiceBillReport()
        break;
      case 'OCB':
        setFilter({ ...filter, gateway: data });
        //handleEwalletServiceBillReport()
        break;
      case 'PVCOMBANK':
        setFilter({ ...filter, supplierName: data });
        //handleBankReport()
        break;
      case 'NAPAS':
        setFilter({ ...filter, supplierName: data });
        //handleBankReport()
        break;
      case 'PAY_QRCODE':
        setFilter({ ...filter, serviceCode: data });
        //handleHistoryReport(data)
        break;
      case 'SSCC' : 
        setFilter({ ...filter });
      default:
        setFilter({ ...filter });
        //handleEwalletGateReport()
        break;
    }
  };

  return (
    <>
      {/* <MainLayout> */}
      <div className='partner-service-container box-payment'>
        <HeaderPartnerService showFilter={showFilter} toggleFilter={toggleFilter} />
        {showFilter && (
          <BoxSearchPartnerService
            onChangeType={handleChangeType}
            handleSubmitSearch={handleSubmitSearch}
            loading={btnLoading}
          />
        )}
        {type === 'ESTIO' || type === 'OCB' ? (
          <DataTableFooter title={type} dataEwallet={ewalletPartnerService} isLoading={isLoading} />
        ) : type === 'PVCOMBANK' || type === 'NAPAS' || type === 'PAY_QRCODE' || type === 'SSCC' ? (
          <DataTable
            title={type}
            dataEwallet={type === 'PAY_QRCODE' ? historyReport : type === 'SSCC' ? ssccReport : bankReport}
            isLoading={isLoading}
          />
        ) : (
          <DataTableGroup title={type} dataEwallet={ewalletGateReport} isLoading={isLoading} />
        )}
      </div>
      {/* </MainLayout> */}
    </>
  );
};

export default PartnerServiceContainer;
