const generateGroup = (state, t) => {
  switch (state) {
    case "CUSTOMER": return (t("Khách hàng"));
    case "EMPLOYEE": return (t("Nhân viên"));
    case "PARTNER": return (t("Đối tác"));
    case "FRIEND": return (t("Bạn bè"));
    case "FAMILY": return (t("Gia đình"));
    default: return (t("Khác"))
  }
}
export default generateGroup