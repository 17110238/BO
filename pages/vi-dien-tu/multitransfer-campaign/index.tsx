import MainLayout from 'layouts/MainLayout';
import MultitransferCampaignContainer from 'components/E-Wallet/MultitransferCampaign/MultitransferCampaignContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <MultitransferCampaignContainer />
    </MainLayout>
  );
}

export default index;
