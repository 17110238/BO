import MainLayout from 'layouts/MainLayout';
import StaffManageContainer from 'components/E-Wallet/MultitransferCampaign/member/StaffManageContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <StaffManageContainer />
    </MainLayout>
  );
}

export default index;
