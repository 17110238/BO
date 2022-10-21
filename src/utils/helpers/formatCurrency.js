const formatCurrency = (num) => {
  if (num)
    return parseInt(num, 10)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  return 0;
};

export default formatCurrency;
