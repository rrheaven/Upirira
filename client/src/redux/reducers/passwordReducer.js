import {
	PASSWORD_ERROR,
	LOADING_PASSWORD,
	LOADED_PASSWORD,
	CLEAR_PASSWORD
} from '../types';

const initialState = {
	loading: false,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case LOADED_PASSWORD:
			return {
				...state,
				loading: false
			};
		case LOADING_PASSWORD:
			return {
				...state,
				loading: true
			};
		case CLEAR_PASSWORD:
			return {
				...state,
				loading: false,
				error: false
			};
		case PASSWORD_ERROR:
			return {
				...state,
				loading: false,
				error: payload
			};
		default:
			return state;
	}
}
