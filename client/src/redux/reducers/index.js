import { combineReducers } from 'redux';

// Reducers
import alert from './alertReducer';
import auth from './authReducer';
import metrics from './metricsReducer';
import graph from './graphReducer';
import pie from './pieReducer';
import receivers from './receiversReducer';

export default combineReducers({
	alert,
	auth,
	metrics,
	graph,
	pie,
	receivers
});
