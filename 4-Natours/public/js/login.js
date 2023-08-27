/* eslint-disable */
import axios from 'axios';
import { createAlert } from './alert';
const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            createAlert('success', 'Login Successfully!!!');
            setTimeout(() => {
                location.href = '/';
            }, 1500);
        }
    } catch (error) {
        createAlert('error', error.response.data.message);
    }
};
const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            location.href = '/';
            createAlert('success', 'Logout success');
        }
    } catch (error) {
        createAlert('error', 'Error loging out');
    }
};
export { login, logout };
