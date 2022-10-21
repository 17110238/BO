import MainLayout from 'layouts/MainLayout';
import TransactionContainer from 'components/TransactionsPage/TransactionPageContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <TransactionContainer />
    </MainLayout>
  );
}

export default index;
