export default (phone) => {
    if (!phone || phone.length !== 10) return;
    return phone.slice(0, 4) + ' ' + phone.slice(4, 7) + ' ' + phone.slice(7);
}