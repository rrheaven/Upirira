import REST from '../../api/REST';
import { setAlert } from './alertAction';
import {
	SET_METRICS,
	CLEAR_METRICS,
	METRICS_ERROR,
	SET_GRAPH,
	CLEAR_GRAPH,
	GRAPH_ERROR,
	SET_PIE,
	CLEAR_PIE,
	PIE_ERROR
} from '../types';
import { loadUser } from './authAction';
import { setUnselectedReceivers } from './receiversAction';
// import setAuthToken from '../../utils/setAuthToken';

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

export const setPie = () => async dispatch => {
	try {
		const res = await REST.get('/api/users/user/pie');
		dispatch({
			type: SET_PIE,
			payload: res.data
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PIE_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const clearPie = () => async dispatch => {
	try {
		dispatch({
			type: CLEAR_PIE
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PIE_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const updatePieSlice = (
	{ percentage, receiverId, receiverName },
	action = 'update'
) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ percentage, receiverId, receiverName });

	try {
		await REST.post('/api/users/user/pie', body, config);
		await dispatch(setPie());
		await dispatch(loadUser());
		if (action === 'add') {
			await dispatch(setUnselectedReceivers());
		}
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PIE_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const deletePieSlice = id => async dispatch => {
	try {
		await REST.delete(`/api/users/user/pie/${id}`);
		dispatch(setPie());
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: PIE_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
