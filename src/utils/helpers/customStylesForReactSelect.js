const customStyles = {
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
  option: (provided, state) => ({
    ...provided,
    ':active': {
      backgroundColor: '#00be0069',
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: `1px solid #eff2f7`,
    background: '#EFF2F7 !important',
    borderRadius: '12px',
    padding: '0px 10px',
    color: '#00be00',
    height: '40px',
    minWidth: '107px',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};
export default customStyles;

export const customStylesV1 = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: `1px solid #eff2f7`,
    color: state.isSelected ? '#0b0b0b' : '#0b0b0b',
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
    background: '#EFF2F7 !important',
    borderRadius: '12px',
    padding: '0px 10px',
    color: '#00be00',
    height: '40px',
    minWidth: '107px',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};
