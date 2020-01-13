import REST from '../../api/REST';
import { setAlert } from './alertAction';
import {
	SET_METRICS,
	CLEAR_METRICS,
	METRICS_ERROR,
	SET_GRAPH,
	CLEAR_GRAPH,
	GRAPH_ERROR
} from '../types';
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

export const setGraph = (graphType = 'week') => async dispatch => {
	try {
		var res = {};
		if (graphType === 'month') {
			res = await REST.get('/api/transactions/month');
		} else if (graphType === 'year') {
			res = await REST.get('/api/transactions/year');
		} else {
			res = await REST.get('/api/transactions/week');
		}
		dispatch({
			type: SET_GRAPH,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GRAPH_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const clearGraph = () => async dispatch => {
	try {
		dispatch({
			type: CLEAR_GRAPH
		});
	} catch (err) {
		dispatch({
			type: GRAPH_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
