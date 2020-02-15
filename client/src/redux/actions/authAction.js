import axios from 'axios';
import { setAlert } from './alertAction';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOADING,
	LOGOUT,
	CREATED_UNCONFIRMED_USER,
	USER_UPDATED
} from '../types';
import setAuthToken from '../../utils/setAuthToken';

// Load User Data
export const loadUser = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	try {
		dispatch({
			type: LOADING
		});

		const res = await axios.get('/api/users/user');

		dispatch({
			type: USER_LOADED,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: AUTH_ERROR
		});
	}
};

// Register User
export const register = ({
	firstName,
	lastName,
	email,
	password
}) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ firstName, lastName, email, password });

	try {
		dispatch({
			type: LOADING
		});

		await axios.post('/api/users/user/register', body, config);

		dispatch({
			type: CREATED_UNCONFIRMED_USER
		});

		dispatch(setAlert('Confirmation email sent', 'success'));

		// dispatch({
		// 	type: REGISTER_SUCCESS,
		// 	payload: res.data
		// });

		// dispatch(loadUser());
	} catch (err) {
		console.log(err.response.data.errors);
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: REGISTER_FAIL
		});
	}
};

// Login User
export const login = (email, password) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ email, password });

	try {
		dispatch({
			type: LOADING
		});

		const res = await axios.post('/api/users/user/login', body, config);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});

		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: LOGIN_FAIL
		});
	}
};

// Logout / Clear Profile
export const logout = () => dispatch => {
	dispatch({
		type: LOADING
	});
	dispatch({ type: LOGOUT });
};

export const confirmAccount = id => async dispatch => {
	try {
		dispatch({
			type: LOADING
		});

		const res = await axios.post(`/api/users/user/confirmAccount/${id}`);

		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data
		});

		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: LOGIN_FAIL
		});
	}
};

export const editUser = ({ firstName, lastName, email }) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ firstName, lastName, email });

	try {
		dispatch({
			type: LOADING
		});

		await axios.put(`/api/users/user/`, body, config);
		dispatch({
			type: USER_UPDATED
		});
		dispatch(setAlert('Account Updated', 'success'));

		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: LOGIN_FAIL
		});
	}
};
