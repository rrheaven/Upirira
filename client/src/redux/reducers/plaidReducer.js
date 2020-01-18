import {
	SET_PUBLIC_TOKEN,
	GET_ACCESS_TOKEN,
	SET_PLAID_TRANSACTIONS,
	PLAID_ERROR
} from '../types';

const initialState = {
	transactionsData: [],
	loading: true,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_PLAID_TRANSACTIONS:
			return {
				...state,
				transactionsData: payload,
				loading: false
			};
		case PLAID_ERROR:
			return {
				...state,
				loading: false,
				receiversData: []
			};
		case GET_ACCESS_TOKEN:
		case SET_PUBLIC_TOKEN:
		default:
			return state;
	}
}
