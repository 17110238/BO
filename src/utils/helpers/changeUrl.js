function updateURLParameter(url, param, paramVal) {
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
}
export default updateURLParameter;

export const customStylesV1 = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: `1px solid #eff2f7`,
    color: state.isSelected ? '#fff' : '#0b0b0b',
    fontSize: '14px',
    fontFamily: 'Nunito Sans',
    height: 'auto',
    minHeight: '42px',
  }),
  menu: (provided, state) => ({
    ...provided,
    boxShadow: '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    zIndex: 9999,
  }),
  control: (provided, state) => ({
    ...provided,
    border: `1px solid #eff2f7`,
    background: '#EFF2F7',
    borderRadius: '12px',
    color: '#00be00',
    minHeight: '42px',
    height: 'auto',
    minWidth: '107px',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};
export const customStylesMuti = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: `1px solid #eff2f7`,
    color: state.isSelected ? '#fff' : '#0b0b0b',
    fontSize: '14px',
    fontFamily: 'Nunito Sans',
    height: 'auto',
    minHeight: '42px',
  }),
  menu: (provided, state) => ({
    ...provided,
    boxShadow: '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    zIndex: 1,
  }),
  control: (provided, state) => ({
    ...provided,
    border: `1px solid #eff2f7`,
    background: '#EFF2F7',
    borderRadius: '12px',
    color: '#00be00',
    minHeight: '42px',
    maxHeight: '65px',
    overflow: 'auto',
    minWidth: '107px',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};