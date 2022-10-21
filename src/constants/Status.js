const renderStatus = (state) => {
  if (!state) return;

  switch (state) {
    case 'REFUNDED':
    case 'REVIEW':
    case 'NEW':
      return 'state-refunded-modal';
    case 'SUCCEEDED':
    case 'SUCCESS':
    case 'RECEIVED':
    case 'USED':
    case 'CLAIMED':
    case 'AUTHORIZED':
    case 'VALID':
    case 'TRANSFERED':
      return 'state-success-modal';
    case 'FINISHED':
      return 'state-success-modal';
    case 'PENDING':
    case 'NEW':
    case 'WAITING':
    case 'TRANSFERING':
    case 'PROCESSING':
      return 'state-pending-modal';
    case 'EXPIRED':
      return 'state-cancel-payment-modal';
    default:
      return 'state-cancel-modal';
  }
};

export default renderStatus;

export const renderStatusAccountant = (state) => {
  if (!state) return;

  switch (state) {
    case 'DEPOSITED':
      return 'state-refunded-modal';
    case 'COMPLETED':
    case 'RECEIVED':
    case 'USED':
    case 'CLAIMED':
    case 'AUTHORIZED':
      return 'state-success-modal';
    case 'PENDING':
      return 'state-pending-modal';
    case 'CANCELED':
      return 'state-cancel-payment-modal';
      case 'CONFIRMED':
        return 'state-refunded-modal';
    default:
      return 'state-cancel-modal';
      
  }
};
