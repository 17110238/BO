const renderState = (state) => {
  switch (state) {
    case 'CREATED':
      return 'Created';
    case 'COMPLETED':
      return 'Completed';
    case 'PAID':
      return 'Paid';
    case 'SUCCEEDED':
      return 'Succeeded';
    case 'SUCCESS':
      return 'Success';
    case 'PENDING':
      return 'Pending';
    case 'EXPIRED':
      return 'Expired';
    case 'CANCELED':
      return 'Canceled';
    case 'CANCELLED':
      return 'Cancelled';
    case 'CANCELED_SUCCEEDED':
      return 'Payment Canceled';
    case 'FAILED':
      return 'Failed';
    case 'FAIL':
      return 'Fail';
    case 'REFUNDED':
      return 'Refunded';
    case 'REFUNDING':
      return 'Refunding';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'DEPOSITED':
      return 'Deposited';
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'PAUSED':
      return 'Paused';
    case 'ATTEMPTED':
      return 'Attempted';
    case 'CLAIMED':
      return 'Claimed';
    case 'REVIEW':
      return 'REVIEW';
    case 'VALID':
      return 'Valid';
    case 'INVALID':
      return 'Invalid';
    case 'TRANSFERING':
      return 'Transfering';
    case 'TRANSFERED':
      return 'Transfered';
    case 'NEW':
      return 'New';
    case 'FINISHED':
      return 'Finished';
    case 'WAITING':
      return 'Waiting';
    case 'PROCESSING':
      return 'Processing';

  
    default:
      return '';
  }
};

export default renderState;
