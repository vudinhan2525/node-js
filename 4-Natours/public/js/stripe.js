/* eslint-disable */
import axios from 'axios';
import { createAlert } from './alert';

const stripe = Stripe(
    'pk_test_51Nk6aqG3skkm9mcAFNbp3FKbHzV9RRA3aeu69NKp7S4YWfWW4LkBTBcIFuC5AUJUCSRKamtWvdMOtqudr1xLmJCq001Vyn4WCR',
);
const getSessions = async (tourId) => {
    try {
        const session = await axios(
            `http://127.0.0.1:8000/api/v1/bookings/checkout-sessions/${tourId}`,
        );
        await stripe.redirectToCheckout({
            sessionId: session.data.sessions.id,
        });
    } catch (error) {
        createAlert('error', error);
    }
};
export { getSessions };
