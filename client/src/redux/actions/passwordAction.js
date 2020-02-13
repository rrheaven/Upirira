import axios from 'axios';
import { setAlert } from './alertAction';
import {
	PASSWORD_ERROR,
	LOADING_PASSWORD,
	LOADED_PASSWORD,
	CLEAR_PASSWORD
} from '../types';

export const sendChangePasswordEmail = ({ email }) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ email });

	try {
		dispatch({
			type: LOADING_PASSWORD
		});
		await axios.post('/api/users/user/changePassword', body, config);
		dispatch({
			type: LOADED_PASSWORD
		});
		dispatch(setAlert('Change password email has been sent', 'success'));
	} catch (err) {
		console.log(err.response.data.errors);
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PASSWORD_ERROR,
			payload: { msg: err.response }
		});
	}
};

export const setNewPassword = ({ password }, id) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ password });

	try {
		dispatch({
			type: LOADING_PASSWORD
		});
		await axios.post(`/api/users/user/newPassword/${id}`, body, config);
		dispatch({
			type: LOADED_PASSWORD
		});
		dispatch(setAlert('Password has been changed', 'success'));
	} catch (err) {
		console.log(err.response.data.errors);
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PASSWORD_ERROR,
			payload: { msg: err.response }
		});
	}
};
