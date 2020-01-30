import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/actions/authAction';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import NavBar from './components/NavBar';

// Pages
import Landing from './pages/Landing';

// Utils
import setAuthToken from './utils/setAuthToken';
import Routes from './utils/Routes';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<div style={{ background: '#eceff1' }}>
					<NavBar />
					<Switch>
						<Route exact path='/' component={Landing} />
						<Route component={Routes} />
					</Switch>
				</div>
			</Router>
		</Provider>
	);
};

export default App;
