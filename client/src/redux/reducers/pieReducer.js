import { SET_PIE, CLEAR_PIE, PIE_ERROR } from '../types';

const initialState = {
	pieData: {
		pieNames: [],
		pieAmounts: []
	},
	loading: true,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_PIE:
			return {
				...state,
				loading: false,
				pieData: payload
			};
		case CLEAR_PIE:
			return {
				...state,
				loading: false,
				pieData: {
					pieNames: [],
					pieAmounts: []
				}
			};
		case PIE_ERROR:
			return {
				...state,
				errors: payload
			};
		default:
			return state;
	}
}
