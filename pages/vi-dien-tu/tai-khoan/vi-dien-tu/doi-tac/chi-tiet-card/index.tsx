import EwalletGateReportContainer from 'components/E-Wallet/PartnerService/Detail/DetailEwalletGateReport/EwalletGateReportContainer';
import MainLayout from 'layouts/MainLayout';

function Index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <EwalletGateReportContainer title={'GATE_CARD'}/>
    </MainLayout>
  );
}

export default Index;