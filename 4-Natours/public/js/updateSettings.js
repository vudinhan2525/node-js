/* eslint-disable */
import axios from 'axios';
import { createAlert } from './alert';
const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
            data: {
                name,
                email,
            },
        });
        if (res.data.status === 'success') {
            createAlert('success', 'Update user data successfully!!');
        }
    } catch (error) {
        createAlert('error', error.response.data.message);
    }
};
export { updateData };
