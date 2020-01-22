import REST from '../../api/REST';
import { setAlert } from './alertAction';
import {
	SET_METRICS,
	CLEAR_METRICS,
	METRICS_ERROR,
	SET_GRAPH,
	CLEAR_GRAPH,
	GRAPH_ERROR,
	SET_SELECTED,
	CLEAR_SELECTED,
	SELECTED_ERROR
} from '../types';
// import { loadUser } from './authAction';
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

export const setSelected = () => async dispatch => {
	try {
		const res = await REST.get('/api/users/user/selectedReceiver');
		dispatch({
			type: SET_SELECTED,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: SELECTED_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const addSelected = ({ receiverId }) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = JSON.stringify({ receiverId });

	try {
		await REST.post('/api/users/user/selectedReceiver', body, config);
		dispatch(setSelected());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: SELECTED_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};

export const deleteSelected = id => async dispatch => {
	try {
		await REST.delete(`/api/users/user/selectedReceiver/${id}`);
		dispatch({
			type: CLEAR_SELECTED
		});
		// dispatch(setSelected());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: SELECTED_ERROR,
			payload: { msg: err.response.statusText }
		});
	}
};
