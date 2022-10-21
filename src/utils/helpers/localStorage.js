export function removeItem(key) {
  localStorage.removeItem(utoa(key));
}

export function clearLocal() {
  localStorage.clear();
}
export function getLocal(key) {
  try {
    let item = localStorage.getItem(utoa(key));
    if (!item) return false;
    let itemChanged = atou(item);
    return itemChanged;
    // return JSON.parse(itemChanged);
  } catch (err) {
    removeItem(key);
    return false;
  }
}

export function setLocal(key, value) {
  try {
    console.log("setLocal run....");
    localStorage.setItem(utoa(key), utoa(value));
  } catch (err) {
    localStorage.removeItem(key);
    console.log("set local fail: ", err);
  }
}

export function getToken(key) {
  try {
    const idToken = localStorage.getItem(key);
    if (idToken === null || idToken === "") {
      throw new Error("Token invalid !!!");
    }
    return idToken;
  } catch (err) {
    localStorage.removeItem(key);
    return undefined;
  }
}

export function saveToken(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    localStorage.removeItem(key);
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
/**
 * ASCII to Unicode (decode Base64 to original data)
 * @param {string} b64
 * @return {string}
 */
export function atou(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

/**
 * Unicode to ASCII (encode data to Base64)
 * @param {string} data
 * @return {string}
 */
export function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)));
}
