import { SET_SELECTED, CLEAR_SELECTED, SELECTED_ERROR } from '../types';

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
			return {
				...state,
				loading: false,
				errors: false,
				selectedReceiver: null
			};
		case SELECTED_ERROR:
			return {
				...state,
				errors: payload
			};
		default:
			return state;
	}
}
