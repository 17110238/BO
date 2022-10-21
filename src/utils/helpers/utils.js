export function getContrastYIQ(hexColor) {
  hexColor = hexColor?.replace('#', '');
  var r = parseInt(hexColor?.substr(0, 2), 16);
  var g = parseInt(hexColor?.substr(2, 2), 16);
  var b = parseInt(hexColor?.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 169 ? '#000' : '#fff';
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export function getCookie(cname, req, isSSR = true) {
  let name = cname + '=';

  let ca = req.headers.cookie?.split(';');

  if (!isSSR) {
    ca = document.cookie.split(';');
  }

  if (ca) {
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  }

  return '';
}

export function generateShortName(name = '') {
  if (name) {
    const shortName = name?.split(' ');
    if (shortName.length > 1) {
      return `${shortName[0][0]}${shortName[shortName.length - 1][0]}`;
    }
    return shortName[0][0];
  }
  return;
}

export function actionCreator(key) {
  return {
    REQUEST: `${key}:REQUEST`,
    SUCCESS: `${key}:SUCCESS`,
    FAILURE: `${key}:FAIL`,
    REFRESH: `${key}:REFRESH`,
  };
}

export function clearState(key) {
  localStorage.removeItem(key);
}

export function getToken(key) {
  try {
    const idToken = localStorage.getItem(key);
    return idToken;
  } catch (err) {
    clearToken();
    return undefined;
  }
}

export function saveToken(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    clearToken();
  }
}

export const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
  }
};

export function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str || '')));
}

export function checkValidatePhone(phone) {
  var PhoneConstant = [
    '086',
    '096',
    '097',
    '098',
    '032',
    '033',
    '034',
    '035',
    '036',
    '037',
    '038',
    '039',
    '089',
    '090',
    '093',
    '070',
    '079',
    '077',
    '076',
    '078',
    '088',
    '091',
    '094',
    '083',
    '084',
    '085',
    '081',
    '082',
    '092',
    '056',
    '058',
    '099',
    '059',
    '095',
  ];
  var result = {
    phone: formatPhone(phone, '84'),
    isValid: false,
  };
  if (result.phone.length !== 11) {
    return result;
  }
  if (result.phone.length !== 11 || isNaN(result.phone) === true) {
    return result;
  }
  var basodau = result.phone.replace('84', '0').substring(0, 3);
  var isFind = PhoneConstant.find((element) => element === basodau);
  if (isFind) {
    result.isValid = true;
    return result;
  }
  return result;
}

export function formatPhone(input, country = '84') {
  if (input == null) {
    input = '';
  }
  if (typeof country === 'undefined') {
    country = '84';
  }

  var newPhone = input
    .toString()
    .replace(/[^+0-9]/g, '')
    .replace(/^00/, '+')
    .replace(/^0/, '84');

  if (country !== '84') {
    return newPhone.replace(/^84/, '0');
  }
  return newPhone;
}

export function checkValidatePass(pass) {
  const arr = [
    '111111',
    '222222',
    '333333',
    '444444',
    '555555',
    '666666',
    '777777',
    '888888',
    '999999',
    '000000',
    '111222',
    '222333',
    '333444',
    '444555',
    '555666',
    '777888',
    '888999',
    '012345',
    // '123456',
    '234567',
    '345678',
    '456789',
    '567890',
    '098765',
    '987654',
    '876543',
    '765432',
    '654321',
    '543210',
    '001122',
    '112233',
    '223344',
    '334455',
    '445566',
    '556677',
    '667788',
    '778899',
    '889900',
    '009988',
    '998877',
    '887766',
    '776655',
    '665544',
    '554433',
    '443322',
    '332211',
    '221100',
    '012012',
    '123123',
    '234234',
    '345345',
    '456456',
    '567567',
    '678678',
    '789789',
    '890890',
    '098098',
    '987987',
    '876876',
    '765765',
    '654654',
    '543543',
    '432432',
    '321321',
    '210210',
  ];
  const str = pass || '';
  if (str !== '') {
    const tmp = arr.find((elem) => pass.indexOf(elem) !== -1);
    if (tmp) {
      return false;
    }
  }
  return true;
}

export function formatMoney(x) {
  return x.toLocaleString('en-US');
}

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function getFormatDateFull(input) {
  let newDate = input;
  if (newDate) {
    newDate = `${input}`.replace(/[/&\\=#,+($\]\[;~%.!@_^'":*?<>{}-]| /g, '');
  }
  if (newDate.length > 4) {
    return `${newDate.substring(0, 2)}/${newDate.substring(2, 4)}/${newDate.substring(
      4,
      newDate.length
    )}`;
  }
  if (newDate.length > 2) {
    return `${newDate.substring(0, 2)}/${newDate.substring(2, newDate.length)}`;
  }
  return newDate;
}

export function showPassword() {
  const iconLock = document.querySelector('img.icon-lock');
  const iconUnLock = document.querySelector('img.icon-unlock');

  const password = document.querySelector('input#password');

  if (password.type === 'password') {
    password.type = 'text';
    iconLock.style.display = 'none';
    iconUnLock.style.display = 'block';
  } else {
    password.type = 'password';
    iconLock.style.display = 'block';
    iconUnLock.style.display = 'none';
  }
}

export const DataFormater = (number) => {
  if (number > 1000000000 || -number > 1000000000) {
    return (number / 1000000000).toString() + 'B';
  } else if (number > 1000000 || -number > 1000000) {
    return (number / 1000000).toString() + 'M';
  } else if (number > 1000 || -number > 1000) {
    return (number / 1000).toString() + 'K';
  } else {
    return number.toString();
  }
};

export const countMonthOfYear = (num) => {
  num += 1;
  if (num === 1 || num === 3 || num === 5 || num === 7 || num === 8 || num === 10 || num === 12)
    return 31;
  else if (num === 4 || num === 6 || num === 9 || num === 11) return 30;
  else {
    let year = dayjs().year();
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return 29;
    else return 28;
  }
};

export const updateURLParameter = (url, param, paramVal) => {
  let newAdditionalURL = '';
  let tempArray = url.split('?');
  let baseURL = tempArray[0];
  let additionalURL = tempArray[1];
  let temp = '';
  if (additionalURL) {
    tempArray = additionalURL.split('&');
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split('=')[0] != param) {
        newAdditionalURL += temp + tempArray[i];
        temp = '&';
      }
    }
  }
  let rows_txt = temp + '' + param + '=' + paramVal;
  return baseURL + '?' + newAdditionalURL + rows_txt;
};
