import axios from 'axios';
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
import { loadUser } from './authAction';
// import setAuthToken from '../../utils/setAuthToken';

export const setMetrics = () => async dispatch => {
	try {
		const res = await axios.get('/api/transactions/metrics');
		dispatch({
			type: SET_METRICS,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: METRICS_ERROR,
			payload: { msg: err.response }
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
			payload: { msg: err.response }
		});
	}
};

export const setGraph = (graphType = 'week') => async dispatch => {
	try {
		var res = {};
		if (graphType === 'month') {
			res = await axios.get('/api/transactions/month');
		} else if (graphType === 'year') {
			res = await axios.get('/api/transactions/year');
		} else {
			res = await axios.get('/api/transactions/week');
		}
		dispatch({
			type: SET_GRAPH,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: GRAPH_ERROR,
			payload: { msg: err.response }
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
			payload: { msg: err.response }
		});
	}
};

export const setSelected = () => async dispatch => {
	try {
		const res = await axios.get('/api/users/user/selectedReceiver');
		dispatch({
			type: SET_SELECTED,
			payload: res.data
		});
		dispatch(loadUser());
	} catch (err) {
		dispatch({
			type: SELECTED_ERROR,
			payload: { msg: err.response }
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
		await axios.post('/api/users/user/selectedReceiver', body, config);
		dispatch(setSelected());
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: SELECTED_ERROR,
			payload: { msg: err.response }
		});
	}
};

export const deleteSelected = id => async dispatch => {
	try {
		await axios.delete(`/api/users/user/selectedReceiver/${id}`);
		dispatch({
			type: CLEAR_SELECTED
		});
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: SELECTED_ERROR,
			payload: { msg: err.response }
		});
	}
};
