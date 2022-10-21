// import alert from 'utils/helpers/alert';
// import { useDispatch } from 'react-redux';
// export const exportFileWithLink = (linkUrl, cbSussed, cbFailure) => {
//   const dispatch = useDispatch();
//   Promise.resolve()
//     .then(() => {
//       dispatch(exportFileMerchantSoxketPending());
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           reject('Quá Hạn Thời Gian Vui Lòng Thử lại');
//           alert('error', 'Export thất bại');
//         }, 10000);
//         let url = `${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_PRODUCTION}${linkUrl}`;
//         localStorage.setItem('dowloadUrlExport', url);
//         let link = document.createElement('a');
//         link.href = url;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         resolve();
//       });
//     })
//     .then(() => {
//       localStorage.removeItem('dowloadUrlExport');

//       alert('success', 'Export thành công');
//       dispatch(cbSussed());
//       // dispatch(exportFileMerchantSoxketSuccess());
//     })
//     .catch((err) => {
//       dispatch(cbFailure());
//       // dispatch(exportFileMerchantSoxketFailure());
//       alert('error', 'Export thất bại');
//     });
// };
