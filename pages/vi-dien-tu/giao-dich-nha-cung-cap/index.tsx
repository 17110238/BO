import MainLayout from 'layouts/MainLayout';
import TransactionSupplierContainer from 'components/E-Wallet/transactionSupplier/TransactionSupplierContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <TransactionSupplierContainer />
    </MainLayout>
  );
}

export default index;
