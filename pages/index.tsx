
import LinePaymentMethod from 'components/ChartMerchant/LinePaymentMethod';
import MainLayoutDarshboad from 'layouts/MainLayoutDarshboad';
import PieChartMerchant from 'components/ChartMerchant/PieChartMerchant';
import TopIncomeMerchant from 'components/TableMerchant/TopIncomeMerchant';
import BarChartType from 'components/ChartMerchant/BarChartType';
import { ChartFix } from 'components/ChartMerchant/Chartfix';

function Index() {
  return (
    <MainLayoutDarshboad>
      <ChartFix />
      <TopIncomeMerchant />
      <LinePaymentMethod />
      <PieChartMerchant />
    </MainLayoutDarshboad>
  );
}

export default Index;
