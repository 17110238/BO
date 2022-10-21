import axios from 'axios';

export default (formData, options) => {
  return new Promise((resolve, reject) => {
    // console.log(formData.get('files'))
    axios
      .post(process.env.NEXT_PUBLIC_API_UPLOAD + '/Upload', formData, {
        ...options,
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Accept': 'application/doc'
        },
      })
      .then((res) => {
        setTimeout(() => {
          resolve(res);
        }, 500);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
