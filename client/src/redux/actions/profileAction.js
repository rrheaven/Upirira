import REST from '../../api/REST';
import { setAlert } from './alertAction';
import { SET_METRICS, CLEAR_METRICS, METRICS_ERROR } from '../types';
import setAuthToken from '../../utils/setAuthToken';

export const setMetrics = () => async dispatch => {
	try {
		const res = await REST.get('/api/transactions/metrics');
		dispatch({
			type: SET_METRICS,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: METRICS_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const clearMetrics = () => async dispatch => {
	try {
		dispatch({
			type: CLEAR_METRICS
		});
	} catch (err) {
		dispatch({
			type: METRICS_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
