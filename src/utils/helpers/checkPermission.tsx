import _ from 'lodash';
/**
 *
 * @param {*} listScope [array || null] danh sách scope của user
 * @param {*} scope [array] scope cần kiểm tra, =null mặt định true
 * @returns
 */

export default function checkPermission(listScope: string[] | null, scope: string[] | null = []) {
  if (listScope === null || scope === null) {
    return true;
  }
  if (!Array.isArray(scope) || !Array.isArray(listScope)) {
    return false;
  }
  let rs = false;
  scope.map((isscope) => {
    const find = listScope.find((item) => item === isscope);
    if (find) {
      rs = true;
    }
  });
  return rs;
}
