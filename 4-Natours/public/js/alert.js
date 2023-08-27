/* eslint-disable */
const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.parentElement.removeChild(alert);
    }
};
export const createAlert = (type, msg) => {
    hideAlert();
    const html = `<div class = "alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', html);
    setTimeout(() => {
        hideAlert();
    }, 3000);
};
