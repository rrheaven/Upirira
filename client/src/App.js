import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import NavBar from './components/NavBar';

// Pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dash from './pages/Dash';
import Search from './pages/Search';
import Settings from './pages/Settings';

// Bootstrap
import Container from 'react-bootstrap/Container';

const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<NavBar />
					<Route exact path='/' component={Landing} />
					<Container>
						<Switch>
							<Route exact path='/login' component={Login} />
							<Route exact path='/register' component={Register} />
							<Route exact path='/dash' component={Dash} />
							<Route exact path='/search' component={Search} />
							<Route exact path='/settings' component={Settings} />
						</Switch>
					</Container>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
