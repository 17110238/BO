export default function alert(type, message, t, isCancelSuccess) {
  const elm = document.getElementById('idAlert');
  if (elm) {
    elm.remove();
  }
  let html = `<div id="idAlert" class="cls-${type}">
        <div class="cls-alertContent text-center">
        ${
          isCancelSuccess
            ? `<img src="/assets/img/cancel-success.svg" />`
            : `<img src = "/assets/img/${type}.png" /> `
        }
          <p>${message}</p>
          <button class="btn btn-alert-${type}" onClick="document.getElementById('idAlert').remove()">${
    t ? t('Close') : 'Close'
  }</button>
        </div>
      </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
