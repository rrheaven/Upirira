import REST from '../../api/REST';
import { setAlert } from './alertAction';
import { SET_RECEIVERS, CLEAR_RECEIVERS, RECEIVERS_ERROR } from '../types';

export const setUnselectedReceivers = () => async dispatch => {
	try {
		const res = await REST.get('/api/receivers/user/unselected');
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
