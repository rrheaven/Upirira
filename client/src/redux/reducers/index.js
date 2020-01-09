import { combineReducers } from 'redux';

// Reducers
import alert from './alertReducer';
import auth from './authReducer';

export default combineReducers({
	alert,
	auth
});
