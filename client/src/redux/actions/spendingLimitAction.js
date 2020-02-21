import axios from 'axios';
import { setAlert } from './alertAction';
import { loadUser } from './authAction';
import {
	SET_SPENDING_LIMIT,
	CLEAR_SPENDING_LIMIT,
	SPENDING_LIMIT_ERROR,
	SPENDING_LIMIT_SELECTED,
	LOADING_SPENDING_LIMIT
} from '../types';

export const setSpendingLimit = ({
	amountLimit,
	timePeriodLimit
}) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	amountLimit = parseInt(amountLimit.slice(1));
	const body = JSON.stringify({ amountLimit, timePeriodLimit });
	try {
		dispatch({
			type: LOADING_SPENDING_LIMIT
		});
		const res = await axios.post('/api/users/user/spendingLimit', body, config);

		dispatch({
			type: SET_SPENDING_LIMIT,
			payload: res.data
		});
		dispatch(loadUser());
	} catch (err) {
		dispatch({
			type: SPENDING_LIMIT_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const clearSpendingLimit = () => async dispatch => {
	try {
		await axios.delete('/api/users/user/spendingLimit');

		dispatch({
			type: CLEAR_SPENDING_LIMIT
		});
		dispatch(loadUser());
	} catch (err) {
		dispatch({
			type: SPENDING_LIMIT_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
