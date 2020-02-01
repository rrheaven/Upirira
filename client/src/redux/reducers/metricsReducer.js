import {
	SET_METRICS,
	CLEAR_METRICS,
	METRICS_ERROR,
	LOADING_METRICS,
	LOGOUT
} from '../types';

const initialState = {
	metrics: {
		oneDayTotal: null,
		oneWeekTotal: null,
		oneMonthTotal: null,
		oneYearTotal: null
	},
	loading: true,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_METRICS:
			return {
				...state,
				loading: false,
				metrics: payload
			};
		case CLEAR_METRICS:
		case LOGOUT:
			return {
				...state,
				loading: false,
				metrics: {
					oneDayTotal: null,
					oneWeekTotal: null,
					oneMonthTotal: null,
					oneYearTotal: null
				}
			};
		case METRICS_ERROR:
			return {
				...state,
				errors: payload
			};
		case LOADING_METRICS:
			return {
				...state,
				loading: true
			};
		default:
			return state;
	}
}
