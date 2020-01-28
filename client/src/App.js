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
import Alerts from './components/Alerts';

// Pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dash from './pages/Dash';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Receiver from './pages/receiverPages/Receiver';

// Bootstrap
import Container from 'react-bootstrap/Container';

// Utils
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './utils/PrivateRoute';

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
					<Route exact path='/' component={Landing} />
					<Container>
						<Alerts />
						<Switch>
							<Route exact path='/login' component={Login} />
							<Route exact path='/register' component={Register} />
							<PrivateRoute exact path='/dash' component={Dash} />
							<PrivateRoute exact path='/search' component={Search} />
							<PrivateRoute exact path='/receiver' component={Receiver} />
							<PrivateRoute exact path='/settings' component={Settings} />
						</Switch>
					</Container>
				</div>
			</Router>
		</Provider>
	);
};

export default App;
