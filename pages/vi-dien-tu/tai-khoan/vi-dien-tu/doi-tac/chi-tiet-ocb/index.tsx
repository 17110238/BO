import EwalletServiceBillReportContainer from 'components/E-Wallet/PartnerService/Detail/DetailEwalletServiceBillReport/EwalletServiceBillReportContainer';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';

function Index() {
  const router = useRouter();

  return (
    <MainLayout isFixedDatatable={true}>
      <EwalletServiceBillReportContainer title={'BILL_OCB'} />
    </MainLayout>
  );
}

export default Index;
