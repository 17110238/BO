export function actionCreator(key) {
  return {
    REQUEST: `${key}:REQUEST`,
    SUCCESS: `${key}:SUCCESS`,
    FAILURE: `${key}:FAIL`,
    REFRESH: `${key}:REFRESH`,
  }
}
