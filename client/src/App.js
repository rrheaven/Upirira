import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import NavBar from './components/NavBar';

// Pages
import landing from './pages/landing';
import register from './pages/register';
import login from './pages/login';
import dash from './pages/dash';
import search from './pages/search';
import settings from './pages/settings';

// Bootstrap
import Container from 'react-bootstrap/Container';

const App = () => {
	return (
		<Router>
			<Fragment>
				<NavBar />
				<Route exact path='/' component={landing} />
				<Container>
					<Switch>
						<Route exact path='/login' component={login} />
						<Route exact path='/register' component={register} />
						<Route exact path='/dash' component={dash} />
						<Route exact path='/search' component={search} />
						<Route exact path='/settings' component={settings} />
					</Switch>
				</Container>
			</Fragment>
		</Router>
	);
};

export default App;
