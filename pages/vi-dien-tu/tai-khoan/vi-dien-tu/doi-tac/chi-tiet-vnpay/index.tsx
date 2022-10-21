import EwalletHistoryReportContainer from 'components/E-Wallet/PartnerService/Detail/DetailEwalletHistoryReport/EwalletHistoryReportContainer';
import MainLayout from 'layouts/MainLayout';

function Index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <EwalletHistoryReportContainer title={'PAY_QRCODE'}/>
    </MainLayout>
  );
}

export default Index;