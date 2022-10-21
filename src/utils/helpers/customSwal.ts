import Swal from 'sweetalert2';

export const swalCustom = Swal.mixin({
  customClass: {
    actions: 'w-100 px-5',
    confirmButton: 'btn btn-primary w-100 font-weight-bold',
    cancelButton: 'btn btn-white w-100 shadow-none',
  },
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEnterKey: false,
  allowEscapeKey: false,
  focusCancel: false,
  focusConfirm: false,

  showCancelButton: true,
  cancelButtonColor: '#c82333',
  cancelButtonText: 'Hủy bỏ',

  showConfirmButton: true,
  confirmButtonColor: '#00be00',
  confirmButtonText: 'Đồng ý',
});

export const swalVideoCustom = (src: string) => {
  return Swal.mixin({
    customClass: {
      htmlContainer: 'm-0',
      popup: 'popup-preview-video',
      closeButton: 'close-preview-video',
    },
    showCloseButton: true,
  }).fire({
    showConfirmButton: false,
    html: `<video
        src="${src}"
        preload="auto"
        controls=""
        style="width: 100%; height: 100%;"
      ></video>`,
  });
};
