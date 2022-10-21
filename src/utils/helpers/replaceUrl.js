import _ from 'lodash';

export const handleReplaceUrl = (query, router) => {
  const cloneQuery = {
    ...query,
    ...(query?.createdAt?.from ? { from: query?.createdAt?.from } : {}),
    ...(query?.createdAt?.to ? { to: query?.createdAt?.to } : {}),
  };

  delete cloneQuery.createdAt;

  const params = Object.keys(cloneQuery)
    .map(function (key) {
      return key + '=' + cloneQuery[key];
    })
    .join('&');

  router.push({ pathname: router.pathname, query: params });
};

export const handleReplaceUrlv2 = (query, router) => {
  const cloneQuery = {
    ...query,
    ...(query?.approvedAt?.from ? { from: query?.approvedAt?.from } : {}),
    ...(query?.approvedAt?.to ? { to: query?.approvedAt?.to } : {}),
    ...(query?.createdAt?.from ? { from: query?.createdAt?.from } : {}),
    ...(query?.createdAt?.to ? { to: query?.createdAt?.to } : {}),
  };

  delete cloneQuery.approvedAt;
  delete cloneQuery.createdAt;

  const params = Object.keys(cloneQuery)
    .map(function (key) {
      return key + '=' + cloneQuery[key];
    })
    .join('&');

  router.push({ pathname: router.pathname, query: params });
};

export const clearFalsyObject = (obj) => {
  return _.pickBy(JSON.parse(JSON.stringify(obj)));
};
