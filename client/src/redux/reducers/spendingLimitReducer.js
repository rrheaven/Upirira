import {
	SET_SPENDING_LIMIT,
	CLEAR_SPENDING_LIMIT,
	SPENDING_LIMIT_ERROR,
	SPENDING_LIMIT_SELECTED,
	LOADING_SPENDING_LIMIT,
	LOGOUT
} from '../types';

const initialState = {
	currentLimit: null,
	loading: true,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_SPENDING_LIMIT:
			return {
				...state,
				loading: false,
				errors: false,
				spendingLimit: payload
			};
		case CLEAR_SPENDING_LIMIT:
		case LOGOUT:
			return {
				...state,
				loading: false,
				errors: false,
				spendingLimit: null
			};
		case SPENDING_LIMIT_ERROR:
			return {
				...state,
				loading: false,
				errors: payload
			};
		case SPENDING_LIMIT_SELECTED:
			return {
				...state,
				loading: true
			};
		case LOADING_SPENDING_LIMIT:
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}
}
