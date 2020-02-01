import axios from 'axios';
import { setAlert } from './alertAction';
import { loadUser } from './authAction';
import {
	SET_PUBLIC_TOKEN,
	SET_PLAID_TRANSACTIONS,
	PLAID_ERROR,
	SET_PLAID_ITEMS,
	CLEAR_PLAID_ITEMS,
	LOADING_PLAID
} from '../types';

export const setPublicToken = (
	publicToken,
	accountId,
	name
) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ publicToken, accountId, name });

	try {
		dispatch({
			type: LOADING_PLAID
		});

		await axios.post('/api/plaid/auth/public_token', body, config);

		dispatch({
			type: SET_PUBLIC_TOKEN
		});

		dispatch(setPlaidItems());
		dispatch(loadUser());
	} catch (err) {
		dispatch({
			type: PLAID_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const setPlaidTransactions = () => async dispatch => {
	try {
		const res = await axios.get('/api/plaid/transactions');

		dispatch({
			type: SET_PLAID_TRANSACTIONS,
			payload: res.data
		});
		dispatch(loadUser());
	} catch (err) {
		dispatch({
			type: PLAID_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const setPlaidItems = () => async dispatch => {
	try {
		const res = await axios.get('/api/plaid/user/items');

		dispatch({
			type: SET_PLAID_ITEMS,
			payload: res.data
		});
		dispatch(loadUser());
	} catch (err) {
		dispatch({
			type: PLAID_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const deletePlaidItem = id => async dispatch => {
	try {
		await axios.delete(`/api/plaid/user/item/${id}`);
		dispatch({
			type: CLEAR_PLAID_ITEMS
		});
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PLAID_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
