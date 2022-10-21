import AccountWalletReportContainer from 'components/AccountantEwalletReport';
import MainLayout from 'layouts/MainLayout';

function Index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <AccountWalletReportContainer />
    </MainLayout>
  );
}

export default Index;
