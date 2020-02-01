import {
	SET_GRAPH,
	CLEAR_GRAPH,
	GRAPH_ERROR,
	LOADING_GRAPH,
	LOGOUT
} from '../types';

const initialState = {
	graphData: {
		graphTitle: '',
		graphDates: [],
		graphAmounts: []
	},
	loading: true,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_GRAPH:
			return {
				...state,
				loading: false,
				graphData: payload
			};
		case CLEAR_GRAPH:
		case LOGOUT:
			return {
				...state,
				loading: false,
				graphData: {
					graphTitle: '',
					graphDates: [],
					graphAmounts: []
				}
			};
		case GRAPH_ERROR:
			return {
				...state,
				errors: payload
			};
		case LOADING_GRAPH:
			return {
				...state,
				loading: true
			};
		default:
			return state;
	}
}
