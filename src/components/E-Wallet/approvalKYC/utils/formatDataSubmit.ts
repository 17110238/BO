import { WalletKYC } from 'models';

export const formatDataSubmit = (data: WalletKYC) => {
  const { province, wards, district, image, face, video, merchant, ...submitData } = data as any;

  submitData.address.city = province?.identifyCode;
  submitData.address.district = district?.identifyCode;
  submitData.address.ward = wards?.identifyCode;

  submitData.frontImage = image?.front;
  submitData.backImage = image?.back;
  submitData.face = face?.face;
  submitData.video = video?.video;

  submitData.merchantInfo = merchant;

  //remove sub field;
  [
    'accountId',
    'appName',
    'accountType',
    'registeredAt',
    'approvedAt',
    'createdAt',
    'phone',
    'state',
    'kycAutoState',
    'addressString',
    'updatedAt',
  ].forEach((key) => {
    delete submitData[key];
  });

  return submitData;
};

export const formatDataSubmitAccount = (data: WalletKYC) => {
  const {
    province,
    wards,
    district,
    image,
    face,
    video,
    merchant,
    address,
    identifyNumber,
    issuedAt,
    placeOfIssue,
    ...submitData
  } = data as any;

  delete image.state;
  delete video.state;

  submitData.province = province?.identifyCode;
  submitData.district = district?.identifyCode;
  submitData.wards = wards?.identifyCode;
  submitData.address = address.street;

  submitData.kyc = {
    issuedAt: issuedAt,
    identifyNumber: identifyNumber,
    placeOfIssue: placeOfIssue,
    image: image,
    video: video,
  };

  submitData.kycMerchant = merchant;

  //remove sub field;
  [
    'nationality',
    'accountId',
    'appName',
    'registeredAt',
    'approvedAt',
    'createdAt',
    'phone',
    'state',
    'updatedAt',
  ].forEach((key) => {
    delete submitData[key];
  });

  return submitData;
};
