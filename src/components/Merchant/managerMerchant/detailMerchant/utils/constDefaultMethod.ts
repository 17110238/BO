const defaultMethod = {
  2: {
    isTransferNow: false,
    serviceCode: 'WL1',
  },
  5: {
    isTransferNow: false,
    type: 'DEFAULT',
    supplier: 'ALIPAY',
    forexExchangeType: 'REUTER',
  },
  7: {
    isTransferNow: false,
    type: 'DEFAULT',
    supplier: 'ALIPAY',
    forexExchangeType: 'REUTER',
  },
  606: {
    isTransferNow: false,
    type: 'DEFAULT',
    supplier: 'PVCOMBANK',
  },
  612: {
    isTransferNow: false,
    isCapture: true,
    is3DSecure: true,
    mid: '4',
    type: 'MANUAL',
    supplier: 'SACOMBANK',
  },
  618: {
    isTransferNow: false,
    isCapture: true,
    is3DSecure: true,
    mid: '4',
    type: 'MANUAL',
    supplier: 'SACOMBANK',
  },
};

export default defaultMethod;
