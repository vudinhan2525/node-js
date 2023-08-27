/* eslint-disable */
import { displayMap } from './leaflet';
import { login, logout } from './login';
const mapBox = document.getElementById('map');
const form = document.querySelector('.login-form .form');
const logoutBtn = document.querySelector('.nav__el--logout');
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
