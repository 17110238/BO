import { useTranslation } from "react-i18next";

const formValidationInfo = (
  name,
  phone,
  email,
  t = (text) => {
    return text;
  }
) => {
  const errorFormInfor = {};
  // const phoneRegex = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g;
  const phoneRegex = /(84|03|07|08|09|01[2|6|8|9])+([0-9]{8,9})\b/g;
  if (!phoneRegex.test(phone)) {
    errorFormInfor.phone = t("Please enter the correct phone number format");
  }
  if (phone === "") {
    errorFormInfor.phone = "Contact number not be empty";
  }
  if (name === "") {
    errorFormInfor.fullName = "Contact name not be empty";
  }

  if (email === "") {
    errorFormInfor.email = "Contact email not be empty";
  }
  return errorFormInfor;
};

const validateBusinessOverview = (
  brandName,
  businessType,
  categoryName,
  description,
  maxRange,
  citizenPathFront,
  citizenPathBack,
  t = (text) => {
    return text;
  }
) => {
  // console.log("businessCategory: ", identifyImages);
  const errorFormInfor = {};

  if (!businessType) {
    errorFormInfor.businessType = t("Please select business type");
  }

  if (!brandName) {
    errorFormInfor.brandName = t("Please select branch name");
  }
  if (!categoryName) {
    errorFormInfor.categoryName = t("Please enter business category");
  }
  if (!description) {
    errorFormInfor.description = t("Description not be empty");
  }
  if (!maxRange) {
    errorFormInfor.maxRange = t("Please select average order value");
  }
  if (!citizenPathFront) {
    errorFormInfor.citizenFront = t("Please upload image");
  }

  if (!citizenPathBack) {
    errorFormInfor.citizenBack = t("Please upload image");
  }

  return errorFormInfor;
};

const isValidUrl = (urlString) => {
  var regexQuery = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    // "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";

  var url = new RegExp(regexQuery, "i");
  return url.test(urlString);
};

export { formValidationInfo, validateBusinessOverview, isValidUrl };
