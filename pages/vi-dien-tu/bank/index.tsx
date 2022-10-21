import MainLayout from 'layouts/MainLayout';
import ConnectedWalletContainer from 'components/E-Wallet/conntected/ConnectedWalletContainer';

function index() {
  return (
    <MainLayout>
      <ConnectedWalletContainer />
    </MainLayout>
  );
}

export default index;
