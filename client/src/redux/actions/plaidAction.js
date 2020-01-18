import REST from '../../api/REST';
import {
	SET_PUBLIC_TOKEN,
	SET_PLAID_TRANSACTIONS,
	PLAID_ERROR
} from '../types';

export const setPublicToken = publicToken => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ publicToken });

	try {
		await REST.post('/api/plaid/auth/public_token', body, config);

		dispatch({
			type: SET_PUBLIC_TOKEN
		});
	} catch (err) {
		dispatch({
			type: PLAID_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const setPlaidTransactions = () => async dispatch => {
	try {
		const res = await REST.get('/api/plaid/transactions');

		dispatch({
			type: SET_PLAID_TRANSACTIONS,
			payload: res.data.transactions.transactions
		});
	} catch (err) {
		dispatch({
			type: PLAID_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
