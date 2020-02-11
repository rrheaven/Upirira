import {
	SET_SELECTED,
	CLEAR_SELECTED,
	SELECTED_ERROR,
	LOADING_SELECTED,
	LOGOUT
} from '../types';

const initialState = {
	selectedReceiver: null,
	loading: true,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_SELECTED:
			return {
				...state,
				loading: false,
				errors: false,
				selectedReceiver: payload
			};
		case CLEAR_SELECTED:
		case LOGOUT:
			return {
				...state,
				loading: false,
				errors: false,
				selectedReceiver: null
			};
		case SELECTED_ERROR:
			return {
				...state,
				loading: false,
				errors: payload
			};
		case LOADING_SELECTED:
			return {
				...state,
				loading: true
			};
		default:
			return state;
	}
}
