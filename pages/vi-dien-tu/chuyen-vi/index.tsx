import MainLayout from 'layouts/MainLayout';
import TransferContainer from 'components/E-Wallet/transfer/TransferContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <TransferContainer />
    </MainLayout>
  );
}

export default index;
