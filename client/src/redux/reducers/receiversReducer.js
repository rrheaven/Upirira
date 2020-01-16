import { SET_RECEIVERS, CLEAR_RECEIVERS, RECEIVERS_ERROR } from '../types';

const initialState = {
	receiversData: [],
	loading: true
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_RECEIVERS:
			return {
				...state,
				loading: false,
				receiversData: payload
			};
		case CLEAR_RECEIVERS:
		case RECEIVERS_ERROR:
			return {
				...state,
				loading: false,
				receiversData: []
			};
		default:
			return state;
	}
}
