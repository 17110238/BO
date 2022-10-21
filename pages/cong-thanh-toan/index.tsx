
import LinePaymentMethod from 'components/ChartMerchant/LinePaymentMethod';
import MainLayoutDarshboad from 'layouts/MainLayoutDarshboad';
import PieChartMerchant from 'components/ChartMerchant/PieChartMerchant';
import TopIncomeMerchant from 'components/TableMerchant/TopIncomeMerchant';
import BarChartType from 'components/ChartMerchant/BarChartType';
import { ChartFix } from 'components/ChartMerchant/Chartfix';
import { ChartFix1 } from 'components/ChartMerchant/fix';

function Index() {
  return (
    <MainLayoutDarshboad>
      <ChartFix1/>
       <ChartFix />
      <TopIncomeMerchant />
      <LinePaymentMethod />
      <PieChartMerchant />
    </MainLayoutDarshboad>
  );
}

export default Index;
