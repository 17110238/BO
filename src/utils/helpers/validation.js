import { checkValidatePhone, validateEmail } from '.';

export const checkValue = (str, max) => {
  if (str.charAt(0) !== '0' || str === '00') {
    let num = parseInt(str);
    if (isNaN(num) || num <= 0 || num > max) num = 1;
    str =
      num > parseInt(max.toString().charAt(0)) && num.toString().length === 1
        ? '0' + num
        : num.toString();
  }
  return str;
};

export const checkStrSpecial = (str) => {
  if (str === '') {
    return null;
  }
  return str.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g);
};

export const checkStrHasWord = (str) => {
  if (str === '') {
    return null;
  }
  return str.match(/\D/g);
};

export default function validate(values, areaCheck) {
  let errors = {};

  if (!areaCheck) {
    if (!values.name) {
      errors.name = 'Tên gợi nhớ không được trống';
    }

    if (!values.group) {
      errors.group = 'Vui lòng chọn nhóm';
    }

    if (!values.number) {
      errors.number = 'Số tài khoản không được trống';
    }

    if (!values.swiftCode) {
      errors.swiftCode = 'Vui lòng chọn ngân hàng';
    }

    if (!values.accountName) {
      errors.accountName = 'Tên tài khoản không được trống';
    }

    if (!values.phone) {
      errors.phone = 'Số điện thoại không được trống';
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(String(values.phone).replace(/^84/, '0'))) {
      errors.phoneFormat = 'Số điện thoại không đúng đinh dạng';
    }

    if (values.isTab === 'bank') {
      delete errors.phone;
    } else {
      delete errors.number;
      delete errors.swiftCode;
    }
  }

  if (areaCheck === 'createProduct') {
    if (!values.label) {
      errors.label = 'Tên sản phẩm không được bỏ trống';
    }
    if (values.moneyTypeFiller === 'AUTO') {
      if (!String(values.fixedAmount)) {
        errors.fixedAmount = 'Giá sản phẩm không được bỏ trống';
      } else if (values.fixedAmount < 1) {
        errors.fixedAmountMinimum = 'Giá sản phẩm tối thiểu 1đ';
      }
    }
  }

  // validate for voucher
  if (areaCheck === 'voucher') {
    if (!values.name) {
      errors.name = 'Tên mã giảm giá không được trống';
    }
    if (!values.voucherCode) {
      errors.voucherCode = 'Mã giảm giá không được trống';
    } else if (values.voucherCode?.length < 4) {
      errors.voucherCodeMinLength = 'Mã giảm giá phải nhiều hơn 4 kí tự';
    }

    // if (!values.quantity) {
    //   errors.quantity = 'Số lượng mã không được trống';
    // } else {
    //   if (values.quantity < 1) {
    //     errors.rangeQuantity = 'Số lượng mã tối thiểu 1';
    //   }
    //   if (values.quantity > 1000000000) {
    //     errors.rangeQuantity = 'Số lượng mã tối đa 1 tỷ';
    //   }
    // }

    if (values.unit === 'PERCENT') {
      if (!values.maxDiscount) {
        errors.maxDiscount = 'Số tiền tối đa không được trống';
      } else {
        if (values.maxDiscount < 1000) {
          errors.maxDiscountMinimum = 'Tối thiểu 1,000đ';
        }
      }

      if (!values.amount) {
        errors.amount = 'Phần trăm giảm giá không được trống';
      } else {
        if (Number(values.amount) === 0) {
          errors.amountMinimum = 'Tối thiểu 1%';
        }
      }
    } else {
      if (!values.amount) {
        errors.amount = 'Số tiền giảm giá không được trống';
      } else {
        if (values.amount < 1000) {
          errors.minAmountByMoney = 'Tối thiểu 1,000đ';
        }
      }
    }

    if (values.conditional === 'APPLY') {
      if (!values.minAmount) {
        errors.minAmount = 'Số tiền tối thiểu không được trống';
      } else {
        if (values.minAmount < 1000) {
          errors.minAmountMinimum = 'Tối thiểu 1,000đ';
        }
      }
    }

    if (!values.expiredIn.fromDate || !values.expiredIn.fromDate) {
      errors.expiredIn = 'Vui lòng cung cấp đủ ngày bắt đầu và kết thúc';
    }
  }

  // validate add customer
  if (areaCheck === 'addCustomer') {
    if (!values.name) {
      errors.name = 'Customer name is required';
    }
    if (!!values.number && !checkValidatePhone(values.number).isValid) {
      errors.number = 'Phone number invalid';
    }
    if (!!values.email && !validateEmail(values.email)) {
      errors.email = 'Email invalid';
    }
  }

  // validate send mail / sms
  if (areaCheck === 'sendMailSMS') {
    if (values?.target?.length === 0) {
      errors.target = 'Vui lòng chọn người nhận'
    }
    if (!values?.email && !values?.sms) {
      errors.mailSMS = 'Vui lòng chọn hình thức gửi'
    }
  }

  return errors;
}
