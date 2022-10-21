import permissionRoleConstant from '../../constants/permissionRoleConstant';
export default function checkPermissionPath(listScope: any, path: any) {
  const scope: string[] = [];
  for (var index in permissionRoleConstant.ScopePath) {
    permissionRoleConstant.ScopePath[index]!.map((item) => {
      if (path === item) {
        scope.push(index);
      }
    });
  }
  
  if (scope.length === 0) {
    return true;
  }
  let result = false;
  scope.map((item) => {
    const find = listScope?.find((isscope: string) => item === isscope);
    if (find) {
      result = true;
    }
  });
  return result;
}
