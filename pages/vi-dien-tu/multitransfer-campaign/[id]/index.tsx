import MainLayout from 'layouts/MainLayout';
import DetailMultitransferCampaignContainer from 'components/E-Wallet/MultitransferCampaign/detail/DetailMultitransferCampaignContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <DetailMultitransferCampaignContainer />
    </MainLayout>
  );
}

export default index;
