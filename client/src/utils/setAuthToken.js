import REST from '../api/REST';

const setAuthToken = token => {
	if (token) {
		REST.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	} else {
		delete REST.defaults.headers.common['Authorization'];
	}
};

export default setAuthToken;
