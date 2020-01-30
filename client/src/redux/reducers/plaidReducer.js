import {
	SET_PUBLIC_TOKEN,
	GET_ACCESS_TOKEN,
	SET_PLAID_TRANSACTIONS,
	SET_PLAID_ITEMS,
	PLAID_ERROR,
	CLEAR_PLAID_ITEMS,
	LOGOUT
} from '../types';

const initialState = {
	transactionsData: [],
	plaidItems: {},
	loading: true,
	errors: false
};

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_PLAID_ITEMS:
			return {
				...state,
				plaidItems: payload,
				loading: false
			};
		case CLEAR_PLAID_ITEMS:
		case LOGOUT:
			return {
				...state,
				plaidItems: null,
				loading: false
			};
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
				transactionsData: [],
				plaidItems: null
			};
		case GET_ACCESS_TOKEN:
		case SET_PUBLIC_TOKEN:
		default:
			return state;
	}
}
