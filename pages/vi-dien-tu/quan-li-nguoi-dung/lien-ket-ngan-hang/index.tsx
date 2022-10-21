import LinkedBanks from 'components/LinkedBanks';
import MainLayout from 'layouts/MainLayout';

const LinkManager = () => {
  return (
    <MainLayout isFixedDatatable={true}>
      <LinkedBanks />
    </MainLayout>
  );
};

export default LinkManager;
