import { UserBo } from 'models/user/accountMerchant';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import {
  getListAccountSale, getMerchantQuantity,
  getReportMerchantAmount,
  getTopMerchantCategory
} from 'redux/actions';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchQuantityMerchant from './BoxSearchQuantityMerchant';
import ChartMerchantContainer from './ChartMerchantContainer';
import DataTableQuantityMerchant from './DataTableQuantityMerchant';
import HeaderQuantityMerchant from './HeaderQuantityMerchant';
import TopJobMerchantContainer from './TopJobMerchantContainer';
dayjs.extend(utc);

const COLORS = [
  '#52C9D9',
  '#52D954',
  '#D9D452',
  '#D97252',
  '#52B0D9',
  '#7D52D9',
  '#D95252',
  '#52D9B9',
  '#5270D9',
  '#D952BB',
];
enum ReportMerchantAmountEnum {
  WEEK = 'WEEK',
  DATE = 'DATE',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}
const RADIAN = Math.PI / 180;
export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      fontSize={11}
      dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const QuantityMerchantContainer = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();
  const squareRef = useRef();
  const [dataCateGory, setDataCateGory] = useState<any>();
  const [checkDisable, setCheckDisable] = useState<String>('');
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const [filter, setFilter] = useState<any>();
  const [dataMerchants, setDataMerchants] = useState<any[]>();
  const [totalRow, settotalRow] = useState<number>();
  const [typeDate, setTypeDate] = useState<String>('');
  const [indexTab, setIndexTab] = useState<number>(0);
  const [saleMembers, setSaleMembers] = useState<UserBo[]>([]);
  const loading = useSelector<any>((state) => state?.quanTityMerchantReducer?.loading);
  const [dataChart, setDataChart] = useState<any>();

  const handleSubmitSearch = (data: any | {}) => {
    const { operator, merchantId, categoryCode, createdAt } = data;
    if (!operator) {
      delete data.operator;
    }
    if (merchantId) {
      data.merchantId = +data.merchantId;
    }
    if (!merchantId || merchantId === '') {
      delete data.merchantId;
    }
    if (!categoryCode) {
      delete data.categoryCode;
    }

    const date1 = dayjs(data?.createdAt?.from);
    let dayBetween = Math.abs(date1.diff(data?.createdAt?.to, 'day', true));

    if (dayBetween > 365 * 5) {
      setIndexTab(3);
      setTypeDate(ReportMerchantAmountEnum.YEAR);
      setFilter({ ...data });
      setCheckDisable('YEARMAX');
      setSubmitForm(true);
      return;
    }

    if (dayBetween > 365) {
      setIndexTab(2);
      setTypeDate(ReportMerchantAmountEnum.MONTH);
      setFilter({ ...data });
      setCheckDisable('YEARMIN');
      setSubmitForm(true);
      return;
    }

    setCheckDisable('');
    setIndexTab(0);
    setTypeDate('');
    setFilter({ ...data });
    setSubmitForm(true);
  };

  const handleResetIndexTab = () => {
    setIndexTab(0);
  };

  const handleGetMerchants = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function getMerchants(payload: any) {
      dispatch(
        getMerchantQuantity({ filter: payload.filter, paging: payload?.paging }, (state, res) => {
          if (state) {
            setDataMerchants(res);
            settotalRow(res?.length);
          }
        })
      );

      setSubmitForm(false);
    }

    return {
      payload,
      getList: getMerchants,
      submitForm,
    };
  };

  useEffect(() => {
    let filterCheck = {};
    if (filter?.hasOwnProperty('createdAt')) {
      filterCheck = { ...filter };
    }
    if (!filter?.hasOwnProperty('createdAt')) {
      filterCheck = {
        ...filter,
        createdAt: {
          from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('date').utc().format(),
        },
      };
    }

    dispatch(
      getReportMerchantAmount(
        { ...filterCheck, type: typeDate || ReportMerchantAmountEnum.DATE },
        (state, res) => {
          if (state) {
            setDataChart(res);
          }
        }
      )
    );
  }, [typeDate, filter]);

  useEffect(() => {
    dispatch(
      getTopMerchantCategory({}, (state, res) => {
        if (state) {
          let dataTopCategory = res.map((data: any, index: any) => ({
            value: +data?.categoryCode,
            name: data?.category,
            color: COLORS[index],
          }));
          setDataCateGory(dataTopCategory);
        }
      })
    );
  }, []);

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        merchantId: +router.query?.merchantId!,
        operator: +router.query?.operator!,
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      });
      handleSubmitSearch(payload);
    }
  }, []);

  useEffect(() => {
    const payload = { filter: {} };
    dispatch(
      getListAccountSale(payload, (status, res) => {
        let saleMembersOption = res?.map((data: any) => ({
          value: data?.accountId,
          label: data?.fullname,
        }));
        saleMembersOption.shift();
        setSaleMembers(saleMembersOption);
      })
    );
  }, []);

  return (
    <div className='quantityMerchantContainer box-content'>
      <HeaderQuantityMerchant showFilter={showFilter} toggleFilter={toggleFilter} />
      {showFilter && (
        <BoxSearchQuantityMerchant
          loading={loading}
          typeDate={typeDate}
          showFilter={showFilter}
          submitForm={submitForm}
          setSubmitForm={setSubmitForm}
          handleSubmitSearch={handleSubmitSearch}
          boxSearchRef={squareRef}
          saleMembers={saleMembers}
          onResetIndexTab={handleResetIndexTab}
        />
      )}
      <Tabs defaultChecked={true} selectedIndex={indexTab} onSelect={(index) => setIndexTab(index)}>
        <TabList id='idTabListAc'>
          <div className='d-flex pd-3 h-100'>
            <Tab
              style={
                checkDisable === 'YEARMAX' || checkDisable === 'YEARMIN'
                  ? { pointerEvents: 'none', opacity: 0.5 }
                  : {}
              }
              onClick={() => {
                setTypeDate(ReportMerchantAmountEnum.DATE);
                setIndexTab(0);
              }}>
              <span style={{ fontWeight: `${0 === 0 ? 'bold' : ''}` }}>{t('Ngày')}</span>
            </Tab>
            <Tab
              style={
                checkDisable === 'YEARMAX' || checkDisable === 'YEARMIN'
                  ? { pointerEvents: 'none', opacity: 0.5 }
                  : {}
              }
              onClick={() => {
                setTypeDate(ReportMerchantAmountEnum.WEEK);
                setIndexTab(1);
              }}>
              <span style={{ fontWeight: `${1 === 1 ? 'bold' : ''}` }}>{t('Tuần')}</span>
            </Tab>
            <Tab
              style={checkDisable === 'YEARMAX' ? { pointerEvents: 'none', opacity: 0.5 } : {}}
              onClick={() => {
                setTypeDate(ReportMerchantAmountEnum.MONTH);
                setIndexTab(2);
              }}>
              <span style={{ fontWeight: `${2 === 2 ? 'bold' : ''}` }}>{t('Tháng')}</span>
            </Tab>
            <Tab
              style={!checkDisable ? { pointerEvents: 'none', opacity: 0.5 } : {}}
              onClick={() => {
                setTypeDate(ReportMerchantAmountEnum.YEAR);
                setIndexTab(3);
              }}>
              <span style={{ fontWeight: `${3 === 3 ? 'bold' : ''}` }}>{t('Năm')}</span>
            </Tab>
          </div>
        </TabList>
        <TabPanel></TabPanel>
      </Tabs>
      <ChartMerchantContainer dataChart={dataChart} />
      <TopJobMerchantContainer dataCateGory={dataCateGory} />
      <DataTableQuantityMerchant
        t={t}
        loading={loading}
        data={dataMerchants}
        totalFilter={totalRow}
        getDataList={handleGetMerchants}
      />
    </div>
  );
};

export default QuantityMerchantContainer;
