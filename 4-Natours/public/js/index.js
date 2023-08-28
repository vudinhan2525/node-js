/* eslint-disable */
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { updateData, updatePasswordData } from './updateSettings';
const mapBox = document.getElementById('map');
const form = document.querySelector('.login-form .form');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');

if (mapBox) {
    const locationsData = JSON.parse(mapBox.getAttribute('data'));
    displayMap(locationsData);
}
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        login(email, password);
    });
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
if (updateDataForm) {
    updateDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const name = document.querySelector('#name').value;
        updateData(name, email);
    });
}
if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.querySelector('#password-current').value;
        const newPassword = document.querySelector('#password').value;
        document.querySelector('.btn-save-password').innerText = '...UPDATING';
        const newPasswordConfirm =
            document.querySelector('#password-confirm').value;
        await updatePasswordData(password, newPassword, newPasswordConfirm);
        document.querySelector('#password-current').value = '';
        document.querySelector('#password').value = '';
        document.querySelector('#password-confirm').value = '';
        document.querySelector('.btn-save-password').innerText =
            'SAVE PASSWORD';
    });
}
