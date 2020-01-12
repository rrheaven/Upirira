import { SET_GRAPH, CLEAR_GRAPH, GRAPH_ERROR } from '../types';

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
		default:
			return state;
	}
}
