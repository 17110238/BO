import MainLayout from 'layouts/MainLayout';
import TransferDetailContainer from 'components/E-Wallet/transfer/detail/TransferDetailContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <TransferDetailContainer />
    </MainLayout>
  );
}

export default index;
