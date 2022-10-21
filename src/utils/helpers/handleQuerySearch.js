const convertToQueryString = (obj) => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const removeEmpty = (obj) => {
  let finalObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      const nestedObj = removeEmpty(obj[key]);
      if (Object.keys(nestedObj).length) {
        finalObj[key] = nestedObj;
      }
    } else if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
      finalObj[key] = obj[key];
    }
  });
  return finalObj;
}

export {
  convertToQueryString,
  removeEmpty
}