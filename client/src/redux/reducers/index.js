import { combineReducers } from 'redux';

// Reducers
import alertReducer from './alertReducer';

export default combineReducers({
	alert: alertReducer
});
