import axios from 'axios';
import { setAlert } from './alertAction';
import {
	SET_RECEIVERS,
	RECEIVERS_ERROR,
	SET_USER_RECEIVER,
	SET_RECEIVER_DASH_LINK,
	LOADING_RECEIVERS
} from '../types';

export const setReceivers = () => async dispatch => {
	try {
		dispatch({
			type: LOADING_RECEIVERS
		});
		const res = await axios.get('/api/receivers/');
		dispatch({
			type: SET_RECEIVERS,
			payload: res.data
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: RECEIVERS_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const setUserReceiver = () => async dispatch => {
	try {
		dispatch({
			type: LOADING_RECEIVERS
		});
		const res = await axios.get('/api/receivers/receiver');
		dispatch({
			type: SET_USER_RECEIVER,
			payload: res.data
		});

		const res2 = await axios.post('/api/receivers/receiver/dash');
		dispatch({
			type: SET_RECEIVER_DASH_LINK,
			payload: res2.data
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: RECEIVERS_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const updateReceiver = (
	firstName,
	lastName,
	description,
	image
) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ firstName, lastName, description, image });

	try {
		const res = await axios.post('/api/receivers/receiver', body, config);
		dispatch(setAlert(res.data.msg, 'success'));
		dispatch(setUserReceiver());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: RECEIVERS_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const receiverStripeAuth = () => async dispatch => {
	try {
		await axios.get('/api/receivers/receiver/auth');
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: RECEIVERS_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
