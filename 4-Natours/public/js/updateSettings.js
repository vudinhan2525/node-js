/* eslint-disable */
import axios from 'axios';
import { createAlert } from './alert';
const updateData = async (data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data,
        });
        if (res.data.status === 'success') {
            createAlert('success', 'Update user data successfully!!');
        }
    } catch (error) {
        createAlert('error', error.response.data.message);
    }
};
const updatePasswordData = async (
    password,
    newPassword,
    newPasswordConfirm,
) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updatePassword',
            data: {
                password,
                newPassword,
                newPasswordConfirm,
            },
        });
        if (res.data.status === 'success') {
            createAlert('success', 'Update password successfully!!!');
        }
    } catch (error) {
        createAlert('error', error.response.data.message);
    }
};
export { updateData, updatePasswordData };
